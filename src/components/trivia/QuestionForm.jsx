import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { CategorySelector } from './CategorySelector'
import { PointValueSelector } from './PointValueSelector'
import { QuestionTypeSelector } from './QuestionTypeSelector'
import { MediaUploader } from './MediaUploader'

function Section({ title, description, children }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
      </div>
      <div className="space-y-5">{children}</div>
    </Card>
  )
}

export function QuestionForm({ form, errors, categories, onChange }) {
  return (
    <div className="space-y-4">
      <Section title="Game Configuration" description="Category and point value place this question on the trivia board.">
        <CategorySelector
          categories={categories}
          value={form.categoryId}
          error={errors.categoryId}
          onChange={(categoryId) => onChange({ categoryId })}
        />
        <PointValueSelector
          value={form.value}
          error={errors.value}
          onChange={(value) => onChange({ value })}
        />
      </Section>

      <Section title="Question Details">
        <QuestionTypeSelector
          value={form.questionType}
          error={errors.questionType}
          onChange={(questionType) => {
            if (form.media?.url?.startsWith('blob:')) URL.revokeObjectURL(form.media.url)
            onChange({
              questionType,
              media: { type: questionType, url: '', name: '' },
            })
          }}
        />
        <Textarea
          label="Question"
          required
          rows={4}
          value={form.question}
          error={errors.question}
          placeholder="Enter your trivia question..."
          onChange={(event) => onChange({ question: event.target.value })}
        />
        {form.questionType && form.questionType !== 'text' ? (
          <MediaUploader
            type={form.questionType}
            value={form.media}
            error={errors.media}
            onChange={(media) => onChange({ media })}
          />
        ) : null}
      </Section>

      <Section title="Answer">
        <Input
          label="Correct Answer"
          required
          value={form.answer}
          error={errors.answer}
          placeholder="Enter the correct answer..."
          onChange={(event) => onChange({ answer: event.target.value })}
        />
      </Section>
    </div>
  )
}
