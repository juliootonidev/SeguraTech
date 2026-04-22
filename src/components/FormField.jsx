export default function FormField({ label, error, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-surface-700 flex items-center gap-1">
          {label}
          {required && <span className="text-brand-500 text-xs">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <span className="text-xs text-surface-400">{hint}</span>
      )}
      {error && (
        <span className="text-xs text-red-500 font-medium flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
          {error}
        </span>
      )}
    </div>
  )
}
