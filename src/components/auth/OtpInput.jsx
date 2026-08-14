import { useRef } from 'react'
import { cn } from '../../utils/cn'

export function OtpInput({ value = '', onChange, length = 6, error, disabled }) {
  const digits = Array.from({ length }, (_, index) => value[index] || '')
  const refs = useRef([])

  function setDigit(index, digit) {
    const next = digits.map((item, i) => (i === index ? digit : item))
    onChange(next.join(''))
  }

  function onInput(index, event) {
    const raw = event.target.value.replace(/\D/g, '')
    if (!raw) {
      setDigit(index, '')
      return
    }
    const chars = raw.slice(-length).split('')
    if (chars.length > 1) {
      const next = digits.slice()
      chars.forEach((char, offset) => {
        if (index + offset < length) next[index + offset] = char
      })
      onChange(next.join(''))
      refs.current[Math.min(index + chars.length, length - 1)]?.focus()
      return
    }
    setDigit(index, chars[0])
    refs.current[Math.min(index + 1, length - 1)]?.focus()
  }

  function onKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault()
      setDigit(index - 1, '')
      refs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < length - 1) refs.current[index + 1]?.focus()
  }

  function onPaste(event) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div>
      <div className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(node) => { refs.current[index] = node }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1}`}
            onChange={(event) => onInput(index, event)}
            onKeyDown={(event) => onKeyDown(index, event)}
            onPaste={onPaste}
            onFocus={(event) => event.target.select()}
            className={cn(
              'h-12 w-10 rounded-control border bg-white text-center text-lg font-semibold text-ink sm:h-12 sm:w-12',
              'focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20',
              error ? 'border-danger' : 'border-line',
            )}
          />
        ))}
      </div>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  )
}
