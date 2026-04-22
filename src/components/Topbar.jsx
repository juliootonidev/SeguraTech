import { Bell, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Topbar({ title, subtitle }) {
  const { user } = useAuth()

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <header className="h-16 bg-white border-b border-surface-100 flex items-center px-8 gap-4 sticky top-0 z-20">
      <div className="flex-1">
        <h1 className="text-surface-900 font-bold text-lg leading-none">{title}</h1>
        {subtitle && <p className="text-surface-400 text-xs mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-surface-50 border border-surface-200 rounded-xl pl-9 pr-4 py-2 text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all w-48 focus:w-64"
          />
        </div>

        {/* Notification */}
        <button className="w-9 h-9 rounded-xl bg-surface-50 border border-surface-200 flex items-center justify-center hover:bg-surface-100 transition-colors relative">
          <Bell size={16} className="text-surface-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-white" />
        </button>

        {/* Greeting */}
        <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-surface-200">
          <div className="text-right">
            <div className="text-surface-700 text-xs font-semibold">{greeting}, <span className="capitalize">{user?.name}</span></div>
            <div className="text-surface-400 text-xs">{now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
