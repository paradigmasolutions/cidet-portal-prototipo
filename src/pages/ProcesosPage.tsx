import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  CheckCircle2, Circle, Clock, AlertCircle, AlertTriangle, ArrowLeft,
} from 'lucide-react'
import Gantt from 'frappe-gantt'
// CSS de Frappe Gantt copiado al index.css (sección "Frappe Gantt base")
// porque el package usa `exports` restrictivo y bloquea el subpath del CSS.
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/Badge'
import { certificates } from '../data/mockData'

// Hoy en el demo (2026-05-28). Mantener fijo aquí para que las etapas que
// muestran retraso queden estables independientemente de cuándo se abra
// el prototipo.
const TODAY = new Date('2026-05-28')

type StageStatus = 'done' | 'active' | 'pending' | 'blocked'

interface StageContact {
  role: string
  name: string
  email?: string
}

interface Stage {
  id: string
  label: string
  owner: string
  status: StageStatus
  level: 0 | 1 | 2
  startedAt?: string
  dueAt?: string
  finishedAt?: string
  contact?: StageContact
  children?: Stage[]
}

const timelineStages: Stage[] = [
  {
    id: '1',
    label: 'Oferta y aceptación',
    owner: 'Juan David Agudelo',
    status: 'done',
    level: 0,
    startedAt: '2026-01-08',
    finishedAt: '2026-01-22',
    dueAt: '2026-01-22',
    contact: { role: 'Comercial', name: 'Juan David Agudelo', email: 'jagudelo@cidet.org.co' },
    children: [
      { id: '1.1', label: 'Validación y envío de oferta', owner: 'Juan David Agudelo', status: 'done', level: 1, startedAt: '2026-01-08', finishedAt: '2026-01-10', dueAt: '2026-01-10' },
      { id: '1.2', label: 'Oficialización de aceptación', owner: 'Juan David Agudelo', status: 'done', level: 1, startedAt: '2026-01-11', finishedAt: '2026-01-22', dueAt: '2026-01-20' },
    ],
  },
  {
    id: '2',
    label: 'Preparación de auditoría',
    owner: 'Gabriel Pérez',
    status: 'done',
    level: 0,
    startedAt: '2026-02-01',
    finishedAt: '2026-02-18',
    dueAt: '2026-02-18',
    contact: { role: 'Auditor principal', name: 'Gabriel Pérez', email: 'gperez@cidet.org.co' },
    children: [
      { id: '2.1', label: 'Evaluación documental', owner: 'Natalia Mesa', status: 'done', level: 1, startedAt: '2026-02-01', finishedAt: '2026-02-05', dueAt: '2026-02-05' },
      { id: '2.2', label: 'Asignación evaluadores', owner: 'Etimagdiel Ramírez', status: 'done', level: 1, startedAt: '2026-02-06', finishedAt: '2026-02-18', dueAt: '2026-02-15' },
    ],
  },
  {
    id: '3',
    label: 'Auditoría y sistema productivo',
    owner: 'Gabriel Pérez',
    status: 'active',
    level: 0,
    startedAt: '2026-03-04',
    dueAt: '2026-04-30',
    contact: { role: 'Auditor principal', name: 'Gabriel Pérez', email: 'gperez@cidet.org.co' },
    children: [
      { id: '3.1', label: 'Acta de apertura', owner: 'Gabriel Pérez', status: 'done', level: 1, startedAt: '2026-03-04', finishedAt: '2026-03-04', dueAt: '2026-03-04' },
      { id: '3.2', label: 'Evaluación sistema productivo', owner: 'Gabriel Pérez', status: 'active', level: 1, startedAt: '2026-03-18', dueAt: '2026-04-20' },
    ],
  },
  {
    id: '4',
    label: 'Muestras y ensayos',
    owner: 'Daniela Bermúdez',
    status: 'active',
    level: 0,
    startedAt: '2026-03-22',
    dueAt: '2026-05-15',
    contact: { role: 'Analista de muestras', name: 'Daniela Bermúdez', email: 'dbermudez@cidet.org.co' },
    children: [
      { id: '4.1', label: 'Disponibilidad de laboratorios', owner: 'Daniela Bermúdez', status: 'done', level: 1, startedAt: '2026-03-22', finishedAt: '2026-03-30', dueAt: '2026-04-01' },
      { id: '4.2', label: 'Marcación y envío de muestras', owner: 'Daniela Bermúdez', status: 'active', level: 1, startedAt: '2026-04-01', dueAt: '2026-05-10' },
      { id: '4.6', label: 'Reportes de ensayo', owner: 'Laboratorio CIDET', status: 'pending', level: 1, startedAt: '2026-05-10', dueAt: '2026-05-30' },
    ],
  },
  {
    id: '5',
    label: 'Decisión y certificado',
    owner: 'Mauricio Rojas',
    status: 'pending',
    level: 0,
    startedAt: '2026-05-20',
    dueAt: '2026-06-10',
    contact: { role: 'Líder CP', name: 'Mauricio Rojas', email: 'mrojas@cidet.org.co' },
  },
]

