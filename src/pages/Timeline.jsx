import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ChevronDown, ChevronUp, Clock, FileText, Plus, Trash2 } from 'lucide-react'
import Badge from '../components/Badge'
import Topbar from '../components/Topbar'
import { useQuotes } from '../context/QuotesContext'

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

function quoteStatusBadge(status) {
  if (status === 'aceita') return { label: 'Aceita', variant: 'green' }
  if (status === 'reprovada') return { label: 'Reprovada', variant: 'red' }
  return { label: 'Aguardando cliente', variant: 'yellow' }
}

export default function Timeline() {
  const { quotes, deleteQuote, confirmQuote } = useQuotes()
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id))

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const handleConfirm = (id) => {
    confirmQuote(id)
    navigate('/emissao')
  }

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Timeline de Cotação" subtitle="Histórico das cotações enviadas e aguardando confirmação" />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {quotes.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mb-5">
                <FileText size={28} className="text-surface-400" />
              </div>
              <h3 className="text-surface-700 font-bold text-lg mb-2">Nenhuma cotação salva</h3>
              <p className="text-surface-400 text-sm mb-6 max-w-xs">Crie uma nova cotação para visualizá-la aqui.</p>
              <button onClick={() => navigate('/cotacao')} className="btn-primary flex items-center gap-2">
                <Plus size={16} />
                Nova Cotação
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-surface-500 text-sm font-medium">
                  {quotes.length} cotação{quotes.length > 1 ? 'ões' : ''} encontrada{quotes.length > 1 ? 's' : ''}
                </p>
                <button onClick={() => navigate('/cotacao')} className="btn-primary text-xs flex items-center gap-2 py-2 px-4">
                  <Plus size={14} /> Nova Cotação
                </button>
              </div>

              {quotes.map((quote, idx) => {
                const isOpen = expanded === quote.id
                const activeCoverages = Object.entries(quote.coverages || {})
                  .filter(([, enabled]) => enabled)
                  .map(([key]) => COVERAGE_LABELS[key])
                const status = quoteStatusBadge(quote.status)

                return (
                  <div
                    key={quote.id}
                    className="card hover:shadow-card-hover transition-all duration-300 animate-slide-up opacity-0"
                    style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggle(quote.id)}>
                      <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Clock size={20} className="text-brand-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-surface-900 font-bold text-sm">{quote.personalData?.name || 'Sem nome'}</span>
                          <Badge variant={status.variant} dot>{status.label}</Badge>
                          <span className="text-[11px] font-mono text-surface-400">{quote.protocolId}</span>
                        </div>
                        <div className="text-surface-400 text-xs mt-0.5 truncate">
                          {quote.vehicleData?.brand} {quote.vehicleData?.model} · {quote.vehicleData?.year} · {quote.vehicleData?.vehicleValue}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <div className="text-surface-900 font-bold text-base font-mono">{quote.result?.monthly}</div>
                        <div className="text-surface-400 text-xs">por mês</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(event) => {
                            event.stopPropagation()
                            deleteQuote(quote.id)
                          }}
                          className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors text-surface-400 hover:text-red-500"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center text-surface-400">
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-5 pt-5 border-t border-surface-100 animate-fade-in space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <Detail label="Segurado" value={quote.personalData?.name} />
                          <Detail label="Protocolo" value={quote.protocolId} small />
                          <Detail label="E-mail" value={quote.personalData?.email} />
                          <Detail label="Celular" value={quote.personalData?.phone} />
                          <Detail label="Veículo" value={`${quote.vehicleData?.brand} ${quote.vehicleData?.model}`} />
                          <Detail label="Placa" value={quote.vehicleData?.plate || 'Não informada'} />
                          <Detail label="Data" value={formatDate(quote.createdAt)} small />
                        </div>

                        {activeCoverages.length > 0 && (
                          <div>
                            <p className="text-surface-500 text-xs font-semibold mb-2 uppercase tracking-wide">Coberturas</p>
                            <div className="flex flex-wrap gap-2">
                              {activeCoverages.map((coverage) => (
                                <span key={coverage} className="bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold px-2.5 py-1 rounded-lg">
                                  {coverage}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {quote.status === 'aguardando_cliente' && (
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleConfirm(quote.id)}
                              className="btn-primary flex items-center gap-2"
                            >
                              <CheckCircle2 size={16} />
                              Confirmação do cliente
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, small }) {
  return (
    <div className="bg-surface-50 rounded-xl p-3 border border-surface-100">
      <div className="text-surface-400 text-xs font-semibold uppercase tracking-wide mb-1.5">{label}</div>
      <div className={`font-bold truncate ${small ? 'text-xs font-medium text-surface-700' : 'text-sm text-surface-800'}`}>
        {value || '—'}
      </div>
    </div>
  )
}
