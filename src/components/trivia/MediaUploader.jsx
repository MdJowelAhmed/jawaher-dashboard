import { useRef, useState } from 'react'
import { ImageUp, Music, Trash2, Upload, Video } from 'lucide-react'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

const acceptMap = {
  image: 'image/jpeg,image/png,image/webp,image/gif',
  audio: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg',
  video: 'video/mp4,video/webm,video/quicktime',
}

const hintMap = {
  image: 'JPG, PNG, WEBP',
  audio: 'MP3, WAV, OGG',
  video: 'MP4, WEBM',
}

const icons = { image: ImageUp, audio: Music, video: Video }

export function MediaUploader({ type = 'image', value, error, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const Icon = icons[type] || Upload
  const media = value?.url ? value : null

  function applyFile(file) {
    if (!file) return
    if (value?.url?.startsWith('blob:')) URL.revokeObjectURL(value.url)
    onChange({
      type,
      url: URL.createObjectURL(file),
      name: file.name,
    })
  }

  function onDrop(event) {
    event.preventDefault()
    setDragging(false)
    applyFile(event.dataTransfer.files?.[0])
  }

  function remove() {
    if (value?.url?.startsWith('blob:')) URL.revokeObjectURL(value.url)
    onChange({ type, url: '', name: '' })
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-ink">
        Upload Media <span className="text-danger">*</span>
      </p>
      {media ? (
        <div className="overflow-hidden rounded-card border border-line bg-canvas">
          {type === 'image' ? <img src={media.url} alt={media.name || 'Question media'} className="max-h-56 w-full object-contain bg-black/5" /> : null}
          {type === 'audio' ? (
            <div className="p-4">
              <p className="mb-3 truncate text-sm font-medium text-ink">{media.name}</p>
              <audio src={media.url} controls className="w-full" />
            </div>
          ) : null}
          {type === 'video' ? <video src={media.url} controls className="max-h-56 w-full bg-black" /> : null}
          <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-3">
            <p className="truncate text-sm text-ink-muted">{media.name || 'Attached media'}</p>
            <Button type="button" size="sm" variant="ghost" onClick={remove}><Trash2 size={14} /> Remove</Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center rounded-card border border-dashed px-4 py-10 text-center transition-colors',
            dragging ? 'border-brand bg-brand-soft' : 'border-line bg-canvas hover:border-brand/50',
          )}
        >
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
            <Icon size={20} />
          </span>
          <p className="text-sm font-semibold text-ink">Upload Media</p>
          <p className="mt-1 text-sm text-ink-muted">Drag & drop or click to upload</p>
          <p className="mt-1 text-xs text-ink-muted">{hintMap[type]}</p>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={acceptMap[type]}
        className="hidden"
        onChange={(event) => applyFile(event.target.files?.[0])}
      />
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  )
}
