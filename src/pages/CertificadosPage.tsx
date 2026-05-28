import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle, ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, ChevronDown,
  ChevronLeft, ChevronRight, ChevronUp, Download, Eye, FileSearch, FileText,
  LayoutGrid, MapPin, Search, ShieldCheck, Table as TableIcon, Users, X,
} from 'lucide-react'
import { cn, formatDate } from '../lib/utils'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/Badge'
import { KpiCardGrid } from '../components/dashboard/KpiCard'
import type { KpiFilter } from '../components/dashboard/KpiCard'
import { certificates, summaryStats } from '../data/mockData'
import type { Certificate, CertificateStatus } from '../types/certificate'
import { useI18n } from '../i18n'

// Un certificado emitido es un descargable con metadata. La vista de detalle
// es un panel lateral flotante (tipo SharePoint info panel) que aparece al
// hacer click en una fila/archivo — todo lo relacionado con procesos en
// curso (gantt, contactos, etapas) vive en la sección de procesos.

type ViewMode = 'tabla' | 'archivo'

type SortField = 'numero' | 'empresa' | 'denominacion' | 'plantaPrincipal' | 'comercialCidet' | 'fechaVencimiento'
type SortDir = 'asc' | 'desc'
interface Sort { field: SortField; dir: SortDir }

const PAGE_SIZE_OPTIONS = [12, 24, 50, 100] as const
const GROUP_CAP = 8

function matchesFilter(status: CertificateStatus, filter: KpiFilter): boolean {
  if (filter === 'all')     return true
  if (filter === 'danger')  return status === 'vencido' || status === 'suspendido'
  if (filter === 'warning') return status === 'por_vencer'
  if (filter === 'success') return status === 'vigente'
  return true
}

function listEsquemas(items: Certificate[]): string[] {
  const set = new Set(items.map((c) => c.esquema))
  return Array.from(set).sort()
}

const groupOrder: { status: CertificateStatus; label: string; helper: string; tone: string; kpiFilter: KpiFilter }[] = [
  { status: 'vencido',    label: 'Vencidos',    helper: 'Sin cobertura vigente',       tone: 'text-status-expired',  kpiFilter: 'danger' },
  { status: 'suspendido', label: 'Suspendidos', helper: 'Sin uso comercial permitido', tone: 'text-status-expired',  kpiFilter: 'danger' },
  { status: 'por_vencer', label: 'Por vencer',  helper: 'Próximos 60 días',            tone: 'text-status-expiring', kpiFilter: 'warning' },
  { status: 'vigente',    label: 'Vigentes',    helper: 'Activos sin alerta',          tone: 'text-status-valid',    kpiFilter: 'success' },
]

function compareCerts(a: Certificate, b: Certificate, sort: Sort): number {
  const dir = sort.dir === 'asc' ? 1 : -1
  if (sort.field === 'fechaVencimiento') {
    return dir * (a.fechaVencimiento.localeCompare(b.fechaVencimiento))
  }
  const av = String(a[sort.field] ?? '').toLowerCase()
  const bv = String(b[sort.field] ?? '').toLowerCase()
  return dir * av.localeCompare(bv)
}

// Universo de certs filtrado por contexto del usuario:
//   - admin global         → todo el catálogo
//   - admin con cliente    → certs cuya razón social matchea el seleccionado
//   - cliente grande       → certs de SIGNIFY (cliente del demo)
//   - cliente pequeño      → certs de ILUMINACIONES ANDINAS
// Cuando el cliente está fijo el filtro evita inconsistencias visuales
// (Felipe, 2026-05-28): mostrarle plantas de ABB al usuario de Signify rompe
// la mental model aunque sea un mock.
function resolveUniverse(mode: string, viewAsLegalName: string | null): Certificate[] {
  if (mode === 'internal' && !viewAsLegalName) return certificates
  const target = viewAsLegalName ?? (
    mode === 'small_client' ? 'ILUMINACIONES ANDINAS S.A.S' : 'SIGNIFY COLOMBIANA S.A.S'
  )
  const key = target.split(' ')[0].toLowerCase()
  return certificates.filter((c) => c.empresa.toLowerCase().includes(key))
}

// ─── Página principal ────────────────────────────────────────────────────────

