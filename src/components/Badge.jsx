const variants = {
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
  red: 'bg-red-50 text-red-700 border border-red-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  gray: 'bg-surface-100 text-surface-600 border border-surface-200',
}

export default function Badge({ children, variant = 'gray', dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${variants[variant]}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'green' ? 'bg-emerald-500' :
          variant === 'yellow' ? 'bg-amber-500' :
          variant === 'red' ? 'bg-red-500' :
          variant === 'blue' ? 'bg-blue-500' :
          variant === 'purple' ? 'bg-purple-500' :
          'bg-surface-400'
        }`} />
      )}
      {children}
    </span>
  )
}
