import { Shield, Car, AlertTriangle, Users, CarFront, Headphones, Layers, Waves } from 'lucide-react'

const ALL_COVERAGES = [
  { key: 'rouboFurto', label: 'Roubo e Furto', desc: 'Proteção contra subtração do veículo', icon: Shield, popular: true },
  { key: 'colisao', label: 'Colisão', desc: 'Danos causados por batidas e acidentes', icon: Car, popular: true },
  { key: 'perdaTotal', label: 'Perda Total', desc: 'Indenização quando o veículo não tem recuperação', icon: AlertTriangle },
  { key: 'terceiros', label: 'Terceiros', desc: 'Danos materiais e corporais a terceiros', icon: Users, popular: true },
  { key: 'carroReserva', label: 'Carro Reserva', desc: 'Veículo substituto durante o conserto', icon: CarFront },
  { key: 'assistencia24h', label: 'Assistência 24h', desc: 'Socorro, reboque e chaveiro a qualquer hora', icon: Headphones },
  { key: 'vidros', label: 'Vidros', desc: 'Reparo ou troca de para-brisas e janelas', icon: Layers },
  { key: 'enchente', label: 'Enchente', desc: 'Danos causados por alagamentos e cheias', icon: Waves },
]

export default function StepCoverages({ data, onChange }) {
  const toggle = (key) => {
    onChange({ ...data, [key]: !data[key] })
  }

  const selectedCount = ALL_COVERAGES.filter(c => data[c.key]).length

  return (
    <div className="space-y-5 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-surface-900 font-bold text-lg mb-1">Coberturas</h3>
          <p className="text-surface-400 text-sm">Selecione as coberturas desejadas</p>
        </div>
        {selectedCount > 0 && (
          <span className="bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold px-2.5 py-1 rounded-lg">
            {selectedCount} selecionada{selectedCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_COVERAGES.map(({ key, label, desc, icon: Icon, popular }) => {
          const isSelected = data[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 group ${
                isSelected
                  ? 'border-brand-500 bg-brand-50/50 shadow-inner-brand'
                  : 'border-surface-200 bg-white hover:border-brand-300 hover:bg-surface-50'
              }`}
            >
              {popular && !isSelected && (
                <span className="absolute top-3 right-3 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-1.5 py-0.5">
                  POPULAR
                </span>
              )}
              {isSelected && (
                <span className="absolute top-3 right-3 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isSelected ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-500 group-hover:bg-brand-100 group-hover:text-brand-600'
              }`}>
                <Icon size={17} />
              </div>
              <div className={`font-bold text-sm mb-0.5 transition-colors ${isSelected ? 'text-brand-800' : 'text-surface-800'}`}>
                {label}
              </div>
              <div className="text-surface-400 text-xs leading-relaxed">{desc}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
