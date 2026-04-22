import Topbar from '../components/Topbar'
import { Send, Sparkles } from 'lucide-react'

export default function Emissao() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Emissão" subtitle="Emissão de apólices de seguro" />
      <PlaceholderPage
        icon={Send}
        title="Emissão de Apólices"
        description="O módulo de emissão automática de apólices está sendo desenvolvido pela nossa equipe. Em breve você poderá emitir documentos diretamente pela plataforma."
        features={[
          'Geração de apólice em PDF',
          'Envio automático por e-mail',
          'Assinatura digital integrada',
          'Integração com seguradoras',
        ]}
        color="blue"
      />
    </div>
  )
}

function PlaceholderPage({ icon: Icon, title, description, features, color }) {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', bar: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700 border-purple-200', bar: 'bg-purple-500' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className="flex-1 p-8 flex items-center justify-center">
      <div className="max-w-lg w-full text-center animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
        <div className={`w-20 h-20 ${c.bg} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-card`}>
          <Icon size={36} className={c.text} />
        </div>

        <div className={`inline-flex items-center gap-2 border text-xs font-bold px-3 py-1.5 rounded-full mb-5 ${c.badge}`}>
          <Sparkles size={12} />
          Em Desenvolvimento
        </div>

        <h2 className="text-surface-900 font-bold text-2xl mb-3">{title}</h2>
        <p className="text-surface-400 text-base leading-relaxed mb-8">{description}</p>

        <div className="card text-left space-y-3">
          <p className="text-surface-600 font-bold text-sm mb-4">O que está por vir:</p>
          {features.map((f, i) => (
            <div key={f} className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${c.bar}`} />
              <span className="text-surface-600 text-sm">{f}</span>
              <div className="flex-1 h-1.5 bg-surface-100 rounded-full ml-auto max-w-24 overflow-hidden">
                <div
                  className={`h-full ${c.bar} rounded-full animate-pulse-soft`}
                  style={{ width: `${85 - i * 15}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { PlaceholderPage }
