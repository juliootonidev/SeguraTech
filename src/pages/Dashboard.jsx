import { useNavigate } from 'react-router-dom'
import { useQuotes } from '../context/QuotesContext'
import Topbar from '../components/Topbar'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import {
  FileText, TrendingUp, DollarSign, CheckCircle,
  ArrowRight, Clock, Car, Plus
} from 'lucide-react'

export default function Dashboard() {
  const { quotes } = useQuotes()
  const navigate = useNavigate()

  const totalValue = quotes.reduce((acc, q) => {
    const raw = parseFloat(q.vehicleValue?.replace(/\D/g, '') || 0) / 100
    return acc + raw * 0.03
  }, 0)

  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

  const recentQuotes = quotes.slice(0, 5)

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Dashboard" subtitle="Visão geral da plataforma" />

      <div className="flex-1 p-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="Cotações Salvas" value={quotes.length} change={12} changeLabel="vs. mês anterior" icon={FileText} color="blue" delay={0} />
          <StatCard title="Prêmio Estimado" value={formatCurrency(totalValue)} change={8} changeLabel="base de cálculo" icon={DollarSign} color="green" delay={100} />
          <StatCard title="Taxa de Conversão" value="34%" change={-3} changeLabel="emissões / cotações" icon={TrendingUp} color="purple" delay={200} />
          <StatCard title="Apólices Ativas" value="0" changeLabel="em desenvolvimento" icon={CheckCircle} color="amber" delay={300} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent quotes table */}
          <div className="lg:col-span-2 card animate-slide-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-surface-900 font-bold text-base">Cotações Recentes</h2>
                <p className="text-surface-400 text-xs mt-0.5">Últimas cotações registradas</p>
              </div>
              <button
                onClick={() => navigate('/cotacao')}
                className="btn-primary flex items-center gap-2 text-xs px-4 py-2"
              >
                <Plus size={14} />
                Nova Cotação
              </button>
            </div>

            {recentQuotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText size={24} className="text-surface-400" />
                </div>
                <p className="text-surface-600 font-semibold text-sm">Nenhuma cotação ainda</p>
                <p className="text-surface-400 text-xs mt-1 mb-4">Crie sua primeira cotação para começar</p>
                <button onClick={() => navigate('/cotacao')} className="btn-primary text-xs">
                  Criar cotação
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentQuotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => navigate('/timeline')}
                    className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-surface-50 cursor-pointer transition-colors group border border-transparent hover:border-surface-100"
                  >
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Car size={18} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-surface-900 font-semibold text-sm truncate">{q.personalData?.name || 'Sem nome'}</div>
                      <div className="text-surface-400 text-xs truncate">{q.vehicleData?.brand} {q.vehicleData?.model} · {q.vehicleData?.year}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-surface-900 font-bold text-sm">{q.result?.monthly || '—'}</div>
                      <div className="text-surface-400 text-xs">mensal</div>
                    </div>
                    <Badge variant="green" dot>Salva</Badge>
                    <ArrowRight size={14} className="text-surface-300 group-hover:text-surface-500 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="card animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              <h2 className="text-surface-900 font-bold text-base mb-4">Ações Rápidas</h2>
              <div className="space-y-2">
                {[
                  { label: 'Nova Cotação', icon: FileText, to: '/cotacao', color: 'text-brand-600 bg-brand-50' },
                  { label: 'Ver Timeline', icon: Clock, to: '/timeline', color: 'text-purple-600 bg-purple-50' },
                  { label: 'Emissão', icon: CheckCircle, to: '/emissao', color: 'text-emerald-600 bg-emerald-50' },
                ].map(action => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.to)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors text-left group border border-transparent hover:border-surface-100"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${action.color}`}>
                      <action.icon size={16} />
                    </div>
                    <span className="text-surface-700 font-semibold text-sm flex-1">{action.label}</span>
                    <ArrowRight size={14} className="text-surface-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Platform status */}
            <div className="card animate-slide-up opacity-0 bg-gradient-to-br from-brand-600 to-brand-800 border-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-soft" />
                <span className="text-brand-100 text-xs font-semibold">SISTEMA OPERACIONAL</span>
              </div>
              <p className="text-white font-bold text-base mb-1">Todos os serviços ativos</p>
              <p className="text-brand-200 text-xs">Latência: 42ms · Uptime: 99.97%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
