export default function Card({ children, style, hover = true, className = '', ...props }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        padding: '24px',
        ...(hover ? {} : { transform: 'none' }),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
