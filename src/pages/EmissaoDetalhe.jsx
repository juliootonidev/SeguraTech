import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, CircleDot, Clock3, ImagePlus } from 'lucide-react'
import Badge from '../components/Badge'
import FormField from '../components/FormField'
import Topbar from '../components/Topbar'
import { useQuotes } from '../context/QuotesContext'
import { useViaCep } from '../hooks/useViaCep'

const STAGES = [
  { key: 'dados_cliente', title: 'Dados do cliente', description: 'Validação e complementação dos dados pessoais e endereço.' },
  { key: 'vistoria', title: 'Vistoria', description: 'Dados do veículo e foto para conferência.' },
  { key: 'dados_cobertura', title: 'Dados de cobertura', description: 'Coberturas contratadas na cotação aceita.' },
  { key: 'pre_analise', title: 'Pré-análise', description: 'Aprovação, reprovação ou pendência.' },
  { key: 'finalizado', title: 'Finalizado', description: 'Processo concluído com sucesso.' },
]

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

function emissionBadge(emission) {
  if (emission.preAnalysisStatus === 'aprovado') return { label: 'Aprovado', variant: 'green' }
  if (emission.preAnalysisStatus === 'reprovado') return { label: 'Reprovado', variant: 'red' }
  if (emission.preAnalysisStatus === 'pendencia') return { label: 'Pendência', variant: 'yellow' }
  return { label: emission.statusLabel || 'Em análise', variant: 'blue' }
}