export function CertificadosPage() {
  const { mode, viewAsClient } = useI18n()
  const isAdminView = mode === 'internal' && !viewAsClient

  const [filter, setFilter] = useState<KpiFilter>('all')
  const [query, setQuery] = useState('')
  const [esquema, setEsquema] = useState<string>('todos')
  const [view, setView] = useState<ViewMode>('tabla')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0])
  const [sort, setSort] = useState<Sort | null>(null)
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  useEffect(() => { setSelectedCert(null) }, [viewAsClient])

  const universe = useMemo(
    () => resolveUniverse(mode, viewAsClient?.legalName ?? null),
    [mode, viewAsClient],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const out = universe.filter((c) => {
      if (!matchesFilter(c.estado, filter)) return false
      if (esquema !== 'todos' && c.esquema !== esquema) return false
      if (q.length > 0) {
        const hay = [
          c.numero, c.empresa, c.denominacion, c.producto, c.familia,
          ...(c.referencias ?? []), c.plantaPrincipal, c.comercialCidet,
        ].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    if (sort) out.sort((a, b) => compareCerts(a, b, sort))
    return out
  }, [universe, filter, query, esquema, sort])

  const localStats = useMemo(() => {
    if (mode === 'internal' && !viewAsClient) return summaryStats
    return {
      vencidos:    universe.filter((c) => c.estado === 'vencido').length,
      suspendidos: universe.filter((c) => c.estado === 'suspendido').length,
      porVencer:   universe.filter((c) => c.estado === 'por_vencer').length,
      vigentes:    universe.filter((c) => c.estado === 'vigente').length,
      total:       universe.length,
    }
  }, [universe, mode, viewAsClient])

  const groupedMode = filter === 'all'

  const groups = useMemo(() => {
    if (!groupedMode) return []
    return groupOrder
      .map((g) => ({ ...g, items: filtered.filter((c) => c.estado === g.status) }))
      .filter((g) => g.items.length > 0)
  }, [filtered, groupedMode])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  )

  const onFilterChange = (next: KpiFilter) => {
    setFilter(next)
    setPage(1)
  }

  const onToggleSort = (field: SortField) => {
    setSort((prev) => {
      if (!prev || prev.field !== field) return { field, dir: 'asc' }
      if (prev.dir === 'asc') return { field, dir: 'desc' }
      return null
    })
  }

  const onPageSizeChange = (n: number) => {
    setPageSize(n)
    setPage(1)
  }

  const headerContext = isAdminView
    ? 'Portafolio CIDET'
    : viewAsClient
      ? viewAsClient.legalName
      : 'Tu organización'

  return (
    <>
      <PageHeader title="Certificados" compact>
        <div className="text-right">
          {viewAsClient && (
            <p className="text-[11px] font-bold uppercase tracking-wide text-cidet-cyan-dark">
              Viendo como
            </p>
          )}
          <p className="text-sm font-bold text-gray-700">{headerContext}</p>
          <p className="text-[11px] font-semibold text-gray-500">
            Última actualización: 24 feb 2026, 06:00 AM
          </p>
        </div>
      </PageHeader>

      <div className="mb-5">
        <KpiCardGrid stats={localStats} selectedFilter={filter} onSelectFilter={onFilterChange} />
      </div>

      <FiltersBar
        query={query}
        onQueryChange={(v) => { setQuery(v); setPage(1) }}
        esquema={esquema}
        onEsquemaChange={(v) => { setEsquema(v); setPage(1) }}
        esquemas={listEsquemas(universe)}
        view={view}
        onViewChange={setView}
        adminPlaceholder={isAdminView}
      />

      {filtered.length === 0 ? (
        <EmptyState />
      ) : groupedMode ? (
        <div className="space-y-4">
          {groups.map((g) => (
            <GroupSection
              key={g.status}
              status={g.status}
              label={g.label}
              helper={g.helper}
              tone={g.tone}
              count={g.items.length}
              items={g.items}
              view={view}
              showEmpresa={isAdminView}
              sort={sort}
              onToggleSort={onToggleSort}
              onSelectRow={setSelectedCert}
              selectedId={selectedCert?.id}
              onOverflow={() => onFilterChange(g.kpiFilter)}
            />
          ))}
        </div>
      ) : (
        <>
          <ResultsHeader
            count={filtered.length}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
          {view === 'tabla' ? (
            <CertTable
              items={paged}
              showEmpresa={isAdminView}
              sort={sort}
              onToggleSort={onToggleSort}
              onSelectRow={setSelectedCert}
              selectedId={selectedCert?.id}
            />
          ) : (
            <CertFileList
              items={paged}
              showEmpresa={isAdminView}
              onSelectRow={setSelectedCert}
              selectedId={selectedCert?.id}
            />
          )}
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </>
      )}

      <CertDetailPanel cert={selectedCert} onClose={() => setSelectedCert(null)} />
    </>
  )
}

