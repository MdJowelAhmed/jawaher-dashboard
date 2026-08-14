import { FileText, Image, Music, Video } from 'lucide-react'
import { QUESTION_TYPES } from '../../utils/constants'
import { cn } from '../../utils/cn'

const icons = { text: FileText, image: Image, audio: Music, video: Video }

export function QuestionTypeSelector({ value, error, onChange }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">
        Question Type <span className="text-danger">*</span>
      </p>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {QUESTION_TYPES.map((item) => {
          const Icon = icons[item.value] || FileText
          const selected = value === item.value
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onChange(item.value)}
              className={cn(
                'flex items-center gap-2 rounded-control border px-3 py-2.5 text-left text-sm font-medium transition-colors',
                selected
                  ? 'border-brand bg-brand-soft text-brand-hover'
                  : 'border-line bg-white text-ink hover:border-brand/40 hover:bg-canvas',
              )}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </div>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  )
}
