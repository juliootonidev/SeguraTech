import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuotes } from '../../context/QuotesContext'
import { useQuoteCalculator } from '../../hooks/useQuoteCalculator'
import Topbar from '../../components/Topbar'
import Stepper from '../../components/Stepper'
import StepPersonal from './StepPersonal'
import StepVehicle from './StepVehicle'
import StepCoverages from './StepCoverages'
import StepResult from './StepResult'
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react'

const STEPS = ['Dados Pessoais', 'Veículo', 'Coberturas', 'Resultado']

const INITIAL_PERSONAL = { name: '', email: '', phone: '' }
const INITIAL_VEHICLE = { year: '', brand: '', model: '', plate: '', vehicleValue: '', protection: 90 }
const INITIAL_COVERAGES = {
  rouboFurto: false, colisao: false, perdaTotal: false, terceiros: false,
  carroReserva: false, assistencia24h: false, vidros: false, enchente: false,
}

export default function Cotacao() {
  const [step, setStep] = useState(1)
  const [personalData, setPersonalData] = useState(INITIAL_PERSONAL)
  const [vehicleData, setVehicleData] = useState(INITIAL_VEHICLE)
  const [coverages, setCoverages] = useState(INITIAL_COVERAGES)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const { saveQuote } = useQuotes()
  const { calculate, formatCurrency } = useQuoteCalculator()
  const navigate = useNavigate()

  const validateStep = () => {
    const errs = {}
    if (step === 1) {
      if (!personalData.name.trim()) errs.name = 'Nome é obrigatório'
      if (!personalData.email.trim()) errs.email = 'E-mail é obrigatório'
      else if (!/\S+@\S+\.\S+/.test(personalData.email)) errs.email = 'E-mail inválido'
      if (!personalData.phone.trim()) errs.phone = 'Celular é obrigatório'
    }
    if (step === 2) {
      if (!vehicleData.year) errs.year = 'Selecione o ano'
      if (!vehicleData.brand) errs.brand = 'Selecione a marca'
      if (!vehicleData.model.trim()) errs.model = 'Informe o modelo'
      if (!vehicleData.vehicleValue) errs.vehicleValue = 'Informe o valor'
      if (!vehicleData.protection) errs.protection = 'Selecione o percentual'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, 4))
  }

  const back = () => {
    setErrors({})
    setStep(s => Math.max(s - 1, 1))
  }

  const handleSave = () => {
    const result = calculate(vehicleData.vehicleValue, coverages, vehicleData.protection)
    saveQuote({
      personalData,
      vehicleData,
      coverages,
      result: {
        monthly: formatCurrency(result.monthly),
        annual: formatCurrency(result.annual),
        raw: result,
      },
    })
    setSaved(true)
    setTimeout(() => navigate('/timeline'), 1800)
  }

  if (saved) {
    return (
      <div className="flex flex-col flex-1">
        <Topbar title="Cotação" subtitle="Nova cotação de seguro" />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-600" size={40} />
            </div>
            <h2 className="text-surface-900 font-bold text-2xl mb-2">Cotação salva!</h2>
            <p className="text-surface-400">Redirecionando para a Timeline...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Cotação" subtitle="Nova cotação de seguro automotivo" />

      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Stepper */}
          <div className="card mb-6 flex justify-center overflow-x-auto">
            <Stepper steps={STEPS} currentStep={step} />
          </div>

          {/* Form card */}
          <div className="card">
            {step === 1 && (
              <StepPersonal data={personalData} onChange={setPersonalData} errors={errors} />
            )}
            {step === 2 && (
              <StepVehicle data={vehicleData} onChange={setVehicleData} errors={errors} />
            )}
            {step === 3 && (
              <StepCoverages data={coverages} onChange={setCoverages} />
            )}
            {step === 4 && (
              <StepResult personalData={personalData} vehicleData={vehicleData} coverages={coverages} />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-100">
              <button
                type="button"
                onClick={back}
                disabled={step === 1}
                className="btn-secondary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} />
                Voltar
              </button>

              <div className="text-surface-400 text-xs font-medium">
                Etapa {step} de {STEPS.length}
              </div>

              {step < 4 ? (
                <button type="button" onClick={next} className="btn-primary flex items-center gap-2">
                  Próximo
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save size={16} />
                  Salvar Cotação
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
