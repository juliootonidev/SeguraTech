import FormField from '../../components/FormField'
import { useQuoteCalculator } from '../../hooks/useQuoteCalculator'

const BRANDS = ['Chevrolet','Fiat','Ford','Honda','Hyundai','Jeep','Nissan','Renault','Toyota','Volkswagen','Outros']
const YEARS = Array.from({ length: 20 }, (_, i) => String(new Date().getFullYear() - i))
const PROTECTIONS = [70, 80, 90, 100]

export default function StepVehicle({ data, onChange, errors }) {
  const { parseCurrencyInput } = useQuoteCalculator()

  const handle = (field) => (e) => onChange({ ...data, [field]: e.target.value })

  const handleValue = (e) => {
    onChange({ ...data, vehicleValue: parseCurrencyInput(e.target.value) })
  }

  const selectClass = "input-base appearance-none bg-white cursor-pointer"

  return (
    <div className="space-y-5 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div>
        <h3 className="text-surface-900 font-bold text-lg mb-1">Dados do Veículo</h3>
        <p className="text-surface-400 text-sm">Informe as características do veículo a ser segurado</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Ano" required error={errors?.year}>
          <select className={selectClass} value={data.year || ''} onChange={handle('year')}>
            <option value="">Selecione</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </FormField>

        <FormField label="Marca" required error={errors?.brand}>
          <select className={selectClass} value={data.brand || ''} onChange={handle('brand')}>
            <option value="">Selecione</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Modelo" required error={errors?.model}>
        <input
          className="input-base"
          placeholder="Ex: Onix Plus 1.0"
          value={data.model || ''}
          onChange={handle('model')}
        />
      </FormField>

      <FormField label="Valor do veículo (FIPE)" required error={errors?.vehicleValue} hint="Digite o valor de mercado conforme tabela FIPE">
        <input
          className="input-base font-mono"
          placeholder="R$ 0,00"
          value={data.vehicleValue || ''}
          onChange={handleValue}
        />
      </FormField>

      <FormField label="Percentual de proteção" required error={errors?.protection}>
        <div className="grid grid-cols-4 gap-3">
          {PROTECTIONS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ ...data, protection: p })}
              className={`py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${
                data.protection === p
                  ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-inner-brand'
                  : 'border-surface-200 bg-white text-surface-600 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>
        {errors?.protection && <span className="text-xs text-red-500 font-medium">{errors.protection}</span>}
      </FormField>
    </div>
  )
}
