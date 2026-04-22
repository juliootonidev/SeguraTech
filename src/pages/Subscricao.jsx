import Badge from '../components/Badge'
import Topbar from '../components/Topbar'
import { Shield, Sparkles } from 'lucide-react'
import { useQuotes } from '../context/QuotesContext'

export default function Subscricao() {
  const { emissions } = useQuotes()
  const subscriptionRecords = emissions
    .filter((emission) => emission.subscriptionProtocolId)
    .map((emission) => ({
      id: emission.subscriptionProtocolId,
      client: emission.personalData?.name,
      status: emission.preAnalysisStatus,
      emissionProtocol: emission.protocolId,
    }))

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Subscrição" subtitle="Análise e aprovação de riscos" />

      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full space-y-6 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="text-center">
          <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-card">
            <Shield size={36} className="text-purple-600" />
          </div>

          <div className="inline-flex items-center gap-2 border text-xs font-bold px-3 py-1.5 rounded-full mb-5 bg-purple-100 text-purple-700 border-purple-200">
            <Sparkles size={12} />
            Em Desenvolvimento
          </div>

          <h2 className="text-surface-900 font-bold text-2xl mb-3">Motor de Subscrição</h2>
          <p className="text-surface-400 text-base leading-relaxed mb-8">
            O módulo de análise e aprovação de riscos com inteligência artificial está em desenvolvimento.
            Logo você terá decisões automatizadas e análise de perfil de risco.
          </p>
          </div>

          <div className="card text-left space-y-3">
            <p className="text-surface-600 font-bold text-sm mb-4">O que está por vir:</p>
            {[
              'Análise de risco automatizada com IA',
              'Score de subscrição em tempo real',
              'Regras de negócio configuráveis',
              'Relatório de subscrição detalhado',
            ].map((feature, index) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-surface-600 text-sm">{feature}</span>
                <div className="flex-1 h-1.5 bg-surface-100 rounded-full ml-auto max-w-24 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full animate-pulse-soft"
                    style={{ width: `${85 - index * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-surface-900 font-bold text-base">Protocolos de Subscrição</h3>
                <p className="text-surface-400 text-xs mt-1">IDs únicos reservados para o módulo de subscrição</p>
              </div>
              <Badge variant="blue" dot>{subscriptionRecords.length} protocolo(s)</Badge>
            </div>

            {subscriptionRecords.length === 0 ? (
              <p className="text-surface-400 text-sm">Nenhum protocolo de subscrição gerado até o momento.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-100 text-left text-surface-500 uppercase text-xs tracking-wide">
                      <th className="px-3 py-3 font-semibold">Protocolo</th>
                      <th className="px-3 py-3 font-semibold">Cliente</th>
                      <th className="px-3 py-3 font-semibold">Emissão</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionRecords.map((record) => (
                      <tr key={record.id} className="border-b border-surface-100">
                        <td className="px-3 py-3 font-mono text-xs text-surface-700">{record.id}</td>
                        <td className="px-3 py-3 text-surface-700">{record.client}</td>
                        <td className="px-3 py-3 font-mono text-xs text-surface-500">{record.emissionProtocol}</td>
                        <td className="px-3 py-3">
                          <Badge
                            variant={record.status === 'aprovado' ? 'green' : record.status === 'reprovado' ? 'red' : 'blue'}
                            dot
                          >
                            {record.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
