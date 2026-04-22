import { useState } from 'react'
import { useQuotes } from '../context/QuotesContext'
import Topbar from '../components/Topbar'
import Badge from '../components/Badge'
import { Clock, Car, User, DollarSign, Trash2, ChevronDown, ChevronUp, FileText, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const COVERAGE_LABELS = {
  rouboFurto: 'Roubo e Furto', colisao: 'Colisão', perdaTotal: 'Perda Total', terceiros: 'Terceiros',
  carroReserva: 'Carro Reserva', assistencia24h: 'Assistência 24h', vidros: 'Vidros', enchente: 'Enchente',
}

export default function Timeline() {
  const { quotes, deleteQuote } = useQuotes()
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  const toggle = (id) => setExpanded(prev => prev === id ? null : id)

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Timeline" subtitle="Histórico de cotações salvas" />

      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {quotes.length === 0 ? (
            <div className="card flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mb-5">
                <FileText size={28} className="text-surface-400" />
              </div>
              <h3 className="text-surface-700 font-bold text-lg mb-2">Nenhuma cotação salva</h3>
              <p className="text-surface-400 text-sm mb-6 max-w-xs">Crie uma nova cotação para visualizá-la aqui na timeline.</p>
              <button onClick={() => navigate('/cotacao')} className="btn-primary flex items-center gap-2">
                <Plus size={16} />
                Nova Cotação
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-surface-500 text-sm font-medium">{quotes.length} cotação{quotes.length > 1 ? 'ões' : ''} encontrada{quotes.length > 1 ? 's' : ''}</p>
                <button onClick={() => navigate('/cotacao')} className="btn-primary text-xs flex items-center gap-2 py-2 px-4">
                  <Plus size={14} /> Nova Cotação
                </button>
              </div>

              {quotes.map((q, idx) => {
                const isOpen = expanded === q.id
                const activeCoverages = q.coverages
                  ? Object.entries(q.coverages).filter(([, v]) => v).map(([k]) => COVERAGE_LABELS[k])
                  : []

                return (
                  <div
                    key={q.id}
                    className="card hover:shadow-card-hover transition-all duration-300 animate-slide-up opacity-0"
                    style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'forwards' }}
                  >
                    {/* Header */}
                    <div
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => toggle(q.id)}
                    >
                      <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Car size={20} className="text-brand-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-surface-900 font-bold text-sm">
                            {q.personalData?.name || 'Sem nome'}
                          </span>
                          <Badge variant="green" dot>Salva</Badge>
                        </div>
                        <div className="text-surface-400 text-xs mt-0.5 truncate">
                          {q.vehicleData?.brand} {q.vehicleData?.model} · {q.vehicleData?.year} · {q.vehicleData?.vehicleValue}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <div className="text-surface-900 font-bold text-base font-mono">{q.result?.monthly}</div>
                        <div className="text-surface-400 text-xs">por mês</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteQuote(q.id) }}
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

                    {/* Expanded details */}
                    {isOpen && (
                      <div className="mt-5 pt-5 border-t border-surface-100 animate-fade-in space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <Detail icon={User} label="Segurado" value={q.personalData?.name} />
                          <Detail icon={Car} label="Veículo" value={`${q.vehicleData?.brand} ${q.vehicleData?.model}`} />
                          <Detail icon={DollarSign} label="Valor FIPE" value={q.vehicleData?.vehicleValue} mono />
                          <Detail icon={DollarSign} label="Mensal" value={q.result?.monthly} mono highlight />
                          <Detail icon={DollarSign} label="Anual" value={q.result?.annual} mono />
                          <Detail icon={Clock} label="Data" value={formatDate(q.createdAt)} small />
                        </div>

                        {activeCoverages.length > 0 && (
                          <div>
                            <p className="text-surface-500 text-xs font-semibold mb-2 uppercase tracking-wide">Coberturas</p>
                            <div className="flex flex-wrap gap-2">
                              {activeCoverages.map(c => (
                                <span key={c} className="bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold px-2.5 py-1 rounded-lg">
                                  {c}
                                </span>
                              ))}
                            </div>
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

function Detail({ icon: Icon, label, value, mono, highlight, small }) {
  return (
    <div className="bg-surface-50 rounded-xl p-3 border border-surface-100">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={12} className="text-surface-400" />
        <span className="text-surface-400 text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className={`font-bold truncate ${
        highlight ? 'text-brand-700 text-base' : 'text-surface-800 text-sm'
      } ${mono ? 'font-mono' : ''} ${small ? 'text-xs font-medium' : ''}`}>
        {value || '—'}
      </div>
    </div>
  )
}
