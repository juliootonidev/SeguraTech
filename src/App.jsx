import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { QuotesProvider } from './context/QuotesContext'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cotacao from './pages/cotacao/Cotacao'
import Emissao from './pages/Emissao'
import Subscricao from './pages/Subscricao'
import Timeline from './pages/Timeline'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cotacao" element={<Cotacao />} />
        <Route path="emissao" element={<Emissao />} />
        <Route path="subscricao" element={<Subscricao />} />
        <Route path="timeline" element={<Timeline />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <QuotesProvider>
        <AppRoutes />
      </QuotesProvider>
    </AuthProvider>
  )
}
