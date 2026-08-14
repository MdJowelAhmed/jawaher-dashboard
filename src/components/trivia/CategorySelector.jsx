import { Select } from '../ui/Select'

export function CategorySelector({ categories, value, error, onChange }) {
  return (
    <Select label="Category" required value={value} error={error} onChange={(event) => onChange(event.target.value)}>
      <option value="">Select category</option>
      {categories.map((item) => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </Select>
  )
}
