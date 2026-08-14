import { Info } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber } from '../../utils/format'
import { Card, CardHeader } from '../ui/Card'
import { LoadingState } from '../ui/LoadingState'

export function GamesChart({ data, loading }) {
  return (
    <Card>
      <CardHeader title="Games Played" description="Online matches recorded by the backend." />
      <div className="mx-5 mt-4 flex items-start gap-2 rounded-xl bg-accent-soft px-3 py-2.5 text-sm text-accent">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>Offline game analytics are unavailable. Play Offline stays on the device and is not synced to this dashboard.</p>
      </div>
      <div className="h-[248px] px-2 py-4">
        {loading ? <LoadingState /> : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="onlineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#EEF2F7" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => formatNumber(value)} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E6EAF2' }} formatter={(value) => [formatNumber(value), 'Online games']} />
              <Area type="monotone" dataKey="online" stroke="#2563EB" fill="url(#onlineFill)" strokeWidth={2.4} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
