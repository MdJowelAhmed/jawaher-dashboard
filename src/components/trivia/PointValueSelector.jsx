import { POINT_VALUES } from '../../utils/constants'
import { formatPoints } from '../../utils/format'
import { cn } from '../../utils/cn'

export function PointValueSelector({ value, error, onChange }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">
        Question Value <span className="text-danger">*</span>
      </p>
      <div className="grid grid-cols-3 gap-2">
        {POINT_VALUES.map((points) => {
          const selected = Number(value) === points
          return (
            <button
              key={points}
              type="button"
              onClick={() => onChange(points)}
              className={cn(
                'rounded-control border px-2 py-2.5 text-sm font-semibold transition-colors',
                selected
                  ? 'border-brand bg-brand-soft text-brand-hover'
                  : 'border-line bg-white text-ink hover:border-brand/40 hover:bg-canvas',
              )}
            >
              {formatPoints(points)}
            </button>
          )
        })}
      </div>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  )
}
