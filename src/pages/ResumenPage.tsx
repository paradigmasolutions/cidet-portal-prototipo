import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertOctagon, AlertTriangle, ArrowRight, Bell, Building2, CalendarClock, ChevronDown, ChevronRight,
  ChevronUp, FileCheck2, Mail, Phone, RefreshCw, Search, ShieldCheck, UserRoundCheck,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { useI18n } from '../i18n'

// ─── Tipos del dominio "trabajo pendiente" ────────────────────────────────
//
// Tanto los procesos (workflows de certificación con etapas) como las alertas
// (señales sobre certs ya emitidos) son "trabajo pendiente" y caen en uno de
// 4 estados de acción. Los KPIs filtran a ambas secciones por igual.

// Tres estados funcionales. Lo que antes llamábamos "atascado" se reabsorbe
// en uno de los dos primeros según quién tiene que destrabarlo. La condición
// de "retrasado" se infiere de `diasRetraso > 0` y de `bloqueoMotivo` —
// son indicadores visuales secundarios, no un cuarto estado.
export type AccionEstado = 'accion_cliente' | 'accion_cidet' | 'en_curso'

interface Activity {
  title: string
  owner: string
  role: string
  due: string
  accionEstado: AccionEstado
  bloqueoMotivo?: string
  diasRetraso?: number
}

interface ProcessCert {
  code: string
  product: string
  type: string
  status: string
  completed: number
  pending: number
  activities: Activity[]
}

interface Business {
  id: string
  certificates: ProcessCert[]
}

interface Alerta {
  type: string
  title: string
  certificate: string
  context: string
  detail: string
  due: string
  accionEstado: AccionEstado
  action: string
  route: 'contacto' | 'preoferta' | 'certificados' | 'documentos'
}

// ─── Mocks ────────────────────────────────────────────────────────────────

