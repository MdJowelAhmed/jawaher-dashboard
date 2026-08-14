import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../../utils/format'
import { cn } from '../../utils/cn'
import { Card, CardHeader } from '../ui/Card'
import { LoadingState } from '../ui/LoadingState'

const ranges = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '3m', label: '3 Months' },
  { value: '1y', label: '1 Year' },
]

export function UserGrowthChart({ data, loading, range, onRangeChange }) {
  const [hover, setHover] = useState(false)
  return (
    <Card>
      <CardHeader
        title="User Growth"
        action={
          <div className="flex rounded-lg bg-canvas p-1">
            {ranges.map((item) => (
              <button key={item.value} type="button" onClick={() => onRangeChange(item.value)} className={cn('rounded-md px-2.5 py-1 text-xs font-medium', range === item.value ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink')}>
                {item.label}
              </button>
            ))}
          </div>
        }
      />
      <div className="h-[280px] px-2 py-4">
        {loading ? <LoadingState /> : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <CartesianGrid stroke="#EEF2F7" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatNumber(value)} />
              <Tooltip cursor={{ stroke: '#38B8B3', strokeDasharray: '4 4' }} contentStyle={{ borderRadius: 12, border: '1px solid #E6EAF2' }} formatter={(value) => [formatNumber(value), 'Users']} />
              <Line type="monotone" dataKey="users" stroke="#38B8B3" strokeWidth={hover ? 3 : 2.5} dot={false} activeDot={{ r: 5, fill: '#38B8B3' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
