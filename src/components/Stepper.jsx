import { Check } from 'lucide-react'

export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex items-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = stepNumber < currentStep
        const isActive = stepNumber === currentStep
        const isPending = stepNumber > currentStep

        return (
          <div key={step} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 font-bold text-sm ${
                  isCompleted
                    ? 'bg-brand-600 text-white shadow-brand'
                    : isActive
                    ? 'bg-brand-600 text-white shadow-brand scale-110'
                    : 'bg-surface-100 text-surface-400'
                }`}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'text-brand-600'
                    : isCompleted
                    ? 'text-surface-600'
                    : 'text-surface-400'
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="w-16 md:w-24 h-px mx-2 mb-5 relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-surface-200" />
                <div
                  className={`absolute inset-y-0 left-0 bg-brand-500 transition-all duration-500 ${
                    isCompleted ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