// ─── FiltersBar ──────────────────────────────────────────────────────────────

interface FiltersBarProps {
  query: string
  onQueryChange: (v: string) => void
  esquema: string
  onEsquemaChange: (v: string) => void
  esquemas: string[]
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  adminPlaceholder: boolean
}

function FiltersBar({
  query, onQueryChange, esquema, onEsquemaChange, esquemas, view, onViewChange, adminPlaceholder,
}: FiltersBarProps) {
  return (
    <div className="mb-5 grid gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
      <label className="relative">
        <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm outline-none focus:border-cidet-cyan focus:bg-white"
          placeholder={adminPlaceholder
            ? 'Empresa, certificado, producto, referencia, planta o comercial'
            : 'Certificado, producto, referencia, planta o comercial'}
        />
      </label>
      <select
        value={esquema}
        onChange={(e) => onEsquemaChange(e.target.value)}
        className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-700 outline-none focus:border-cidet-cyan"
      >
        <option value="todos">Todos los esquemas</option>
        {esquemas.map((es) => <option key={es} value={es}>{es}</option>)}
      </select>
      <div className="flex h-11 items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          onClick={() => onViewChange('tabla')}
          className={cn(
            'inline-flex h-full items-center gap-1.5 rounded-md px-3 text-xs font-bold transition-colors',
            view === 'tabla' ? 'bg-white text-cidet-navy shadow-sm' : 'text-gray-500 hover:text-gray-700',
          )}
          aria-pressed={view === 'tabla'}
        >
          <TableIcon size={14} /> Tabla
        </button>
        <button
          onClick={() => onViewChange('archivo')}
          className={cn(
            'inline-flex h-full items-center gap-1.5 rounded-md px-3 text-xs font-bold transition-colors',
            view === 'archivo' ? 'bg-white text-cidet-navy shadow-sm' : 'text-gray-500 hover:text-gray-700',
          )}
          aria-pressed={view === 'archivo'}
        >
          <LayoutGrid size={14} /> Archivo
        </button>
      </div>
    </div>
  )
}

// ─── Sort header reutilizable ────────────────────────────────────────────────

function SortHeader({ field, label, sort, onToggleSort }: {
  field: SortField; label: string; sort: Sort | null; onToggleSort: (f: SortField) => void
}) {
  const active = sort?.field === field
  return (
    <button
      type="button"
      onClick={() => onToggleSort(field)}
      className={cn(
        'flex w-full items-center gap-1 text-[11px] font-bold uppercase tracking-wide',
        active ? 'text-cidet-navy' : 'text-gray-500 hover:text-gray-700',
      )}
    >
      {label}
      {active
        ? (sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)
        : <ArrowUpDown size={11} className="opacity-40" />}
    </button>
  )
}

// ─── ListProps compartido ────────────────────────────────────────────────────

interface ListProps {
  items: Certificate[]
  showEmpresa: boolean
  onSelectRow: (c: Certificate) => void
  selectedId?: string
}

interface SortableListProps extends ListProps {
  sort: Sort | null
  onToggleSort: (f: SortField) => void
}

// ─── Vista TABLA — densa, tabular, columnas claras ───────────────────────────

