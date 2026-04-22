import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-surface-50">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