function statusIcon(status: StageStatus, size = 16) {
  if (status === 'done') return <CheckCircle2 size={size} className="text-status-valid" />
  if (status === 'active') return <Clock size={size} className="text-cidet-cyan" strokeWidth={2.2} />
  if (status === 'blocked') return <AlertCircle size={size} className="text-status-expired" />
  return <Circle size={size} className="text-gray-300" />
}

function statusLabel(status: StageStatus) {
  if (status === 'done') return 'Hecho'
  if (status === 'active') return 'En curso'
  if (status === 'blocked') return 'Bloqueado'
  return 'Pendiente'
}

function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000)
}

function isDelayed(s: Stage): boolean {
  if (!s.dueAt) return false
  const due = new Date(s.dueAt)
  if (s.status === 'active' && TODAY > due) return true
  if (s.status === 'done' && s.finishedAt && new Date(s.finishedAt) > due) return true
  return false
}

function delayDays(s: Stage): number {
  if (!s.dueAt) return 0
  const due = new Date(s.dueAt)
  if (s.status === 'active' && TODAY > due) return diffDays(TODAY, due)
  if (s.status === 'done' && s.finishedAt && new Date(s.finishedAt) > due) return diffDays(new Date(s.finishedAt), due)
  return 0
}

function computeDelays(stages: Stage[]) {
  const flat: Stage[] = []
  stages.forEach((s) => { flat.push(s); s.children?.forEach((c) => flat.push(c)) })
  const delays = flat.filter(isDelayed).map((s) => ({ stage: s, days: delayDays(s) }))
  const maxDays = delays.reduce((m, d) => Math.max(m, d.days), 0)
  return { delays, maxDays }
}

// ─── Construcción de tareas Frappe Gantt ─────────────────────────────────
//
// Modelo de fechas (Felipe, 2026-05-28): no inventamos % de avance. Las
// barras se dibujan con la duración real:
//   - done    → [startedAt, finishedAt]
//   - active  → [startedAt, max(dueAt, TODAY)]   // se extiende si está retrasada
//   - pending → [startedAt, dueAt]
// Cuando la etapa termina o se vuelve "active retrasada" más allá de dueAt,
// la barra entera se pinta roja (clase bar-delayed) para que el retraso
// se vea sin ambigüedad.

function iso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function taskStart(s: Stage): Date {
  if (s.startedAt) return new Date(s.startedAt)
  if (s.dueAt) return new Date(s.dueAt)
  return TODAY
}

function taskEnd(s: Stage): Date {
  if (s.status === 'done' && s.finishedAt) return new Date(s.finishedAt)
  if (s.status === 'active') {
    const due = s.dueAt ? new Date(s.dueAt) : TODAY
    return TODAY > due ? TODAY : due
  }
  return s.dueAt ? new Date(s.dueAt) : TODAY
}

function customClassFor(s: Stage): string {
  if (isDelayed(s)) return 'bar-delayed'
  if (s.status === 'done') return 'bar-done'
  if (s.status === 'active') return 'bar-active'
  return 'bar-pending'
}

interface FrappeTask {
  id: string
  name: string
  start: string
  end: string
  progress: number
  custom_class: string
  dependencies: string
}

function buildFrappeTasks(stages: Stage[]): FrappeTask[] {
  const tasks: FrappeTask[] = []
  stages.forEach((s, idx) => {
    const prevTop = idx > 0 ? stages[idx - 1].id : ''
    tasks.push({
      id: s.id,
      name: `${s.id}. ${s.label}`,
      start: iso(taskStart(s)),
      end: iso(taskEnd(s)),
      progress: 0,
      custom_class: customClassFor(s),
      dependencies: prevTop,
    })
    s.children?.forEach((c, ci) => {
      const prevChild = ci > 0 ? `${s.id}::${s.children![ci - 1].id}` : s.id
      tasks.push({
        id: `${s.id}::${c.id}`,
        name: `   ${c.label}`,
        start: iso(taskStart(c)),
        end: iso(taskEnd(c)),
        progress: 0,
        custom_class: customClassFor(c),
        dependencies: prevChild,
      })
    })
  })
  return tasks
}