export default function EmissaoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { emissions, quotes, updateEmission } = useQuotes()
  const { fetchCep, loading } = useViaCep()
  const selected = useMemo(() => emissions.find((item) => item.id === id) || null, [emissions, id])
  const relatedQuote = useMemo(() => {
    if (!selected) return null
    return quotes.find((quote) => quote.id === selected.quoteId) || null
  }, [quotes, selected])

  const updateSelected = (patch) => {
    if (!selected) return
    updateEmission(selected.id, patch)
  }

  const updateNested = (section, key, value) => {
    if (!selected) return
    updateEmission(selected.id, (current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    }))
  }

  const advanceStage = () => {
    if (!selected) return
    const order = STAGES.map((stage) => stage.key)
    const currentIndex = order.indexOf(selected.currentStage)
    if (currentIndex >= 0 && currentIndex < order.length - 1) {
      updateSelected({
        currentStage: order[currentIndex + 1],
        statusLabel: 'Etapa atualizada',
      })
    }
  }

  const handleCepBlur = async () => {
    if (!selected) return
    const result = await fetchCep(selected.personalData?.cep || '')
    if (!result) return

    updateEmission(selected.id, (current) => ({
      ...current,
      personalData: {
        ...current.personalData,
        rua: result.logradouro || current.personalData.rua,
        bairro: result.bairro || current.personalData.bairro,
        cidade: result.localidade || current.personalData.cidade,
        estado: result.uf || current.personalData.estado,
      },
    }))
  }

  const handleImageUpload = (file) => {
    if (!file || !selected) return
    const reader = new FileReader()
    reader.onload = () => {
      updateSelected({
        inspectionImage: String(reader.result),
        statusLabel: 'Imagem anexada',
      })
    }
    reader.readAsDataURL(file)
  }

  const handleApprove = () => {
    updateSelected({
      preAnalysisStatus: 'aprovado',
      currentStage: 'finalizado',
      statusLabel: 'Aprovado e finalizado',
      pendingReason: '',
    })
  }

  const handleReject = () => {
    updateSelected({
      preAnalysisStatus: 'reprovado',
      statusLabel: 'Reprovado',
      currentStage: 'pre_analise',
    })
  }

  const handlePending = () => {
    if (!selected) return
    const reason = selected.pendingReason?.trim()
    if (!reason) return

    updateEmission(selected.id, (current) => ({
      ...current,
      preAnalysisStatus: 'pendencia',
      currentStage: 'pre_analise',
      statusLabel: 'Pendente de ajuste',
      pendingItems: [
        ...(current.pendingItems || []),
        { id: crypto.randomUUID(), label: reason, resolved: false },
      ],
    }))
  }

  const resolvePending = (itemId) => {
    if (!selected) return

    updateEmission(selected.id, (current) => {
      const nextItems = current.pendingItems.map((item) =>
        item.id === itemId ? { ...item, resolved: true } : item
      )
      const hasOpenPending = nextItems.some((item) => !item.resolved)

      return {
        ...current,
        pendingItems: nextItems,
        preAnalysisStatus: hasOpenPending ? 'pendencia' : 'em_analise',
        statusLabel: hasOpenPending ? 'Pendência parcial' : 'Retornou para pré-análise',
        currentStage: 'pre_analise',
      }
    })
  }

  if (!selected) {
    return (
      <div className="flex flex-col flex-1">
        <Topbar title="Detalhe da Emissão" subtitle="Registro não encontrado" />
        <div className="flex-1 p-8">
          <div className="card max-w-xl mx-auto text-center space-y-4">
            <h2 className="text-surface-900 font-bold text-xl">Emissão não encontrada</h2>
            <button className="btn-primary" onClick={() => navigate('/emissao')}>Voltar para Timeline de Emissão</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Detalhe da Emissão" subtitle={`Protocolo ${selected.protocolId}`} />

      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => navigate('/emissao')} className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Voltar para Timeline de Emissão
          </button>
          <Badge variant={emissionBadge(selected).variant} dot>{selected.statusLabel}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetailCard label="Protocolo de emissão" value={selected.protocolId} mono />
          <DetailCard label="Protocolo de cotação" value={relatedQuote?.protocolId || selected.quoteId} mono />
          <DetailCard label="Protocolo de subscrição" value={selected.subscriptionProtocolId} mono />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {STAGES.map((stage, index) => {
            const currentIndex = STAGES.findIndex((item) => item.key === selected.currentStage)
            const done = selected.currentStage === 'finalizado' || index < currentIndex
            const active = index === currentIndex

            return (
              <div
                key={stage.key}
                className={`rounded-2xl border p-4 transition ${
                  done ? 'border-emerald-200 bg-emerald-50' : active ? 'border-brand-200 bg-brand-50' : 'border-surface-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {done ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : active ? (
                      <CircleDot size={18} className="text-brand-600" />
                    ) : (
                      <Clock3 size={18} className="text-surface-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{stage.title}</p>
                    <p className="mt-1 text-xs text-surface-500">{stage.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="card space-y-6">
          {selected.currentStage === 'dados_cliente' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome completo">
                  <input className="input-base" value={selected.personalData?.name || ''} onChange={(event) => updateNested('personalData', 'name', event.target.value)} />
                </FormField>
                <FormField label="E-mail">
                  <input className="input-base" value={selected.personalData?.email || ''} onChange={(event) => updateNested('personalData', 'email', event.target.value)} />
                </FormField>
                <FormField label="Celular">
                  <input className="input-base" value={selected.personalData?.phone || ''} onChange={(event) => updateNested('personalData', 'phone', event.target.value)} />
                </FormField>
                <FormField label="CEP" hint={loading ? 'Consultando CEP...' : 'Ao sair do campo, o endereço será buscado automaticamente.'}>
                  <input className="input-base" value={selected.personalData?.cep || ''} onChange={(event) => updateNested('personalData', 'cep', event.target.value)} onBlur={handleCepBlur} />
                </FormField>
                <FormField label="Rua">
                  <input className="input-base" value={selected.personalData?.rua || ''} onChange={(event) => updateNested('personalData', 'rua', event.target.value)} />
                </FormField>
                <FormField label="Bairro">
                  <input className="input-base" value={selected.personalData?.bairro || ''} onChange={(event) => updateNested('personalData', 'bairro', event.target.value)} />
                </FormField>
                <FormField label="Cidade">
                  <input className="input-base" value={selected.personalData?.cidade || ''} onChange={(event) => updateNested('personalData', 'cidade', event.target.value)} />
                </FormField>
                <FormField label="Estado">
                  <input className="input-base" value={selected.personalData?.estado || ''} onChange={(event) => updateNested('personalData', 'estado', event.target.value)} />
                </FormField>
              </div>

              <div className="flex justify-end">
                <button onClick={advanceStage} className="btn-primary">Avançar para Vistoria</button>
              </div>
            </div>
          )}

          {selected.currentStage === 'vistoria' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard label="Ano" value={selected.vehicleData?.year} />
                <DetailCard label="Marca" value={selected.vehicleData?.brand} />
                <DetailCard label="Modelo" value={selected.vehicleData?.model} />
                <DetailCard label="Placa" value={selected.vehicleData?.plate || 'Não informada'} />
                <DetailCard label="Valor FIPE" value={selected.vehicleData?.vehicleValue} />
                <DetailCard label="Proteção" value={`${selected.vehicleData?.protection || '—'}%`} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
                <FormField label="Foto do veículo">
                  <label className="w-full min-h-[140px] rounded-2xl border border-dashed border-surface-300 bg-surface-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-brand-400 transition-colors">
                    <ImagePlus size={20} className="text-surface-500" />
                    <span className="text-sm text-surface-500">Anexar foto do veículo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => handleImageUpload(event.target.files?.[0])} />
                  </label>
                </FormField>

                <div className="rounded-2xl border border-surface-200 bg-surface-50 p-4">
                  {selected.inspectionImage ? (
                    <img src={selected.inspectionImage} alt="Veículo vistoriado" className="h-52 w-full rounded-2xl object-cover" />
                  ) : (
                    <div className="h-52 rounded-2xl border border-dashed border-surface-300 bg-white flex items-center justify-center text-sm text-surface-400">
                      Pré-visualização da imagem
                    </div>
                  )}
                </div>
              </div>

              <FormField label="Observações da vistoria">
                <textarea className="input-base min-h-[120px]" value={selected.inspectionNotes || ''} onChange={(event) => updateSelected({ inspectionNotes: event.target.value })} />
              </FormField>

              <div className="flex justify-end">
                <button onClick={advanceStage} className="btn-primary">Avançar para Dados de Cobertura</button>
              </div>
            </div>
          )}

          {selected.currentStage === 'dados_cobertura' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {Object.entries(COVERAGE_LABELS).map(([key, label]) => (
                  <div key={key} className="rounded-xl border border-surface-200 bg-surface-50 p-4">
                    <div className="text-surface-800 font-semibold text-sm">{label}</div>
                    <div className="text-surface-400 text-xs mt-2">
                      {selected.coverages?.[key] ? 'Contratada' : 'Não contratada'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button onClick={advanceStage} className="btn-primary">Avançar para Pré-análise</button>
              </div>
            </div>
          )}

          {selected.currentStage === 'pre_analise' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={handleApprove} className="rounded-xl bg-emerald-600 text-white font-semibold py-3 px-4 hover:bg-emerald-700 transition-colors">Aprovar</button>
                <button onClick={handleReject} className="rounded-xl bg-red-600 text-white font-semibold py-3 px-4 hover:bg-red-700 transition-colors">Reprovar</button>
                <button onClick={handlePending} className="rounded-xl bg-amber-500 text-white font-semibold py-3 px-4 hover:bg-amber-600 transition-colors">Pendência</button>
              </div>

              <FormField label="Descreva a pendência" hint="Esse histórico ficará disponível até a resolução.">
                <textarea
                  className="input-base min-h-[120px]"
                  placeholder="Ex.: foto traseira do veículo pendente, divergência na placa, documento ilegível..."
                  value={selected.pendingReason || ''}
                  onChange={(event) => updateSelected({ pendingReason: event.target.value })}
                />
              </FormField>

              {selected.pendingItems?.length > 0 && (
                <div className="rounded-2xl border border-surface-200 p-4">
                  <div className="text-surface-900 font-bold text-sm mb-4">Histórico de pendências</div>
                  <div className="space-y-3">
                    {selected.pendingItems.map((item) => (
                      <div key={item.id} className="rounded-xl bg-surface-50 border border-surface-100 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="text-surface-800 font-semibold text-sm">{item.label}</div>
                          <div className="text-surface-400 text-xs mt-1">{item.resolved ? 'Resolvida' : 'Aguardando resolução'}</div>
                        </div>
                        {!item.resolved && (
                          <button onClick={() => resolvePending(item.id)} className="btn-secondary text-xs">
                            Marcar como solucionada
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {selected.currentStage === 'finalizado' && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center">
              <h3 className="text-emerald-700 font-bold text-2xl mb-2">Processo finalizado</h3>
              <p className="text-emerald-700/80 text-sm">A emissão foi concluída com sucesso após aprovação na pré-análise.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailCard({ label, value, mono = false }) {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-50 p-4">
      <div className="text-surface-400 text-xs font-semibold uppercase tracking-wide">{label}</div>
      <div className={`text-surface-900 font-bold text-sm mt-2 ${mono ? 'font-mono text-xs md:text-sm' : ''}`}>{value || '—'}</div>
    </div>
  )
}