const activeBusinesses: Business[] = [
  {
    id: 'COF-2026-14',
    certificates: [
      {
        code: '08092', product: 'Drivers LED', type: 'Renovación', status: 'Auditoría',
        completed: 6, pending: 3,
        activities: [
          { title: 'Evaluación sistema productivo', owner: 'Gabriel Pérez', role: 'Auditor principal', due: '30 abr 2026', accionEstado: 'accion_cliente', bloqueoMotivo: 'Cliente aún no confirma fecha en planta Shanghai', diasRetraso: 28 },
          { title: 'Revisión de requisitos de inspección', owner: 'Natalia Mesa', role: 'Analista técnico', due: '24 abr 2026', accionEstado: 'accion_cidet', diasRetraso: 4 },
        ],
      },
      {
        code: '08097', product: 'Luminarias LED industriales', type: 'Ampliación', status: 'Muestras',
        completed: 4, pending: 2,
        activities: [
          { title: 'Marcación y envío de muestras', owner: 'Daniela Bermúdez', role: 'Analista de muestras', due: '02 may 2026', accionEstado: 'accion_cliente', bloqueoMotivo: 'Esperando muestras del cliente', diasRetraso: -2 },
        ],
      },
    ],
  },
  {
    id: 'COF-2026-22',
    certificates: [
      {
        code: 'PRE-1148', product: 'Controladores de iluminación', type: 'Nuevo certificado', status: 'Código preliminar',
        completed: 2, pending: 5,
        activities: [
          { title: 'Validación documental inicial', owner: 'Juan David Agudelo', role: 'Comercial', due: '26 abr 2026', accionEstado: 'accion_cidet', diasRetraso: 1 },
        ],
      },
    ],
  },
  {
    id: 'COF-2026-31',
    certificates: [
      {
        code: '08095', product: 'Fuentes electrónicas', type: 'Seguimiento', status: 'Suspendido',
        completed: 1, pending: 4,
        activities: [
          { title: 'Definir plan de reactivación', owner: 'Betty Ochoa', role: 'Comercial', due: '23 abr 2026', accionEstado: 'accion_cliente', bloqueoMotivo: 'Sin respuesta del cliente desde la suspensión', diasRetraso: 35 },
        ],
      },
    ],
  },
  {
    id: 'COF-2026-38',
    certificates: [
      {
        code: 'PRE-1162', product: 'Drivers programables', type: 'Nuevo certificado', status: 'Cotización',
        completed: 1, pending: 6,
        activities: [
          { title: 'Aceptación de oferta económica', owner: 'Cliente', role: 'Compras Signify', due: '08 may 2026', accionEstado: 'accion_cliente', diasRetraso: 0 },
          { title: 'Validación de alcance técnico', owner: 'David Velásquez', role: 'Técnico CIDET', due: '15 may 2026', accionEstado: 'en_curso', diasRetraso: -7 },
        ],
      },
    ],
  },
  {
    id: 'COF-2026-42',
    certificates: [
      {
        code: '08213', product: 'Paneles LED para techo', type: 'Seguimiento', status: 'Auditoría',
        completed: 3, pending: 4,
        activities: [
          { title: 'Acta de apertura', owner: 'Gabriel Pérez', role: 'Auditor principal', due: '12 may 2026', accionEstado: 'en_curso', diasRetraso: -14 },
          { title: 'Plan de auditoría', owner: 'Gabriel Pérez', role: 'Auditor principal', due: '06 may 2026', accionEstado: 'accion_cidet', diasRetraso: 0 },
        ],
      },
      {
        code: '08342', product: 'Downlights LED empotrables', type: 'Seguimiento', status: 'Documental',
        completed: 2, pending: 3,
        activities: [
          { title: 'Verificación de marcado en planta', owner: 'Cliente', role: 'Calidad Signify Países Bajos', due: '20 may 2026', accionEstado: 'accion_cliente', bloqueoMotivo: 'Pendiente envío de fotografías de uso de marca', diasRetraso: 0 },
        ],
      },
    ],
  },
  {
    id: 'COF-2026-45',
    certificates: [
      {
        code: '08456', product: 'Luminarias viales LED', type: 'Renovación', status: 'Ensayos',
        completed: 5, pending: 3,
        activities: [
          { title: 'Reporte de ensayos fotométricos', owner: 'Laboratorio CIDET', role: 'Laboratorio', due: '22 may 2026', accionEstado: 'en_curso', diasRetraso: -22 },
          { title: 'Reporte de ensayos eléctricos', owner: 'Laboratorio CIDET', role: 'Laboratorio', due: '22 may 2026', accionEstado: 'en_curso', diasRetraso: -22 },
        ],
      },
    ],
  },
]

// Alertas — señales puntuales sobre certs emitidos. Cada una mapeada a su
// accionEstado para que los KPIs cuenten procesos + alertas en el mismo eje.
const alertas: Alerta[] = [
  {
    type: 'Suspensión',
    title: 'Certificado suspendido por falta de seguimiento',
    certificate: '08095',
    context: 'Fuentes electrónicas · RETIE 2024',
    detail: 'El certificado no puede usarse comercialmente hasta acordar el plan de reactivación.',
    due: 'Suspendido desde 06 nov 2025',
    accionEstado: 'accion_cliente',
    action: 'Contactar comercial',
    route: 'contacto',
  },
  {
    type: 'Renovación',
    title: 'Renovación próxima a iniciar',
    certificate: '08097',
    context: 'Luminarias LED industriales · RETILAP',
    detail: 'Conviene solicitar cotización antes de que la vigencia entre en ventana crítica.',
    due: 'Vence el 25 jun 2026',
    accionEstado: 'accion_cliente',
    action: 'Solicitar cotización',
    route: 'preoferta',
  },
  {
    type: 'Seguimiento',
    title: 'Seguimiento próximo',
    certificate: '08092',
    context: 'Drivers LED · auditoría máxima',
    detail: 'La auditoría debe quedar gestionada antes de la fecha máxima definida.',
    due: '02 may 2026',
    accionEstado: 'accion_cidet',
    action: 'Ver certificado',
    route: 'certificados',
  },
  {
    type: 'Documento de planta',
    title: 'ISO 9001 de planta por vencer',
    certificate: '07827',
    context: 'SIGNIFY Netherlands B.V.',
    detail: 'Actualizar el soporte evita reprocesos en renovaciones asociadas a esta planta.',
    due: '24 ene 2027',
    accionEstado: 'accion_cliente',
    action: 'Actualizar documento',
    route: 'documentos',
  },
]