function ProcessGantt({ stages }: { stages: Stage[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const ganttRef = useRef<unknown>(null)

  useEffect(() => {
    if (!ref.current) return
    // Reset del contenedor — Frappe Gantt inyecta SVG, recargar si cambia
    // el set de tasks (ej. cuando cambiamos de cert).
    ref.current.innerHTML = ''
    const tasks = buildFrappeTasks(stages)
    // Encontrar etapa correspondiente al id para el popup custom.
    const byId = new Map<string, Stage>()
    stages.forEach((s) => {
      byId.set(s.id, s)
      s.children?.forEach((c) => byId.set(`${s.id}::${c.id}`, c))
    })
    ganttRef.current = new Gantt(ref.current, tasks, {
      view_mode: 'Week',
      bar_height: 22,
      bar_corner_radius: 4,
      padding: 16,
      header_height: 50,
      readonly: true,
      popup: ({ task, set_title, set_subtitle, set_details }) => {
        const stage = byId.get(task.id)
        if (!stage) {
          set_title(task.name)
          set_subtitle('')
          set_details('')
          return
        }
        const delayed = isDelayed(stage)
        const days = delayDays(stage)
        set_title(stage.label)
        set_subtitle(`${statusLabel(stage.status)} · ${stage.owner}`)
        const lines: string[] = []
        if (stage.startedAt) lines.push(`Inicio: ${new Date(stage.startedAt).toLocaleDateString('es-CO')}`)
        if (stage.dueAt) lines.push(`Esperado: ${new Date(stage.dueAt).toLocaleDateString('es-CO')}`)
        if (stage.finishedAt) lines.push(`Cierre: ${new Date(stage.finishedAt).toLocaleDateString('es-CO')}`)
        if (delayed) lines.push(`Retraso: ${days} día${days === 1 ? '' : 's'}`)
        set_details(lines.join('<br/>'))
      },
    })

    // Centrar la vista en la línea de hoy. Frappe Gantt la dibuja en
    // posición absoluta dentro de `.gantt-container` (scroll horizontal
    // interno); por defecto deja la línea hacia el borde izquierdo del
    // viewport. Después de un tick ajustamos `scrollLeft` para dejarla
    // visualmente al centro.
    requestAnimationFrame(() => {
      const root = ref.current
      if (!root) return
      const inner = root.querySelector('.gantt-container') as HTMLElement | null
      const todayLine = root.querySelector('.current-highlight') as HTMLElement | null
      if (!inner || !todayLine) return
      const leftPx = parseFloat(todayLine.style.left || '0')
      const offset = leftPx - inner.clientWidth / 2
      inner.scrollLeft = Math.max(0, offset)
    })
    return () => {
      if (ref.current) ref.current.innerHTML = ''
    }
  }, [stages])

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>Línea de tiempo del proceso</CardTitle>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-gray-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3 rounded" style={{ backgroundColor: '#178f5b' }} /> Hecho</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3 rounded" style={{ backgroundColor: '#00cfff' }} /> En curso</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3 rounded" style={{ backgroundColor: '#cbd5e1' }} /> Pendiente</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-3 rounded" style={{ backgroundColor: '#ef4444' }} /> Retrasada</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="cidet-gantt overflow-x-auto" ref={ref} />
      </CardContent>
    </Card>
  )
}

// ─── Página ──────────────────────────────────────────────────────────────

export function ProcesosPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const certificateCode = searchParams.get('certificate') ?? '08092'
  const businessId = searchParams.get('business') ?? 'COF-2026-14'
  const selectedCertificate = certificates.find((c) => c.numero === certificateCode) ?? certificates[2]
  const { delays, maxDays } = computeDelays(timelineStages)
  const activeStage = timelineStages.find((s) => s.status === 'active')

  return (
    <>
      {/* Header compacto: Volver + título + meta en una sola fila. Sin
          banner duplicado "CIDET Certificación" del PageHeader (lo da el
          contexto global de la app). */}
      <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-gray-200 pb-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-bold text-gray-700 hover:border-cidet-cyan hover:text-cidet-navy"
        >
          <ArrowLeft size={13} />
          Volver
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Proceso</span>
            <h1 className="text-xl font-extrabold tracking-tight text-cidet-navy">{certificateCode}</h1>
            <span className="rounded-md bg-cidet-cyan-light px-2 py-0.5 text-[11px] font-bold text-cidet-cyan-dark">
              {businessId}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            {selectedCertificate.producto} · {selectedCertificate.esquema}
          </p>
        </div>
      </div>

      {delays.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-md border border-status-expired/30 bg-red-50 px-3 py-2 text-xs">
          <AlertTriangle size={14} className="shrink-0 text-status-expired" />
          <span className="font-bold text-status-expired">
            {delays.length} etapa{delays.length === 1 ? '' : 's'} con retraso · mayor: {maxDays} días
          </span>
          <span className="text-status-expired/80">
            ({delays.slice(0, 3).map((d) => `${d.stage.label} +${d.days}d`).join(' · ')}{delays.length > 3 ? ` · +${delays.length - 3}` : ''})
          </span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <ProcessGantt stages={timelineStages} />

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Certificado {selectedCertificate.numero}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Producto</span>
                  <span className="text-right font-semibold text-gray-900">{selectedCertificate.producto}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Estado</span>
                  <StatusBadge status={selectedCertificate.estado} />
                </div>
                {activeStage && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Etapa actual</span>
                    <span className="text-right font-semibold text-cidet-navy">{activeStage.label}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {activeStage?.contact && (
            <Card>
              <CardHeader>
                <CardTitle>Contacto de la etapa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  {statusIcon(activeStage.status, 16)}
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase text-gray-400">{activeStage.contact.role}</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">{activeStage.contact.name}</p>
                    <p className="mt-0.5 text-[11px] text-gray-500">{statusLabel(activeStage.status)}</p>
                    <button
                      onClick={() => navigate(`/contacto?certificate=${certificateCode}&target=${encodeURIComponent(activeStage.contact!.name)}`)}
                      className="mt-3 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-cidet-navy text-[11px] font-bold text-white hover:bg-cidet-darker"
                    >
                      Escribir
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
