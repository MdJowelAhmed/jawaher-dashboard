import { useRef, useState } from 'react'
import { ImageUp, Trash2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

const ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml'

export function CategoryIconUploader({ value, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function applyFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    if (value?.startsWith('blob:')) URL.revokeObjectURL(value)
    onChange(URL.createObjectURL(file))
  }

  function remove() {
    if (value?.startsWith('blob:')) URL.revokeObjectURL(value)
    onChange('')
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">Category Icon</p>
      {value ? (
        <div className="flex items-center gap-3 rounded-card border border-line bg-canvas p-3">
          <img src={value} alt="Category icon" className="h-16 w-16 rounded-xl object-cover bg-white" />
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>Replace</Button>
            <Button type="button" size="sm" variant="ghost" onClick={remove}><Trash2 size={14} /> Remove</Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            applyFile(event.dataTransfer.files?.[0])
          }}
          className={cn(
            'flex w-full flex-col items-center justify-center rounded-card border border-dashed px-4 py-8 text-center transition-colors',
            dragging ? 'border-brand bg-brand-soft' : 'border-line bg-canvas hover:border-brand/50',
          )}
        >
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <ImageUp size={18} />
          </span>
          <p className="text-sm font-semibold text-ink">Upload Category Icon</p>
          <p className="mt-1 text-sm text-ink-muted">Click to browse or drag file</p>
          <p className="mt-1 text-xs text-ink-muted">PNG, JPG, WEBP</p>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(event) => {
          applyFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />
    </div>
  )
}