// ─── Helpers de estado de acción ──────────────────────────────────────────

const accionSeverity: Record<AccionEstado, number> = {
  accion_cliente: 0, accion_cidet: 1, en_curso: 2,
}

function worstAccion(items: AccionEstado[]): AccionEstado {
  return items.reduce<AccionEstado>(
    (acc, cur) => (accionSeverity[cur] < accionSeverity[acc] ? cur : acc),
    'en_curso',
  )
}

function certAccion(c: ProcessCert): AccionEstado {
  return worstAccion(c.activities.map((a) => a.accionEstado))
}

function businessAccion(b: Business): AccionEstado {
  return worstAccion(b.certificates.map(certAccion))
}

// Estilos por estado de acción — reutilizados en KPI cards y badges.
const accionStyles: Record<AccionEstado, { label: string; tone: string; bg: string; chip: string; hint: string; borderLeft: string; dot: string }> = {
  accion_cliente: { label: 'Acción cliente', tone: 'text-status-expiring', bg: 'bg-amber-50',         chip: 'bg-amber-50 text-status-expiring',        hint: 'Esperan respuesta del cliente', borderLeft: 'border-l-status-expiring', dot: 'bg-status-expiring' },
  accion_cidet:   { label: 'Acción CIDET',   tone: 'text-cidet-cyan-dark', bg: 'bg-cidet-cyan-light', chip: 'bg-cidet-cyan-light text-cidet-cyan-dark', hint: 'Esperan respuesta CIDET', borderLeft: 'border-l-cidet-cyan',      dot: 'bg-cidet-cyan' },
  en_curso:       { label: 'En curso',       tone: 'text-status-valid',    bg: 'bg-emerald-50',       chip: 'bg-emerald-50 text-status-valid',         hint: 'Avanzan dentro del plazo', borderLeft: 'border-l-status-valid',    dot: 'bg-status-valid' },
}

function alertIcon(type: string) {
  const size = 15
  if (type === 'Suspensión')          return <AlertOctagon size={size} />
  if (type === 'Renovación')          return <RefreshCw size={size} />
  if (type === 'Documento de planta') return <FileCheck2 size={size} />
  return <CalendarClock size={size} />
}

// ─── Vista única "Procesos" ───────────────────────────────────────────────
//
// La misma vista para cliente y para comercial CIDET; lo que cambia es la
// data subyacente (el mock filtrado por viewAsClient en producción). Tiene
// dos secciones: Procesos (jerárquicos, expandibles) y Alertas (lista plana).
// Los 4 KPIs cuentan procesos + alertas en el mismo eje de acción.

// Filtros que disparan los KPI cards. 'alertas' es un eje aparte del estado
// de acción: filtra solo a la sección Alertas y oculta la de Procesos. Los
// otros 3 filtran a Procesos por estado y ocultan Alertas (no aplican). El
// estado 'atascado' del modelo sigue existiendo para los agrupadores, pero
// no tiene KPI propio (Felipe, 2026-05-28).
type ProcFilter = 'all' | 'alertas' | 'accion_cliente' | 'accion_cidet' | 'en_curso'

const ALERTAS_PER_PAGE = 5

