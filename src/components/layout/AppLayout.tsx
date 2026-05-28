import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Sidebar />
      <main className="min-h-screen overflow-x-hidden p-4 pb-24 pt-[88px] md:ml-[280px] md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
