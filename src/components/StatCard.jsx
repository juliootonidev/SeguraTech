import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, change, changeLabel, icon: Icon, color = 'blue', delay = 0 }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  const isPositive = change >= 0

  return (
    <div
      className="card hover:shadow-card-hover transition-all duration-300 cursor-default animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-surface-900 tracking-tight">{value}</div>
        <div className="text-sm text-surface-500 font-medium">{title}</div>
        {changeLabel && (
          <div className="text-xs text-surface-400">{changeLabel}</div>
        )}
      </div>
    </div>
  )
}
