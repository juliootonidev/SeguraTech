import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  FileText,
  Send,
  Shield,
  Clock,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cotacao', icon: FileText, label: 'Cotação' },
  { to: '/emissao', icon: Send, label: 'Emissão' },
  { to: '/subscricao', icon: Shield, label: 'Subscrição' },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.slice(0, 2).toUpperCase() || 'US'

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-950 flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand">
            <Zap size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">SeguraTech</span>
            <div className="text-surface-500 text-xs font-medium">Plataforma Pro</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-surface-800 mb-4" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 mb-3">
          <span className="text-surface-600 text-xs font-semibold uppercase tracking-widest">Menu</span>
        </div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-600/15 text-brand-400 border border-brand-600/20'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={isActive ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300'}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight size={14} className="text-brand-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4">
        <div className="bg-surface-900 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-surface-200 text-sm font-semibold truncate capitalize">{user?.name}</div>
            <div className="text-surface-500 text-xs truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-lg hover:bg-surface-800 flex items-center justify-center transition-colors"
            title="Sair"
          >
            <LogOut size={15} className="text-surface-500 hover:text-surface-300" />
          </button>
        </div>
      </div>
    </aside>
  )
}
