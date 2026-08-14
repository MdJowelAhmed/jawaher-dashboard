export function FilterBar({ children, className }) {
  return <div className={`flex flex-col gap-3 lg:flex-row lg:items-center ${className || ''}`}>{children}</div>
}
