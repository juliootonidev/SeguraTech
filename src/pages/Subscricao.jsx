import Topbar from '../components/Topbar'
import { Shield } from 'lucide-react'
import { PlaceholderPage } from './Emissao'

export default function Subscricao() {
  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Subscrição" subtitle="Análise e aprovação de riscos" />
      <PlaceholderPage
        icon={Shield}
        title="Motor de Subscrição"
        description="O módulo de análise e aprovação de riscos com inteligência artificial está em desenvolvimento. Logo você terá decisões automatizadas e análise de perfil de risco."
        features={[
          'Análise de risco automatizada com IA',
          'Score de subscrição em tempo real',
          'Regras de negócio configuráveis',
          'Relatório de subscrição detalhado',
        ]}
        color="purple"
      />
    </div>
  )
}