function ProcesosView() {
  const { mode, viewAsClient } = useI18n()
  const navigate = useNavigate()
  const isAdminView = mode === 'internal' && !viewAsClient

  const [filter, setFilter] = useState<ProcFilter>('all')
  const [query, setQuery] = useState('')
  const [alertaTipo, setAlertaTipo] = useState<string>('todos')
  const [alertaPage, setAlertaPage] = useState(1)

  // Cuentas de los KPIs. "Alertas" agrega todas las alertas vivas; las
  // otras tres cuentan procesos por estado (atascado no tiene KPI propio).
  const counts = useMemo(() => {
    const c = { alertas: alertas.length, accion_cliente: 0, accion_cidet: 0, en_curso: 0 }
    activeBusinesses.forEach((b) => {
      const e = businessAccion(b)
      if (e === 'accion_cliente' || e === 'accion_cidet' || e === 'en_curso') c[e]++
    })
    return c
  }, [])

  const filteredBusinesses = useMemo(() => {
    // Filter de alertas oculta procesos por completo.
    if (filter === 'alertas') return []
    const q = query.trim().toLowerCase()
    return activeBusinesses.filter((b) => {
      // 'all' deja pasar todo; los otros filtros (accion_cliente/cidet/en_curso)
      // requieren que el estado peor del negocio coincida exactamente.
      if (filter !== 'all' && businessAccion(b) !== filter) return false
      if (q.length === 0) return true
      const hay = [
        b.id,
        ...b.certificates.flatMap((c) => [
          c.code, c.product, c.type, c.status,
          ...c.activities.flatMap((a) => [a.title, a.owner, a.role]),
        ]),
      ].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [filter, query])

  const filteredAlertas = useMemo(() => {
    // Las alertas se muestran cuando filter es 'all' o 'alertas'. Los demás
    // filtros (accion_cliente/cidet/en_curso) son de estado de proceso y
    // no aplican a alertas, así que se ocultan.
    if (filter !== 'all' && filter !== 'alertas') return []
    const q = query.trim().toLowerCase()
    return alertas.filter((a) => {
      if (alertaTipo !== 'todos' && a.type !== alertaTipo) return false
      if (q.length === 0) return true
      const hay = [a.title, a.certificate, a.context, a.detail, a.type].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [filter, query, alertaTipo])

  // Lista única de tipos para los push buttons. Se calcula desde el mock
  // así si se agregan nuevos tipos los chips aparecen sin tocar la UI.
  const alertaTipos = useMemo(() => Array.from(new Set(alertas.map((a) => a.type))).sort(), [])

  const alertasTotalPages = Math.max(1, Math.ceil(filteredAlertas.length / ALERTAS_PER_PAGE))
  const pagedAlertas = filteredAlertas.slice((alertaPage - 1) * ALERTAS_PER_PAGE, alertaPage * ALERTAS_PER_PAGE)

  // Reset paginación cuando cambian filtros que afectan al universo de alertas.
  useEffect(() => { setAlertaPage(1) }, [filter, query, alertaTipo])

  // Cuando filter === 'all' agrupamos los procesos por estado de acción (peor
  // estado primero) para que se vea la priorización; con filtro, lista plana.
  const groupedMode = filter === 'all'
  const order: AccionEstado[] = ['accion_cliente', 'accion_cidet', 'en_curso']
  const groups = useMemo(() => {
    if (!groupedMode) return []
    return order
      .map((status) => ({ status, items: filteredBusinesses.filter((b) => businessAccion(b) === status) }))
      .filter((g) => g.items.length > 0)
  }, [filteredBusinesses, groupedMode])

  return (
    <>
      <PageHeader title="Procesos" compact>
        <div className="text-right">
          {viewAsClient && (
            <p className="text-[11px] font-bold uppercase tracking-wide text-cidet-cyan-dark">
              Viendo como
            </p>
          )}
          <p className="text-sm font-bold text-gray-700">
            {isAdminView ? 'Portafolio CIDET' : viewAsClient ? viewAsClient.legalName : 'Tu organización'}
          </p>
          <p className="text-[11px] font-semibold text-gray-500">
            Última actualización: 24 feb 2026, 06:00 AM
          </p>
        </div>
      </PageHeader>

      {/* KPI grid clickeable — los 4 estados de acción cuentan procesos y
          alertas juntos. Click en uno filtra ambas secciones; click en Total
          o repetir el mismo card vuelve a 'all'. */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AlertasKpiCard value={counts.alertas} active={filter === 'alertas'} dimmed={filter !== 'all' && filter !== 'alertas'} onSelect={() => setFilter(filter === 'alertas' ? 'all' : 'alertas')} />
        <ProcKpiCard estado="accion_cliente" value={counts.accion_cliente} filter={filter} onSelect={setFilter} />
        <ProcKpiCard estado="accion_cidet"   value={counts.accion_cidet}   filter={filter} onSelect={setFilter} />
        <ProcKpiCard estado="en_curso"       value={counts.en_curso}       filter={filter} onSelect={setFilter} />
      </div>

      {/* Buscador transversal — aplica a procesos y a alertas. */}
      <div className="mb-5 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <label className="relative block">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm outline-none focus:border-cidet-cyan focus:bg-white"
            placeholder="Buscar negocio, certificado, producto, responsable o alerta"
          />
        </label>
      </div>

      {/* Layout adaptativo según el filtro:
          - 'all'              → grid 7/3 (procesos + alertas lado a lado)
          - 'alertas'          → solo alertas, ancho completo
          - otro estado proc   → solo procesos, ancho completo */}
      {filter === 'alertas' ? (
        <section>
          <AlertasSectionHeader
            count={filteredAlertas.length}
            tipo={alertaTipo}
            tipos={alertaTipos}
            onTipoChange={setAlertaTipo}
          />
          <AlertasList
            items={pagedAlertas}
            page={alertaPage}
            totalPages={alertasTotalPages}
            onPageChange={setAlertaPage}
            onAction={(a) => navigate(routeFor(a))}
          />
        </section>
      ) : filter !== 'all' ? (
        <div>
          <SectionHeader icon={<ChevronRight size={16} />} title="Procesos en curso" count={filteredBusinesses.length} />
          {filteredBusinesses.length === 0 ? (
            <EmptyBlock message="Sin procesos que coincidan con el filtro." />
          ) : (
            <div className="space-y-3">
              {filteredBusinesses.map((b) => <BusinessRow key={b.id} business={b} />)}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[7fr_3fr]">
          <div>
            <SectionHeader icon={<ChevronRight size={16} />} title="Procesos en curso" count={filteredBusinesses.length} />
            {filteredBusinesses.length === 0 ? (
              <EmptyBlock message="Sin procesos que coincidan con el filtro." />
            ) : groupedMode ? (
              <div className="space-y-4">
                {groups.map((g) => (
                  <ProcessGroup key={g.status} status={g.status} items={g.items} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBusinesses.map((b) => <BusinessRow key={b.id} business={b} />)}
              </div>
            )}
          </div>

          <aside className="self-start lg:sticky lg:top-4">
            <AlertasSectionHeader
              count={filteredAlertas.length}
              tipo={alertaTipo}
              tipos={alertaTipos}
              onTipoChange={setAlertaTipo}
            />
            <AlertasList
              items={pagedAlertas}
              page={alertaPage}
              totalPages={alertasTotalPages}
              onPageChange={setAlertaPage}
              onAction={(a) => navigate(routeFor(a))}
            />
          </aside>
        </div>
      )}
    </>
  )
}

// Aliases para acortar etiquetas que serían demasiado largas en los push
// buttons del filtro. El `type` original se conserva en cada alerta (para
// el badge), aquí solo se mapea la presentación del filtro.
const tipoAlias: Record<string, string> = {
  'Documento de planta': 'Documentos',
}

// Header de la sección Alertas con push buttons para filtrar por tipo.
function AlertasSectionHeader({ count, tipo, tipos, onTipoChange }: { count: number; tipo: string; tipos: string[]; onTipoChange: (t: string) => void }) {
  return (
    <div className="mb-3 space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-gray-500"><Bell size={16} /></span>
        <h2 className="text-base font-extrabold text-gray-900">Alertas</h2>
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">{count}</span>
      </div>
      <div className="flex flex-wrap gap-1 px-1">
        <TipoBtn label="Todos" active={tipo === 'todos'} onClick={() => onTipoChange('todos')} />
        {tipos.map((t) => (
          <TipoBtn key={t} label={tipoAlias[t] ?? t} active={tipo === t} onClick={() => onTipoChange(t)} />
        ))}
      </div>
    </div>
  )
}

function TipoBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-6 items-center rounded-full px-2 text-[10px] font-bold transition-colors ${
        active
          ? 'bg-cidet-navy text-white'
          : 'border border-gray-200 bg-white text-gray-600 hover:border-cidet-cyan hover:text-cidet-navy'
      }`}
    >
      {label}
    </button>
  )
}

function AlertasList({ items, page, totalPages, onPageChange, onAction }: { items: Alerta[]; page: number; totalPages: number; onPageChange: (p: number) => void; onAction: (a: Alerta) => void }) {
  if (items.length === 0) {
    return <EmptyBlock message="Sin alertas que coincidan con el filtro." />
  }
  return (
    <>
      <div className="space-y-2">
        {items.map((a) => <AlertaRow key={`${a.certificate}-${a.title}`} alerta={a} onAction={() => onAction(a)} />)}
      </div>
      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white px-2.5 text-[11px] font-bold text-gray-700 hover:border-cidet-cyan disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-2 text-[11px] font-semibold text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="inline-flex h-8 items-center rounded-md border border-gray-200 bg-white px-2.5 text-[11px] font-bold text-gray-700 hover:border-cidet-cyan disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </>
  )
}

// ─── Sub-componentes de la vista Procesos ─────────────────────────────────

function ProcKpiCard({ estado, value, filter, onSelect }: { estado: AccionEstado; value: number; filter: ProcFilter; onSelect: (f: ProcFilter) => void }) {
  const s = accionStyles[estado]
  const selected = filter === estado
  const dimmed = filter !== 'all' && !selected
  return (
    <button
      type="button"
      onClick={() => onSelect(selected ? 'all' : estado)}
      aria-pressed={selected}
      className={`rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:shadow-md ${selected ? `border-2 ${s.tone.replace('text-', 'border-')}` : 'border-gray-100'} ${dimmed ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className={`text-[11px] font-bold uppercase tracking-wide ${s.tone}`}>{s.label}</p>
          <p className="mt-1 text-3xl font-extrabold text-gray-950">{value}</p>
          <span className={`mt-2 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold ${s.chip}`}>{s.hint}</span>
        </div>
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${s.bg} ${s.tone}`}>
          {estado === 'accion_cliente' && <UserRoundCheck size={16} />}
          {estado === 'accion_cidet' && <Building2 size={16} />}
          {estado === 'en_curso' && <ShieldCheck size={16} />}
        </div>
      </div>
    </button>
  )
}

// KPI específico de alertas. Visualmente distinto a los KPI de procesos
// (rojo, ícono de campana) porque alertas son una categoría aparte.
function AlertasKpiCard({ value, active, dimmed, onSelect }: { value: number; active: boolean; dimmed: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`rounded-lg border bg-white p-4 text-left shadow-sm transition-all hover:shadow-md ${active ? 'border-2 border-status-expired' : 'border-gray-100'} ${dimmed ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-status-expired">Alertas</p>
          <p className="mt-1 text-3xl font-extrabold text-gray-950">{value}</p>
          <span className="mt-2 inline-flex rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-status-expired">
            Requieren atención
          </span>
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-50 text-status-expired">
          <Bell size={16} />
        </div>
      </div>
    </button>
  )
}

function SectionHeader({ icon, title, count, className = '' }: { icon: React.ReactNode; title: string; count: number; className?: string }) {
  return (
    <div className={`mb-3 flex items-center gap-2 px-1 ${className}`}>
      <span className="text-gray-500">{icon}</span>
      <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">{count}</span>
    </div>
  )
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
      {message}
    </div>
  )
}

const GROUP_CAP = 8

function ProcessGroup({ status, items }: { status: AccionEstado; items: Business[] }) {
  const s = accionStyles[status]
  // Crítico abierto, en_curso colapsado por defecto.
  const [expanded, setExpanded] = useState<boolean>(status !== 'en_curso')
  const overflow = items.length > GROUP_CAP
  const visible = expanded && overflow ? items.slice(0, GROUP_CAP) : items

  return (
    <section className="rounded-lg border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50/60"
        aria-expanded={expanded}
      >
        <span className={`grid h-7 w-7 place-items-center rounded-md bg-gray-50 ${s.tone}`}>
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
        <h3 className={`text-base font-extrabold ${s.tone}`}>{s.label}</h3>
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">{items.length}</span>
        <p className="text-xs font-semibold text-gray-500">{s.hint}</p>
      </button>
      {expanded && (
        <div className="border-t border-gray-100 p-3 space-y-3">
          {visible.map((b) => <BusinessRow key={b.id} business={b} />)}
          {overflow && (
            <p className="text-center text-[11px] font-semibold text-gray-500">
              Mostrando los primeros {GROUP_CAP} de {items.length}. Filtra por estado para ver todos.
            </p>
          )}
        </div>
      )}
    </section>
  )
}

function BusinessRow({ business }: { business: Business }) {
  // Arranca colapsado — el usuario hace drill-down cuando quiere mirar
  // las actividades de un negocio. Menos ruido visual al cargar la lista.
  const [expanded, setExpanded] = useState(false)
  const estado = businessAccion(business)
  const s = accionStyles[estado]

  // Nivel 1 — Negocio. Diseño inline original: barra de color absoluta a
  // la izquierda + header en UNA línea (label · ID · estado · chips de
  // certs cuando colapsado). Mismo patrón que tenía el prototipo anterior.
  return (
    <section className="relative overflow-hidden rounded-lg border border-gray-100 bg-white p-4 pl-5 shadow-sm">
      <span className={`absolute bottom-0 left-0 top-0 w-1 ${s.dot}`} />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`flex w-full items-center justify-between gap-4 text-left ${expanded ? 'border-b border-gray-100 pb-3' : ''}`}
        aria-expanded={expanded}
      >
        <div className="grid gap-2 md:grid-cols-[auto_1fr] md:items-center md:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-gray-400">Código de negocio</span>
            <span className="rounded-md bg-cidet-cyan-light px-2 py-0.5 text-[11px] font-bold text-cidet-cyan-dark">
              {business.id}
            </span>
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${s.chip}`}>{s.label}</span>
          </div>
          {!expanded && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-gray-400">Certificados</span>
              {business.certificates.map((c) => (
                <span
                  key={`${business.id}-${c.code}-chip`}
                  className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-bold text-gray-600"
                >
                  {c.code}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500">
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 grid gap-3">
          {business.certificates.map((c) => <CertRow key={c.code} cert={c} businessId={business.id} />)}
        </div>
      )}
    </section>
  )
}

function CertRow({ cert, businessId }: { cert: ProcessCert; businessId: string }) {
  const navigate = useNavigate()
  // Cert arranca expandido — al hacer drill-down en el Business ya quieres
  // ver las actividades; obligar a un segundo click sería redundante.
  const [expanded, setExpanded] = useState(true)
  const estado = certAccion(cert)
  const s = accionStyles[estado]

  // Nivel 2 — Certificado. Layout inline original: grid de 4 columnas
  // [120px_1fr_auto_auto] con código grande · tipo+status+producto · chips
  // de progreso · botón expand. Conector visual a la izquierda.
  return (
    <div className="relative rounded-lg border border-gray-100 bg-gray-50/70 p-3 pl-5">
      <span className="absolute bottom-3 left-0 top-3 w-px bg-gray-300" />
      <div className="grid gap-3 rounded-lg border border-gray-200 bg-white p-3 md:grid-cols-[120px_1fr_auto] md:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400">Certificado</p>
          <p className="mt-0.5 text-xl font-extrabold tracking-tight text-cidet-navy">{cert.code}</p>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-bold text-gray-600">
              {cert.type}
            </span>
            <span className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-bold text-gray-500">
              {cert.status}
            </span>
            <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${s.chip}`}>{s.label}</span>
          </div>
          <p className="mt-2 text-sm font-bold text-gray-900">{cert.product}</p>
        </div>
        <div className="flex items-center gap-1.5 md:justify-self-end">
          <button
            onClick={() => navigate(`/procesos?certificate=${encodeURIComponent(cert.code)}&business=${encodeURIComponent(businessId)}`)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-cidet-navy px-3 text-[11px] font-bold text-white hover:bg-cidet-darker"
            aria-label={`Ver detalle del proceso ${cert.code}`}
          >
            Ver proceso
            <ArrowRight size={13} />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-cidet-cyan"
            aria-expanded={expanded}
            aria-label={expanded ? 'Contraer certificado' : 'Expandir certificado'}
          >
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>
      </div>

      {expanded && cert.activities.length > 0 && (
        <div className="mt-3 grid gap-2">
          <p className="text-[11px] font-bold uppercase text-gray-400">Actividades en ejecución</p>
          {cert.activities.map((a, index) => (
            <ActivityRow
              key={`${cert.code}-${a.title}`}
              activity={a}
              isLast={index === cert.activities.length - 1}
              businessId={businessId}
              certCode={cert.code}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ActivityRow({ activity, isLast }: { activity: Activity; isLast: boolean; businessId: string; certCode: string }) {
  const s = accionStyles[activity.accionEstado]
  const retraso = activity.diasRetraso ?? 0
  const retrasoText = retraso > 0
    ? `${retraso}d retrasada`
    : retraso < 0
      ? `${Math.abs(retraso)}d en plazo`
      : 'vence hoy'

  // Nivel 3 — Actividad. Layout horizontal original con tres columnas en
  // xl: [1fr_190px_170px]. Dot conectado por línea vertical (timeline).
  return (
    <div className="relative grid gap-3 rounded-lg border border-gray-100 bg-white p-3 pl-8 xl:grid-cols-[1fr_190px_170px] xl:items-center">
      <span className={`absolute left-3 top-4 h-2.5 w-2.5 rounded-full ${s.dot}`} />
      {!isLast && (
        <span className="absolute bottom-[-9px] left-[16.5px] top-7 w-px bg-gray-200" />
      )}
      <div>
        <div className="flex items-center gap-2">
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${s.chip}`}>{s.label}</span>
          <span className={`text-[11px] font-bold tabular-nums ${retraso > 0 ? 'text-status-expired' : 'text-gray-500'}`}>
            {retrasoText}
          </span>
        </div>
        <p className="mt-1 text-sm font-bold text-gray-950">{activity.title}</p>
        <p className="mt-1 text-xs font-semibold text-gray-500">Fecha objetivo: {activity.due}</p>
        {activity.bloqueoMotivo && (
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-status-expired">
            <AlertTriangle size={12} />
            {activity.bloqueoMotivo}
          </p>
        )}
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase text-gray-400">Responsable</p>
        <p className="mt-1 text-sm font-bold text-gray-900">{activity.owner}</p>
        <p className="text-xs text-gray-500">{activity.role}</p>
      </div>
      <div className="flex flex-wrap gap-2 xl:justify-end">
        <button className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-cidet-navy px-2.5 text-[11px] font-bold text-white hover:bg-cidet-darker">
          <Mail size={12} />
          Escribir
        </button>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] font-bold text-gray-700">
          <Phone size={12} />
          Llamar
        </button>
      </div>
    </div>
  )
}

function AlertaRow({ alerta, onAction }: { alerta: Alerta; onAction: () => void }) {
  const s = accionStyles[alerta.accionEstado]
  return (
    <article className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${s.chip}`}>
          {alertIcon(alerta.type)}
          {alerta.type}
        </span>
        <span className="text-[11px] font-bold text-gray-500">Cert. {alerta.certificate}</span>
      </div>
      <p className="mt-3 text-sm font-bold leading-5 text-gray-950">{alerta.title}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-gray-500 tabular-nums">{alerta.due}</span>
        <button
          onClick={onAction}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-cidet-navy px-3 text-[11px] font-bold text-white hover:bg-cidet-darker"
        >
          {alerta.action}
          <ArrowRight size={12} />
        </button>
      </div>
    </article>
  )
}

function routeFor(alerta: Alerta): string {
  if (alerta.route === 'contacto')    return `/contacto?certificate=${alerta.certificate}&reason=${encodeURIComponent(alerta.title)}`
  if (alerta.route === 'documentos')  return '/documentos'
  if (alerta.route === 'certificados') return `/certificados?certificate=${alerta.certificate}`
  return `/preoferta?certificate=${alerta.certificate}&reason=${encodeURIComponent(alerta.title)}`
}

// ─── Ruta "/" ─────────────────────────────────────────────────────────────
//
// Una sola vista, sin switch por mode. ProcesosView decide internamente qué
// data mostrar a partir de `viewAsClient` (admin sin cliente ve toda la
// cartera; admin con cliente ve la del cliente; cliente regular ve la
// suya). Mismo patrón que CertificadosPage. El Portafolio CIDET vive ahora
// en `/portafolio` (PortafolioPage.tsx).

export function ResumenPage() {
  return <ProcesosView />
}
