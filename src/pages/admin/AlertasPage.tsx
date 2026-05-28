import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Card, CardContent } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { alertConfigs } from '../../data/adminMockData'
import {
  Bell, Mail, Monitor, Save, Clock,
  GitBranch, ShieldX, CalendarClock, CheckCircle2,
} from 'lucide-react'

const alertIcons: Record<string, { icon: typeof Bell; gradient: string }> = {
  'Vencimiento próximo': { icon: CalendarClock, gradient: 'from-amber-400 to-orange-500' },
  'Cambio de etapa': { icon: GitBranch, gradient: 'from-cidet-cyan to-blue-500' },
  'Suspensión': { icon: ShieldX, gradient: 'from-red-400 to-red-600' },
  'Resumen semanal': { icon: CalendarClock, gradient: 'from-indigo-400 to-indigo-600' },
}

function Toggle({ active, onChange }: { active: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none",
        active ? "bg-cidet-cyan" : "bg-gray-200"
      )}
    >
      <span className={cn(
        "absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-all duration-200",
        active ? "left-[22px]" : "left-[3px]"
      )} />
    </button>
  )
}

export function AlertasPage() {
  const [configs, setConfigs] = useState(alertConfigs)
  const [saved, setSaved] = useState(false)

  const toggleEmail = (id: string) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, emailActivo: !c.emailActivo } : c))
    setSaved(false)
  }

  const togglePortal = (id: string) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, portalActivo: !c.portalActivo } : c))
    setSaved(false)
  }

  const updateDias = (id: string, dias: number) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, diasAntes: dias } : c))
    setSaved(false)
  }

  const activeCount = configs.filter(c => c.emailActivo || c.portalActivo).length

  return (
    <>
      <PageHeader
        title="Configuración de Alertas"
        description="Administre las notificaciones automáticas del portal"
      >
        <button
          onClick={() => setSaved(true)}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm",
            saved
              ? "bg-emerald-500 text-white shadow-emerald-500/20"
              : "bg-cidet-cyan text-white hover:bg-cidet-cyan-dark shadow-cidet-cyan/20"
          )}
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? 'Cambios guardados' : 'Guardar Cambios'}
        </button>
      </PageHeader>

      {/* Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Alertas configuradas', value: configs.length, icon: Bell, iconBg: 'bg-cyan-100', iconColor: 'text-cidet-cyan' },
          { label: 'Activas', value: activeCount, icon: CheckCircle2, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
          { label: 'Canales', value: '2', icon: Monitor, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', sub: 'Email + Portal' },
        ].map(({ label, value, icon: Icon, iconBg, iconColor, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
              <Icon size={20} className={iconColor} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
              {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Alert timeline visual */}
      <Card className="mb-6">
        <CardContent className="py-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Línea de tiempo de notificaciones antes del vencimiento</p>
          <div className="relative">
            <div className="h-2 bg-gray-100 rounded-full w-full" />
            <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 rounded-full w-full opacity-30" />
            {configs.filter(c => c.diasAntes > 0).sort((a, b) => a.diasAntes - b.diasAntes).map((c) => {
              const maxDays = 60
              const pos = (c.diasAntes / maxDays) * 100
              return (
                <div
                  key={c.id}
                  className="absolute -top-1"
                  style={{ left: `${100 - pos}%` }}
                >
                  <div className="relative flex flex-col items-center">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 border-white shadow",
                      c.diasAntes <= 15 ? "bg-red-500" : c.diasAntes <= 30 ? "bg-amber-400" : "bg-emerald-400"
                    )} />
                    <div className="mt-2 text-center">
                      <p className="text-xs font-bold text-gray-700">{c.diasAntes}d</p>
                      <p className="text-[10px] text-gray-400 whitespace-nowrap">{c.tipo}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div className="absolute -top-1 left-0 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow" />
              <p className="mt-2 text-[10px] font-bold text-red-600">Vence</p>
            </div>
          </div>
          <div className="flex justify-between mt-8 text-[10px] text-gray-400">
            <span>Fecha vencimiento</span>
            <span>60 días antes</span>
          </div>
        </CardContent>
      </Card>

      {/* Config cards */}
      <div className="space-y-3">
        {configs.map((config) => {
          const alertStyle = alertIcons[config.tipo] || { icon: Bell, gradient: 'from-gray-400 to-gray-600' }
          const Icon = alertStyle.icon
          const isActive = config.emailActivo || config.portalActivo

          return (
            <Card key={config.id} className={cn(!isActive && "opacity-60")}>
              <CardContent className="py-5">
                <div className="flex items-center gap-5">
                  {/* Icon */}
                  <div className={cn(
                    "w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0",
                    alertStyle.gradient
                  )}>
                    <Icon size={20} className="text-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-gray-900">{config.tipo}</h3>
                      {config.diasAntes > 0 && (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={10} />
                          {config.diasAntes} días antes
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{config.descripcion}</p>
                  </div>

                  {/* Days input */}
                  {config.diasAntes > 0 && (
                    <div className="shrink-0">
                      <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block mb-1 text-center">Días</label>
                      <input
                        type="number"
                        value={config.diasAntes}
                        onChange={(e) => updateDias(config.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cidet-cyan/30 focus:border-cidet-cyan text-center font-bold"
                        min={1}
                        max={365}
                      />
                    </div>
                  )}

                  {/* Toggles */}
                  <div className="flex items-center gap-5 shrink-0 pl-4 border-l border-gray-100">
                    <div className="flex flex-col items-center gap-1.5">
                      <Mail size={14} className={config.emailActivo ? "text-cidet-cyan" : "text-gray-300"} />
                      <Toggle active={config.emailActivo} onChange={() => toggleEmail(config.id)} />
                      <span className="text-[10px] text-gray-400 font-medium">Email</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Monitor size={14} className={config.portalActivo ? "text-cidet-cyan" : "text-gray-300"} />
                      <Toggle active={config.portalActivo} onChange={() => togglePortal(config.id)} />
                      <span className="text-[10px] text-gray-400 font-medium">Portal</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
