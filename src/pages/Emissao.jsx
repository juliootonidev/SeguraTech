import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Send } from 'lucide-react'
import Badge from '../components/Badge'
import Topbar from '../components/Topbar'
import { useQuotes } from '../context/QuotesContext'

function emissionBadge(emission) {
  if (emission.preAnalysisStatus === 'aprovado') return { label: 'Aprovado', variant: 'green' }
  if (emission.preAnalysisStatus === 'reprovado') return { label: 'Reprovado', variant: 'red' }
  if (emission.preAnalysisStatus === 'pendencia') return { label: 'Pendência', variant: 'yellow' }
  return { label: emission.statusLabel || 'Em análise', variant: 'blue' }
}

export default function Emissao() {
  const { emissions } = useQuotes()
  const navigate = useNavigate()

  const pendingEmissions = useMemo(
    () => emissions.filter((emission) => emission.currentStage !== 'finalizado'),
    [emissions]
  )

  const formatDate = (value) =>
    new Date(value).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Timeline de Emissão" subtitle="Listagem de emissões pendentes em formato operacional" />

      <div className="flex-1 p-8">
        {pendingEmissions.length === 0 ? (
          <div className="max-w-2xl mx-auto card flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mb-5">
              <Send size={28} className="text-surface-400" />
            </div>
            <h3 className="text-surface-700 font-bold text-lg mb-2">Nenhuma emissão pendente</h3>
            <p className="text-surface-400 text-sm max-w-md">As emissões aparecem aqui após a confirmação do cliente e saem da tabela quando finalizadas.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-surface-900 font-bold text-base">Pendências de emissão</h2>
                <p className="text-surface-400 text-xs mt-0.5">Somente emissões ainda não finalizadas</p>
              </div>
              <Badge variant="blue" dot>{pendingEmissions.length} pendente(s)</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-100 text-left text-surface-500 uppercase text-xs tracking-wide">
                    <th className="px-4 py-3 font-semibold">ID</th>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Veículo</th>
                    <th className="px-4 py-3 font-semibold">Placa</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Data</th>
                    <th className="px-4 py-3 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEmissions.map((emission) => {
                    const badge = emissionBadge(emission)

                    return (
                      <tr
                        key={emission.id}
                        className="border-b border-surface-100 hover:bg-surface-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/emissao/${emission.id}`)}
                      >
                        <td className="px-4 py-4 font-mono text-xs text-surface-700">{emission.protocolId}</td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-surface-900">{emission.personalData?.name}</div>
                          <div className="text-xs text-surface-400">{emission.personalData?.email}</div>
                        </td>
                        <td className="px-4 py-4 text-surface-700">{emission.vehicleData?.brand} {emission.vehicleData?.model}</td>
                        <td className="px-4 py-4 text-surface-700">{emission.vehicleData?.plate || 'Não informada'}</td>
                        <td className="px-4 py-4"><Badge variant={badge.variant} dot>{badge.label}</Badge></td>
                        <td className="px-4 py-4 text-surface-500">{formatDate(emission.updatedAt || emission.createdAt)}</td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              navigate(`/emissao/${emission.id}`)
                            }}
                            className="btn-secondary text-xs inline-flex items-center gap-2"
                          >
                            <Eye size={14} />
                            Ver detalhe
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
