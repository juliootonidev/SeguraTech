import FormField from '../../components/FormField'
import { User, Mail, Phone } from 'lucide-react'

export default function StepPersonal({ data, onChange, errors }) {
  const handle = (field) => (e) => onChange({ ...data, [field]: e.target.value })

  const formatPhone = (val) => {
    const n = val.replace(/\D/g, '').slice(0, 11)
    if (n.length <= 2) return n
    if (n.length <= 7) return `(${n.slice(0,2)}) ${n.slice(2)}`
    return `(${n.slice(0,2)}) ${n.slice(2,7)}-${n.slice(7)}`
  }

  return (
    <div className="space-y-5 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
      <div>
        <h3 className="text-surface-900 font-bold text-lg mb-1">Dados Pessoais</h3>
        <p className="text-surface-400 text-sm">Informe os dados do segurado</p>
      </div>

      <FormField label="Nome completo" required error={errors?.name}>
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
          <input
            className="input-base pl-11"
            placeholder="João da Silva"
            value={data.name || ''}
            onChange={handle('name')}
          />
        </div>
      </FormField>

      <FormField label="E-mail" required error={errors?.email}>
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
          <input
            type="email"
            className="input-base pl-11"
            placeholder="joao@email.com"
            value={data.email || ''}
            onChange={handle('email')}
          />
        </div>
      </FormField>

      <FormField label="Celular" required error={errors?.phone}>
        <div className="relative">
          <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
          <input
            className="input-base pl-11"
            placeholder="(11) 99999-9999"
            value={data.phone || ''}
            onChange={(e) => onChange({ ...data, phone: formatPhone(e.target.value) })}
          />
        </div>
      </FormField>
    </div>
  )
}
