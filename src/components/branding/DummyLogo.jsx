import { Crown } from 'lucide-react'
import { cn } from '../../utils/cn'

const sizes = {
  sm: {
    box: 'h-8 w-8 rounded-[10px]',
    icon: 16,
    title: 'text-[11px] leading-4',
    subtitle: 'text-[9px] leading-3',
    gap: 'gap-2.5',
  },
  md: {
    box: 'h-10 w-10 rounded-[12px]',
    icon: 18,
    title: 'text-[13px] leading-4',
    subtitle: 'text-[10px] leading-3.5',
    gap: 'gap-3',
  },
  lg: {
    box: 'h-11 w-11 rounded-[12px]',
    icon: 20,
    title: 'text-sm leading-4',
    subtitle: 'text-[10px] leading-3.5',
    gap: 'gap-3.5',
  },
}

export function DummyLogo({ size = 'md', showSubtitle = true, tone = 'dark', className }) {
  const tokens = sizes[size] ?? sizes.md

  return (
    <div className={cn('flex items-center', tokens.gap, className)}>
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center bg-gradient-to-br from-[#38B8B3] to-[#2A9A96] text-white shadow-sm',
          tokens.box,
        )}
        aria-hidden="true"
      >
        <Crown size={tokens.icon} strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            'font-bold tracking-[0.16em]',
            tokens.title,
            tone === 'light' ? 'text-ink' : 'text-white',
          )}
        >
          FREEJ TRIVIA
        </p>
        {showSubtitle ? (
          <p className={cn('mt-0.5 font-semibold tracking-[0.18em] text-[#38B8B3]', tokens.subtitle)}>
            ADMIN CONSOLE
          </p>
        ) : null}
      </div>
    </div>
  )
}
