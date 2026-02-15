const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  primary: {
    background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
    color: '#fff',
    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
  },
  secondary: {
    background: '#F1F5F9',
    color: '#0F172A',
    border: '1px solid #E2E8F0',
  },
  ghost: {
    background: 'transparent',
    color: '#64748B',
  },
  small: {
    padding: '8px 16px',
    fontSize: '0.85rem',
  },
  large: {
    padding: '16px 32px',
    fontSize: '1.05rem',
  },
}

export default function Button({ children, variant = 'primary', size, style, onClick, ...props }) {
  const sizeStyle = size === 'small' ? styles.small : size === 'large' ? styles.large : {}

  return (
    <button
      onClick={onClick}
      style={{ ...styles.base, ...styles[variant], ...sizeStyle, ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