function CertTable({ items, showEmpresa, sort, onToggleSort, onSelectRow, selectedId }: SortableListProps) {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-gray-500">Estado</th>
              <th className="px-4 py-3 text-left"><SortHeader field="numero"           label="Cert. N.°"               sort={sort} onToggleSort={onToggleSort} /></th>
              {showEmpresa && (
                <th className="px-4 py-3 text-left"><SortHeader field="empresa"        label="Empresa"                 sort={sort} onToggleSort={onToggleSort} /></th>
              )}
              <th className="px-4 py-3 text-left"><SortHeader field="denominacion"     label="Denominación · Producto" sort={sort} onToggleSort={onToggleSort} /></th>
              <th className="px-4 py-3 text-left"><SortHeader field="plantaPrincipal"  label="Planta principal"        sort={sort} onToggleSort={onToggleSort} /></th>
              <th className="px-4 py-3 text-left"><SortHeader field="comercialCidet"   label="Comercial CIDET"         sort={sort} onToggleSort={onToggleSort} /></th>
              <th className="px-4 py-3 text-left"><SortHeader field="fechaVencimiento" label="Vencimiento"             sort={sort} onToggleSort={onToggleSort} /></th>
              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr
                key={c.id}
                onClick={() => onSelectRow(c)}
                className={cn(
                  'cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50/60',
                  c.id === selectedId && 'bg-cidet-cyan/5',
                )}
              >
                <td className="px-4 py-2.5"><StatusBadge status={c.estado} /></td>
                <td className="px-4 py-2.5 font-bold text-cidet-navy">{c.numero}</td>
                {showEmpresa && (
                  <td className="px-4 py-2.5 text-gray-700">
                    <p className="truncate font-semibold">{c.empresa}</p>
                  </td>
                )}
                <td className="px-4 py-2.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{c.denominacion}</p>
                  <p className="mt-0.5 truncate font-semibold text-gray-900">{c.producto}</p>
                </td>
                <td className="px-4 py-2.5"><p className="truncate text-gray-700">{c.plantaPrincipal}</p></td>
                <td className="px-4 py-2.5 text-gray-700">{c.comercialCidet}</td>
                <td className="px-4 py-2.5 tabular-nums text-gray-700">{formatDate(c.fechaVencimiento)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/certificados/${encodeURIComponent(c.numero)}`) }}
                      title={`Ver detalle del certificado ${c.numero}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:border-cidet-cyan hover:text-cidet-navy"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation() /* TODO: trigger PDF download */ }}
                      title={`Descargar PDF del certificado ${c.numero}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:border-cidet-cyan hover:text-cidet-navy"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Vista ARCHIVO — tiles visuales tipo SharePoint doc library ──────────────
//
// Distinta de la tabla: cada item es una tile densa con thumbnail PDF rojo,
// jerarquía visual cert→denominación→producto, badges de estado y esquema,
// metadata en columnas a la derecha. No es lista tabular; respira más.
// Pensada para escanear visualmente y arrastrar la mirada por bloques.

function CertFileList({ items, showEmpresa, onSelectRow, selectedId }: ListProps) {
  const navigate = useNavigate()
  return (
    <ul className="grid gap-2">
      {items.map((c) => (
        <li key={c.id}>
          <article
            onClick={() => onSelectRow(c)}
            className={cn(
              'cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:border-cidet-cyan/40 hover:shadow-md',
              c.id === selectedId ? 'border-cidet-cyan ring-2 ring-cidet-cyan/20' : 'border-gray-100',
            )}
          >
            <div className="grid items-center gap-4 lg:grid-cols-[64px_1fr_auto]">
              {/* Thumbnail PDF — diferencia visual clave vs tabla */}
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-red-50 text-status-expired">
                <FileText size={28} strokeWidth={1.6} />
                <span className="-mt-7 text-[9px] font-extrabold tracking-widest text-status-expired">PDF</span>
              </div>

              {/* Bloque principal */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-extrabold text-cidet-navy">Cert. {c.numero}</span>
                  <StatusBadge status={c.estado} />
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-600">
                    {c.denominacion}
                  </span>
                  <span className="rounded-md border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                    {c.esquema}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm font-bold text-gray-900">{c.producto}</p>
                {showEmpresa && (
                  <p className="mt-0.5 truncate text-[11px] font-bold uppercase tracking-wide text-gray-500">
                    {c.empresa}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
                  <span><span className="font-semibold text-gray-600">Planta:</span> {c.plantaPrincipal}</span>
                  <span><span className="font-semibold text-gray-600">Comercial:</span> {c.comercialCidet}</span>
                  <span className="tabular-nums"><span className="font-semibold text-gray-600">Vence:</span> {formatDate(c.fechaVencimiento)}</span>
                </div>
              </div>

              {/* Acciones — ver detalle + descargar. Click en el body de la
                  card sigue abriendo el side panel; estos no propagan. */}
              <div className="flex flex-col gap-1.5 self-start">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/certificados/${encodeURIComponent(c.numero)}`) }}
                  title={`Ver detalle del certificado ${c.numero}`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 hover:border-cidet-cyan hover:text-cidet-navy"
                >
                  <Eye size={13} />
                  Ver detalle
                </button>
                <button
                  onClick={(e) => { e.stopPropagation() /* TODO: trigger PDF download */ }}
                  title={`Descargar PDF del certificado ${c.numero}`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-cidet-navy px-3 text-xs font-bold text-white hover:bg-cidet-darker"
                >
                  <Download size={13} />
                  Descargar
                </button>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}

// ─── Group section (cuando filter === 'all') ─────────────────────────────────

interface GroupSectionProps extends SortableListProps {
  status: CertificateStatus
  label: string
  helper: string
  tone: string
  count: number
  view: ViewMode
  onOverflow: () => void
}

function GroupSection({
  status, label, helper, tone, count, items, view, showEmpresa,
  sort, onToggleSort, onSelectRow, selectedId, onOverflow,
}: GroupSectionProps) {
  const [expanded, setExpanded] = useState<boolean>(status !== 'vigente')
  const overflow = count > GROUP_CAP
  const visible = expanded && overflow ? items.slice(0, GROUP_CAP) : items

  return (
    <section className="rounded-lg border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50/60"
        aria-expanded={expanded}
      >
        <span className={cn('grid h-7 w-7 place-items-center rounded-md bg-gray-50', tone)}>
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </span>
        <h2 className={cn('text-base font-extrabold', tone)}>{label}</h2>
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600">{count}</span>
        <p className="text-xs font-semibold text-gray-500">{helper}</p>
      </button>
      {expanded && (
        <div className="border-t border-gray-100">
          <div className="p-3">
            {view === 'tabla' ? (
              <CertTable
                items={visible} showEmpresa={showEmpresa} sort={sort}
                onToggleSort={onToggleSort} onSelectRow={onSelectRow} selectedId={selectedId}
              />
            ) : (
              <CertFileList
                items={visible} showEmpresa={showEmpresa}
                onSelectRow={onSelectRow} selectedId={selectedId}
              />
            )}
          </div>
          {overflow && (
            <button
              type="button"
              onClick={onOverflow}
              className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 bg-gray-50/60 px-4 py-2.5 text-xs font-bold text-cidet-navy transition-colors hover:bg-gray-50"
            >
              Ver los {count} {label.toLowerCase()}
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}
    </section>
  )
}

// ─── Header del listado plano + selector tamaño página ───────────────────────

function ResultsHeader({
  count, page, totalPages, pageSize, onPageSizeChange,
}: { count: number; page: number; totalPages: number; pageSize: number; onPageSizeChange: (n: number) => void }) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
      <p className="text-xs font-bold text-gray-600">
        {count} certificado{count === 1 ? '' : 's'}
      </p>
      <div className="flex items-center gap-3 text-xs">
        <label className="flex items-center gap-2 font-semibold text-gray-500">
          Por página
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700 outline-none focus:border-cidet-cyan"
          >
            {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <span className="font-semibold text-gray-500">Página {page} de {totalPages}</span>
      </div>
    </div>
  )
}

// ─── Pagination con elipsis para escalabilidad real ─────────────────────────

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  // Algoritmo estándar: primeras 2, vecinas a current, últimas 2. Elipsis
  // cuando hay un salto > 1 entre rangos. Soporta totales arbitrarios sin
  // explotar visualmente.
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | 'ellipsis')[] = []
  const push = (n: number) => { if (!out.includes(n)) out.push(n) }
  push(1)
  if (current > 4) out.push('ellipsis')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) push(i)
  if (current < total - 3) out.push('ellipsis')
  push(total)
  return out
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  const pages = getPageNumbers(page, totalPages)
  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 hover:border-cidet-cyan disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={14} />
        Anterior
      </button>
      {pages.map((p, idx) => p === 'ellipsis' ? (
        <span key={`e-${idx}`} className="px-1 text-xs font-bold text-gray-400">…</span>
      ) : (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-md border text-xs font-bold',
            p === page
              ? 'border-cidet-cyan bg-cidet-cyan-light text-cidet-navy'
              : 'border-gray-200 bg-white text-gray-700 hover:border-cidet-cyan',
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 hover:border-cidet-cyan disabled:cursor-not-allowed disabled:opacity-50"
      >
        Siguiente
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

// ─── Side panel de detalle (SharePoint-like info panel, con respiración) ─────

function CertDetailPanel({ cert, onClose }: { cert: Certificate | null; onClose: () => void }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!cert) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [cert, onClose])

  if (!cert) return null

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-30 bg-gray-900/10" aria-hidden />
      <aside
        className="fixed bottom-0 right-0 top-0 z-40 flex w-full max-w-[440px] flex-col border-l border-gray-200 bg-white shadow-2xl"
        role="dialog"
        aria-label={`Detalle del certificado ${cert.numero}`}
      >
        {/* Header con generoso padding */}
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Cert. N.°</p>
              <StatusBadge status={cert.estado} />
            </div>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-cidet-navy">{cert.numero}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              {cert.denominacion}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-700">{cert.producto}</p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
            aria-label="Cerrar detalle"
          >
            <X size={15} />
          </button>
        </header>

        {/* Contenido scrolleable con separación generosa entre secciones */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          <PanelSection title="Empresa" icon={<Users size={14} />}>
            <p className="text-sm font-bold text-gray-900">{cert.empresa}</p>
            <p className="mt-2 text-xs text-gray-500">
              Comercial CIDET <span className="ml-2 font-semibold text-gray-800">{cert.comercialCidet}</span>
            </p>
          </PanelSection>

          <PanelSection title="Tiempos" icon={<ShieldCheck size={14} />}>
            <dl className="grid grid-cols-2 gap-y-3 text-xs">
              <dt className="font-semibold text-gray-500">Otorgamiento</dt>
              <dd className="text-right font-semibold tabular-nums text-gray-800">{formatDate(cert.fechaOtorgamiento)}</dd>
              <dt className="font-semibold text-gray-500">Próxima auditoría</dt>
              <dd className="text-right font-semibold tabular-nums text-gray-800">
                {cert.fechaProximaAuditoria ? formatDate(cert.fechaProximaAuditoria) : 'No aplica'}
              </dd>
              <dt className="font-semibold text-gray-500">Vencimiento</dt>
              <dd className="text-right font-semibold tabular-nums text-gray-800">{formatDate(cert.fechaVencimiento)}</dd>
              {cert.fechaSuspension && (
                <>
                  <dt className="font-semibold text-status-expired">Suspendido desde</dt>
                  <dd className="text-right font-semibold tabular-nums text-status-expired">{formatDate(cert.fechaSuspension)}</dd>
                </>
              )}
            </dl>
          </PanelSection>

          <PanelSection title="Plantas de fabricación" icon={<MapPin size={14} />}>
            {/* En el mock sólo viene la planta principal — cuando enchufemos
                producción aquí se listan todas las plantas asociadas con país
                y vencimiento de ISO. */}
            <p className="text-sm font-semibold text-gray-900">{cert.plantaPrincipal}</p>
          </PanelSection>

          <PanelSection title="Productos incluidos" icon={<FileText size={14} />}>
            <p className="text-sm font-semibold text-gray-900">{cert.producto}</p>
            <p className="mt-1 text-[11px] text-gray-500">Familia · {cert.familia}</p>
            {cert.referencias.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cert.referencias.map((r) => (
                  <span key={r} className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-bold text-gray-700">
                    {r}
                  </span>
                ))}
              </div>
            )}
          </PanelSection>

          <PanelSection title="Marco regulatorio" icon={<ShieldCheck size={14} />}>
            <p className="text-xs font-semibold text-gray-800">{cert.esquema}</p>
            {cert.normas.length > 0 && (
              <ul className="mt-2 list-inside list-disc text-[11px] leading-relaxed text-gray-500">
                {cert.normas.map((n) => <li key={n}>{n}</li>)}
              </ul>
            )}
          </PanelSection>

          {cert.observaciones && (
            <PanelSection title="Observaciones" icon={<AlertTriangle size={14} />}>
              <p className="text-xs leading-relaxed text-gray-700">{cert.observaciones}</p>
            </PanelSection>
          )}
        </div>

        {/* Footer: ver detalle completo (página dedicada con pestañas) +
            descarga PDF. El side panel sigue siendo el resumen rápido. */}
        <footer className="space-y-2 border-t border-gray-100 px-6 py-4">
          <button
            onClick={() => { navigate(`/certificados/${encodeURIComponent(cert.numero)}`); onClose() }}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:border-cidet-cyan hover:text-cidet-navy"
          >
            <Eye size={14} />
            Ver detalle completo
          </button>
          <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-cidet-navy text-sm font-bold text-white hover:bg-cidet-darker">
            <Download size={15} />
            Descargar PDF
          </button>
        </footer>
      </aside>
    </>
  )
}

function PanelSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{title}</h3>
      </div>
      {children}
    </section>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white p-12 text-center">
      <FileSearch size={28} className="text-gray-300" />
      <p className="mt-3 text-sm font-bold text-gray-700">Sin certificados que coincidan</p>
      <p className="mt-1 max-w-md text-xs text-gray-500">
        Ajusta el estado en los indicadores, limpia la búsqueda o cambia el esquema.
      </p>
    </div>
  )
}
