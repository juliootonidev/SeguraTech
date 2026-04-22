import { useQuoteCalculator } from '../../hooks/useQuoteCalculator'
import { User, Car, Shield, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'

const COVERAGE_LABELS = {
  rouboFurto: 'Roubo e Furto',
  colisao: 'Colisão',
  perdaTotal: 'Perda Total',
  terceiros: 'Terceiros',
  carroReserva: 'Carro Reserva',
  assistencia24h: 'Assistência 24h',
  vidros: 'Vidros',
  enchente: 'Enchente',
}

export default function StepResult({ personalData, vehicleData, coverages }) {
  const { calculate, formatCurrency } = useQuoteCalculator()

  const result = calculate(vehicleData.vehicleValue, coverages, vehicleData.protection)

  const Section = ({ icon: Icon, title, children, color = 'brand' }) => {
    const colors = {
      brand: 'bg-brand-50 text-brand-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      purple: 'bg-purple-50 text-purple-600',
    }
    return (
      <div className="bg-surface-50 rounded-2xl p-5 border border-surface-100">
        <div className="flex items-center gap-2.5 mb-4">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colors[color]}`}>
            <Icon size={15} />
          </div>
          <h4 className="font-bold text-surface-800 text-sm">{title}</h4>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div>
        <h3 className="text-surface-900 font-bold text-lg mb-1">Resumo da Cotação</h3>
        <p className="text-surface-400 text-sm">Confira os valores calculados antes de salvar</p>
      </div>

      {/* Price highlight */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-brand-300" />
            <span className="text-brand-200 text-sm font-semibold">Valor calculado</span>
          </div>
          <div className="flex items-end gap-3 mb-2">
            <div>
              <div className="text-brand-200 text-xs font-medium mb-0.5">1ª parcela</div>
              <div className="text-4xl font-bold tracking-tight">{formatCurrency(result.monthly)}</div>
            </div>
            <div className="text-brand-300 text-sm mb-1">+ 11x {formatCurrency(result.monthly)}</div>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/20">
            <div>
              <div className="text-brand-300 text-xs">Prêmio anual</div>
              <div className="text-white font-bold">{formatCurrency(result.annual)}</div>
            </div>
            <div>
              <div className="text-brand-300 text-xs">Proteção</div>
              <div className="text-white font-bold">{vehicleData.protection}%</div>
            </div>
            <div>
              <div className="text-brand-300 text-xs">Coberturas</div>
              <div className="text-white font-bold">{Object.values(coverages).filter(Boolean).length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Personal */}
        <Section icon={User} title="Segurado" color="brand">
          <div className="space-y-2">
            <Row label="Nome" value={personalData.name} />
            <Row label="E-mail" value={personalData.email} />
            <Row label="Celular" value={personalData.phone} />
          </div>
        </Section>

        {/* Vehicle */}
        <Section icon={Car} title="Veículo" color="purple">
          <div className="space-y-2">
            <Row label="Marca / Modelo" value={`${vehicleData.brand} ${vehicleData.model}`} />
            <Row label="Ano" value={vehicleData.year} />
            <Row label="Valor FIPE" value={vehicleData.vehicleValue} mono />
          </div>
        </Section>
      </div>

      {/* Coverages */}
      <Section icon={Shield} title="Coberturas Contratadas" color="emerald">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(COVERAGE_LABELS).map(([key, label]) => {
            const active = coverages[key]
            return (
              <div key={key} className={`flex items-center gap-2 text-xs font-medium ${active ? 'text-surface-700' : 'text-surface-400'}`}>
                {active
                  ? <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  : <XCircle size={14} className="text-surface-300 flex-shrink-0" />
                }
                {label}
              </div>
            )
          })}
        </div>
      </Section>

      {/* Price breakdown */}
      {result.breakdown.length > 0 && (
        <div className="bg-surface-50 rounded-2xl p-5 border border-surface-100">
          <h4 className="font-bold text-surface-800 text-sm mb-4">Composição do Prêmio (mensal)</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-500">Prêmio base (3% FIPE)</span>
              <span className="font-semibold text-surface-700 font-mono">{formatCurrency(result.base / 12)}</span>
            </div>
            {result.breakdown.map(b => (
              <div key={b.label} className="flex justify-between text-sm">
                <span className="text-surface-500">{b.label}</span>
                <span className="font-semibold text-surface-700 font-mono">{formatCurrency(b.value / 12)}</span>
              </div>
            ))}
            <div className="h-px bg-surface-200 my-2" />
            <div className="flex justify-between text-sm font-bold">
              <span className="text-surface-800">Total mensal</span>
              <span className="text-brand-700 font-mono">{formatCurrency(result.monthly)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-surface-400 text-xs">{label}</span>
      <span className={`text-surface-700 text-xs font-semibold ${mono ? 'font-mono' : ''}`}>{value || '—'}</span>
    </div>
  )
}
