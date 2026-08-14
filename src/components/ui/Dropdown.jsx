import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

export function Dropdown({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  useEffect(() => {
    function onClick(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])
  return (
    <div ref={rootRef} className="relative">
      <div onClick={() => setOpen((value) => !value)}>{trigger}</div>
      {open ? (
        <div className={cn('absolute z-30 mt-2 min-w-[180px] rounded-xl border border-line bg-white p-1 shadow-float', align === 'right' ? 'right-0' : 'left-0', className)}>
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      ) : null}
    </div>
  )
}

export function DropdownItem({ children, onClick, tone = 'default', disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors disabled:opacity-50',
        tone === 'danger' ? 'text-danger hover:bg-danger-soft' : 'text-ink hover:bg-canvas',
      )}
    >
      {children}
    </button>
  )
}
