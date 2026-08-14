import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-hover shadow-sm disabled:bg-brand/50',
  secondary: 'bg-accent text-white hover:bg-blue-700 shadow-sm disabled:bg-accent/50',
  outline: 'border border-line bg-white text-ink hover:bg-canvas disabled:text-ink-muted',
  ghost: 'text-ink-muted hover:bg-canvas hover:text-ink',
  danger: 'bg-danger text-white hover:bg-red-700 shadow-sm disabled:bg-danger/50',
  soft: 'bg-brand-soft text-brand-hover hover:bg-teal-100',
}

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-[8px]',
  md: 'h-10 px-4 text-sm rounded-control',
  lg: 'h-11 px-5 text-sm rounded-control',
}

export function Button({ as: Component = 'button', variant = 'primary', size = 'md', className, type, disabled, children, ...props }) {
  return (
    <Component
      type={Component === 'button' ? type ?? 'button' : undefined}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
