// ─────────────────────────────────────────────────────────────────────────────
// src/routes/ai.ts — AI copy generation endpoint
//
// POST /api/ai/generate
//   → Accepts a user prompt, calls the LLM, returns {header, subheader}
//
// This is protected — only logged-in users can generate AI copy.
// Rate limiting should be added in production (e.g. per-user, 10 req/min).
//
// Why separate from portfolio routes?
//   The AI endpoint is stateless — it doesn't read/write the DB.
//   Keeping it separate makes it easy to swap LLM providers, add caching,
//   or move it to a serverless function later without touching portfolio logic.
//
// LLM approach:
//   We use the OpenAI Chat Completions API (gpt-4o-mini for cost efficiency).
//   The system prompt is carefully crafted to return valid JSON every time —
//   we use Zod to validate the response before forwarding to the client.
//   If the LLM fails or returns malformed JSON, we return a 502 with a clear
//   message so the UI can show an appropriate error state.
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from 'express'
import { z } from 'zod'

export const aiRouter = Router()

// ── Request/response schemas ─────────────────────────────────────────────────
const aiRequestSchema = z.object({
  prompt: z.string().min(3, 'Prompt is too short.').max(500, 'Prompt is too long.'),
})

const aiResponseSchema = z.object({
  header:    z.string(),
  subheader: z.string(),
})

// ── POST /api/ai/generate ────────────────────────────────────────────────────
aiRouter.post('/generate', async (req, res) => {
  const parsed = aiRequestSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Validation failed.', details: parsed.error.flatten() })
    return
  }

  const { prompt } = parsed.data

  // ── If no OpenAI key configured, return a mock for development ──────────
  // This lets the UI and AI panel be tested without burning API credits.
  if (!process.env.OPENAI_API_KEY) {
    console.warn('[AI] No OPENAI_API_KEY set — returning mock response.')
    res.json({
      header:    `${prompt.split(' ').slice(0, 4).join(' ')} — Professional`,
      subheader: `Experienced professional passionate about ${prompt}. Delivering exceptional results with a focus on quality, collaboration, and continuous growth.`,
    })
    return
  }

  try {
    // ── Call OpenAI Chat Completions API ─────────────────────────────────
    // We use fetch (Node 18+) to avoid adding the openai SDK as a dep.
    // This keeps the server lightweight; add the SDK if you need streaming.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' }, // Force valid JSON output
        messages: [
          {
            role: 'system',
            content: `You are a professional copywriter helping people write compelling portfolio headlines.
Given a short description of a person's background, generate:
1. A concise, impactful header (job title / professional identity, max 8 words)
2. A compelling subheader paragraph (2-3 sentences, max 60 words)

Respond ONLY with valid JSON in this exact format:
{"header": "...", "subheader": "..."}

Make the copy professional, specific, and achievement-oriented. Avoid generic phrases like "passionate about" or "dedicated to".`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('[AI] OpenAI API error:', response.status, errText)
      res.status(502).json({ error: 'AI service unavailable. Please try again.' })
      return
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>
    }

    const rawContent = data.choices?.[0]?.message?.content
    if (!rawContent) {
      res.status(502).json({ error: 'AI returned an empty response.' })
      return
    }

    // ── Validate AI response shape with Zod ──────────────────────────────
    // Even with response_format: json_object, the LLM might return the right
    // JSON but wrong fields. Zod catches this before we forward bad data.
    const aiResult = aiResponseSchema.safeParse(JSON.parse(rawContent))
    if (!aiResult.success) {
      console.error('[AI] Unexpected response shape:', rawContent)
      res.status(502).json({ error: 'AI returned an unexpected format.' })
      return
    }

    res.json(aiResult.data)
  } catch (err) {
    console.error('[AI] Unexpected error:', err)
    res.status(500).json({ error: 'Failed to generate copy. Please try again.' })
  }
})
