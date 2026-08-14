import logo from '../../assets/logo.png'
import { cn } from '../../utils/cn'

const sizes = {
  sm: { full: 'h-8', mark: 'h-8 w-8' },
  md: { full: 'h-9', mark: 'h-10 w-10' },
  lg: { full: 'h-12', mark: 'h-12 w-12' },
  xl: { full: 'h-16', mark: 'h-16 w-16' },
}

export function BrandLogo({ variant = 'full', size = 'md', className }) {
  const isMark = variant === 'mark'
  return (
    <img
      src={logo}
      alt="Freej Trivia"
      className={cn(
        'block rounded-lg bg-black',
        isMark ? `${sizes[size].mark} object-cover object-center` : `${sizes[size].full} w-auto max-w-full object-contain object-left`,
        className,
      )}
    />
  )
}
