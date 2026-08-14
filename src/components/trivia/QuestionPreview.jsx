import { Image as ImageIcon, Music, Video } from 'lucide-react'
import { formatPoints } from '../../utils/format'

export function QuestionPreview({ form, categoryName }) {
  const correct = form.answer?.trim()
  const media = form.media?.url

  return (
    <section className="overflow-hidden rounded-card border border-line bg-[#0f1b3d] text-white shadow-card">
      <div className="border-b border-white/10 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Question Preview</p>
      </div>
      <div className="px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Category</p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-[#38B8B3]">
          {categoryName || 'Select a category'}
        </p>
        <p className="mt-5 text-3xl font-bold tracking-tight text-white">
          {form.value ? formatPoints(form.value).toUpperCase() : 'POINT VALUE'}
        </p>
        <p className="mt-6 text-lg font-medium leading-7 text-white">
          {form.question?.trim() || 'Enter your trivia question...'}
        </p>

        {form.questionType === 'image' && media ? (
          <img src={media} alt="" className="mt-5 max-h-44 w-full rounded-xl object-cover" />
        ) : null}
        {form.questionType === 'image' && !media ? (
          <div className="mt-5 flex h-36 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-sm text-slate-400">
            <ImageIcon size={18} className="mr-2" /> Image preview
          </div>
        ) : null}
        {form.questionType === 'audio' ? (
          <div className="mt-5 rounded-xl bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-300"><Music size={16} /> {form.media?.name || 'Audio clip'}</div>
            {media ? <audio src={media} controls className="w-full" /> : <p className="text-xs text-slate-500">No audio uploaded</p>}
          </div>
        ) : null}
        {form.questionType === 'video' ? (
          media ? <video src={media} controls className="mt-5 max-h-44 w-full rounded-xl bg-black" /> : (
            <div className="mt-5 flex h-36 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-sm text-slate-400">
              <Video size={18} className="mr-2" /> Video preview
            </div>
          )
        ) : null}

        <div className="mt-6 rounded-xl bg-white/5 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Correct Answer</p>
          <p className="mt-1 text-sm font-medium text-[#38B8B3]">{correct || 'Enter the correct answer...'}</p>
        </div>
      </div>
    </section>
  )
}
