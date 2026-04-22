import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 800))
    login(email)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-surface-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-900/80 via-surface-950 to-surface-950" />
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center shadow-brand">
              <Zap size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-bold text-xl">SeguraTech</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-soft" />
            <span className="text-brand-300 text-sm font-medium">Plataforma ativa</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Gestão de seguros{' '}
            <span className="text-brand-400">inteligente</span>{' '}
            e eficiente
          </h2>
          <p className="text-surface-400 text-lg leading-relaxed max-w-md">
            Cotação, emissão e subscrição em uma plataforma moderna. Reduza o tempo operacional e aumente sua conversão.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '98%', label: 'Uptime garantido' },
            { value: '2.4s', label: 'Tempo médio cotação' },
            { value: '+40%', label: 'Aumento em conversão' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-white font-bold text-xl">{stat.value}</div>
              <div className="text-surface-500 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel (login form) */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-2xl bg-brand-600 flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">SeguraTech</span>
          </div>

          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold mb-2">Bem-vindo de volta</h1>
            <p className="text-surface-400">Entre com suas credenciais para acessar a plataforma</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-surface-300 text-sm font-semibold">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-surface-300 text-sm font-semibold">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-900 border border-surface-700 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder:text-surface-600 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-brand-400 text-sm hover:text-brand-300 transition-colors font-medium">
                Esqueci a senha
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-brand flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar na plataforma
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-surface-600 text-sm mt-6">
            Demo: qualquer email + senha
          </p>
        </div>
      </div>
    </div>
  )
}
