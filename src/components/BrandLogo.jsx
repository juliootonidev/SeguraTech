export default function BrandLogo({ compact = false, className = '' }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/n9-logo.png"
        alt="N9"
        className={compact ? 'h-9 w-auto object-contain' : 'h-12 w-auto object-contain'}
      />
    </div>
  )
}
