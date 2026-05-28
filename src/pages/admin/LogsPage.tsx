import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { accessLogs } from '../../data/adminMockData'
import {
  Search, Download, LogIn, Eye, FileDown, UserPlus,
  UserMinus, AlertCircle, Clock, Filter,
} from 'lucide-react'

const actionConfig: Record<string, { icon: typeof LogIn; gradient: string; bg: string; text: string }> = {
  'Inicio de sesión': { icon: LogIn, gradient: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Consulta': { icon: Eye, gradient: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-700' },
  'Descarga': { icon: FileDown, gradient: 'from-indigo-400 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  'Creación': { icon: UserPlus, gradient: 'from-cyan-400 to-cyan-600', bg: 'bg-cyan-50', text: 'text-cyan-700' },
  'Deshabilitación': { icon: UserMinus, gradient: 'from-red-400 to-red-600', bg: 'bg-red-50', text: 'text-red-700' },
  'Intento': { icon: AlertCircle, gradient: 'from-amber-400 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-700' },
}

function getConfig(accion: string) {
  for (const [key, value] of Object.entries(actionConfig)) {
    if (accion.includes(key) || accion.toLowerCase().includes(key.toLowerCase())) return value
  }
  return { icon: Eye, gradient: 'from-gray-400 to-gray-600', bg: 'bg-gray-50', text: 'text-gray-700' }
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(date))
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date(date))
}

function groupByDay(logs: typeof accessLogs) {
  const groups: Record<string, typeof accessLogs> = {}
  for (const log of logs) {
    const day = new Date(log.fecha).toISOString().split('T')[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(log)
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
}

export function LogsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('todos')

  let filtered = accessLogs.filter(log =>
    log.usuario.toLowerCase().includes(search.toLowerCase()) ||
    log.empresa.toLowerCase().includes(search.toLowerCase()) ||
    log.accion.toLowerCase().includes(search.toLowerCase())
  )

  if (filter !== 'todos') {
    filtered = filtered.filter(log => log.accion.toLowerCase().includes(filter))
  }

  const grouped = groupByDay(filtered)

  const todayCount = accessLogs.filter(l => l.fecha.startsWith('2026-02-24')).length
  const uniqueUsers = new Set(accessLogs.map(l => l.usuario)).size
  const failedCount = accessLogs.filter(l => l.accion.toLowerCase().includes('fallido')).length

  return (
    <>
      <PageHeader
        title="Logs de Acceso"
        description="Registro de actividad de usuarios en el portal"
      >
        <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 bg-white text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
          <Download size={16} />
          Exportar CSV
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Eventos hoy', value: todayCount, icon: Clock, iconBg: 'bg-cyan-100', iconColor: 'text-cidet-cyan' },
          { label: 'Usuarios únicos', value: uniqueUsers, icon: Eye, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
          { label: 'Intentos fallidos', value: failedCount, icon: AlertCircle, iconBg: failedCount > 0 ? 'bg-red-100' : 'bg-gray-100', iconColor: failedCount > 0 ? 'text-red-600' : 'text-gray-400' },
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Actividad Reciente</CardTitle>
          <div className="flex items-center gap-3">
            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
              <Filter size={13} className="text-gray-400 ml-2 mr-1" />
              {['todos', 'sesión', 'consulta', 'descarga'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                    filter === f
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cidet-cyan/30 focus:border-cidet-cyan w-56"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {grouped.map(([day, logs]) => (
            <div key={day} className="mb-6 last:mb-0">
              {/* Day header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock size={14} className="text-gray-500" />
                </div>
                <p className="text-sm font-semibold text-gray-700 capitalize">{formatDay(logs[0].fecha)}</p>
                <span className="text-[11px] text-gray-400 font-medium">{logs.length} eventos</span>
                <div className="flex-1 border-t border-gray-100" />
              </div>

              {/* Events */}
              <div className="ml-4 space-y-1">
                {logs.map((log) => {
                  const config = getConfig(log.accion)
                  const Icon = config.icon
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      {/* Time */}
                      <span className="text-xs text-gray-400 font-mono tabular-nums w-16 shrink-0">
                        {formatTime(log.fecha)}
                      </span>

                      {/* Icon */}
                      <div className={cn(
                        "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0",
                        config.gradient
                      )}>
                        <Icon size={14} className="text-white" />
                      </div>

                      {/* Action */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{log.accion}</p>
                        <p className="text-xs text-gray-400">{log.usuario} &middot; {log.empresa}</p>
                      </div>

                      {/* Meta */}
                      <div className="hidden lg:flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <code className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded font-mono">{log.ip}</code>
                        <span className="text-[11px] text-gray-400">{log.dispositivo}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}
