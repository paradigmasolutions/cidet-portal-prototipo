import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { users } from '../../data/adminMockData'
import {
  Search, Shield, KeyRound, UserX, UserCheck,
  Users, UserPlus, ShieldCheck, Activity,
} from 'lucide-react'

const avatarColors = [
  'from-cyan-400 to-blue-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-green-500',
  'from-indigo-400 to-blue-600',
  'from-fuchsia-400 to-pink-600',
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function timeAgo(date: string | null) {
  if (!date) return null
  const now = new Date('2026-02-24T10:00:00')
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `Hace ${diffMins}min`
  if (diffHours < 24) return `Hace ${diffHours}h`
  if (diffDays < 7) return `Hace ${diffDays}d`
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short' }).format(d)
}

export function UsuariosPage() {
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.empresa.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const activos = users.filter(u => u.estado === 'activo').length
  const admins = users.filter(u => u.rol === 'admin').length
  const recientes = users.filter(u => {
    if (!u.ultimoAcceso) return false
    const diff = new Date('2026-02-24').getTime() - new Date(u.ultimoAcceso).getTime()
    return diff < 7 * 24 * 60 * 60 * 1000
  }).length

  return (
    <>
      <PageHeader
        title="Gestión de Usuarios"
        description="Administre las cuentas de acceso al portal"
      >
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-cidet-cyan text-white rounded-xl text-sm font-semibold hover:bg-cidet-cyan-dark transition-colors shadow-sm shadow-cidet-cyan/20">
          <UserPlus size={16} />
          Nuevo Usuario
        </button>
      </PageHeader>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: users.length, icon: Users, color: 'from-slate-500 to-slate-700', iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
          { label: 'Activos', value: activos, icon: UserCheck, color: 'from-emerald-500 to-emerald-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
          { label: 'Admins', value: admins, icon: ShieldCheck, color: 'from-indigo-500 to-indigo-700', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
          { label: 'Activos esta semana', value: recientes, icon: Activity, color: 'from-cidet-cyan to-blue-500', iconBg: 'bg-cyan-100', iconColor: 'text-cidet-cyan' },
        ].map(({ label, value, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
              <Icon size={20} className={iconColor} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Usuarios Registrados</CardTitle>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, empresa o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cidet-cyan/30 focus:border-cidet-cyan w-72"
            />
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-2">
            {filtered.map((user, i) => {
              const ago = timeAgo(user.ultimoAcceso)
              return (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shrink-0",
                    user.estado === 'inactivo' ? 'from-gray-300 to-gray-400' : avatarColors[i % avatarColors.length]
                  )}>
                    {getInitials(user.nombre)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm">{user.nombre}</p>
                      {user.rol === 'admin' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md">
                          <Shield size={9} /> ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>

                  {/* Empresa */}
                  <div className="hidden lg:block w-48">
                    <p className="text-xs text-gray-600 font-medium truncate">{user.empresa}</p>
                    {user.certificados > 0 && (
                      <p className="text-[11px] text-gray-400">{user.certificados} certificados</p>
                    )}
                  </div>

                  {/* Last access */}
                  <div className="w-32 text-right">
                    {ago ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          user.ultimoAcceso && (new Date('2026-02-24').getTime() - new Date(user.ultimoAcceso).getTime()) < 24 * 60 * 60 * 1000
                            ? "bg-emerald-400 animate-pulse" : "bg-gray-300"
                        )} />
                        <span className="text-xs text-gray-500">{ago}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300 italic">Sin acceso</span>
                    )}
                  </div>

                  {/* Status */}
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ring-inset shrink-0",
                    user.estado === 'activo'
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-gray-50 text-gray-500 ring-gray-200"
                  )}>
                    {user.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      title="Resetear contraseña"
                      className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <KeyRound size={15} />
                    </button>
                    <button
                      title={user.estado === 'activo' ? 'Deshabilitar' : 'Habilitar'}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        user.estado === 'activo'
                          ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
                          : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
                      )}
                    >
                      {user.estado === 'activo' ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
