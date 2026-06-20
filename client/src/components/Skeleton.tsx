interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  variant?: 'text' | 'title' | 'avatar' | 'rect'
  style?: React.CSSProperties
}

export default function Skeleton({
  width,
  height,
  className = '',
  variant = 'rect',
  style,
}: SkeletonProps) {
  const variantClass = `skeleton skeleton--${variant}`

  return (
    <span
      className={`${variantClass} ${className}`.trim()}
      aria-hidden="true"
      style={{
        display: 'block',
        width: width ?? '100%',
        height: height ?? (variant === 'text' ? 14 : variant === 'title' ? 20 : 40),
        ...style,
      }}
    />
  )
}
