import { cn } from '../../utils/cn'

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-canvas p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
            value === tab.value ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
