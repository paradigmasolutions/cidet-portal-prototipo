import { cn } from '../../lib/utils'
import { TrendingDown, AlertTriangle, ShieldCheck, BarChart3 } from 'lucide-react'

// Identificador del filtro que dispara cada card. Se mapea 1:1 a estados
// del modelo CIDET: 'danger' agrupa Vencido + Suspendido (los dos viajan
// juntos porque ambos significan "acción inmediata"), 'warning' es
// Por vencer, 'success' es Vigente. El filtro 'all' representa el reset.
export type KpiFilter = 'all' | 'danger' | 'warning' | 'success'

interface KpiCardProps {
  title: string
  value: number | string
  hint?: string
  variant: 'danger' | 'warning' | 'success' | 'info'
  icon?: React.ReactNode
  // Cuando `selectable` está en true la card se vuelve un toggle visual:
  // al seleccionarse refuerza el borde y baja el resto de las cards en el
  // grid (gestionado por el grid via `selected`).
  selectable?: boolean
  selected?: boolean
  dimmed?: boolean
  onClick?: () => void
}

const variantStyles = {
  danger: {
    accent: 'border-l-status-expired',
    iconBg: 'bg-red-50',
    iconColor: 'text-status-expired',
    chip: 'bg-red-50 text-status-expired',
    ring: 'ring-status-expired/40',
  },
  warning: {
    accent: 'border-l-status-expiring',
    iconBg: 'bg-amber-50',
    iconColor: 'text-status-expiring',
    chip: 'bg-amber-50 text-status-expiring',
    ring: 'ring-status-expiring/40',
  },
  success: {
    accent: 'border-l-status-valid',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-status-valid',
    chip: 'bg-emerald-50 text-status-valid',
    ring: 'ring-status-valid/40',
  },
  info: {
    accent: 'border-l-cidet-cyan',
    iconBg: 'bg-cidet-cyan-light',
    iconColor: 'text-cidet-navy',
    chip: 'bg-cidet-cyan-light text-cidet-cyan-dark',
    ring: 'ring-cidet-cyan/40',
  },
}

function KpiCard({ title, value, hint, variant, icon, selectable, selected, dimmed, onClick }: KpiCardProps) {
  const styles = variantStyles[variant]

  const body = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{title}</p>
        <p className="mt-2 text-4xl font-extrabold tracking-tight text-gray-950">
          {value}
        </p>
        {hint && (
          <span className={cn('mt-3 inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold', styles.chip)}>
            {hint}
          </span>
        )}
      </div>
      <div className={cn('grid h-10 w-10 place-items-center rounded-lg', styles.iconBg)}>
        <span className={styles.iconColor}>{icon}</span>
      </div>
    </div>
  )

  const baseClasses = cn(
    'rounded-lg border border-gray-100 border-l-4 bg-white p-5 shadow-sm transition-all',
    styles.accent,
    selectable && 'cursor-pointer hover:shadow-md text-left w-full',
    selected && cn('ring-2 ring-offset-1', styles.ring),
    dimmed && 'opacity-50',
  )

  if (selectable) {
    return (
      <button type="button" onClick={onClick} aria-pressed={selected} className={baseClasses}>
        {body}
      </button>
    )
  }
  return <div className={baseClasses}>{body}</div>
}

interface Stats {
  vencidos: number
  suspendidos: number
  porVencer: number
  vigentes: number
  total: number
}

interface KpiCardGridProps {
  stats: Stats
  // Cuando se pasa `onSelectFilter` las cards se vuelven filtros toggle.
  // El consumidor controla qué está activo y reacciona al click. Sin la
  // prop el grid se renderiza como mero indicador (uso en Inicio).
  selectedFilter?: KpiFilter
  onSelectFilter?: (filter: KpiFilter) => void
}

export function KpiCardGrid({ stats, selectedFilter, onSelectFilter }: KpiCardGridProps) {
  const danger = stats.vencidos + stats.suspendidos
  const pctVigentes = stats.total > 0 ? Math.round((stats.vigentes / stats.total) * 100) : 0
  const selectable = !!onSelectFilter

  // Toggle: si la card ya está seleccionada, otro click vuelve a 'all'.
  const toggle = (next: KpiFilter) => () => {
    if (!onSelectFilter) return
    onSelectFilter(selectedFilter === next ? 'all' : next)
  }

  const isSelected = (f: KpiFilter) => selectable && selectedFilter === f
  // Card "Total" representa el reset → se considera "seleccionada" cuando
  // no hay otro filtro activo, para que el usuario vea siempre dónde está.
  const isTotalSelected = selectable && (!selectedFilter || selectedFilter === 'all')
  const someFilterActive = selectable && !!selectedFilter && selectedFilter !== 'all'

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        title="Vencidos / Suspendidos"
        value={danger}
        hint="Atención inmediata"
        variant="danger"
        icon={<TrendingDown size={20} />}
        selectable={selectable}
        selected={isSelected('danger')}
        dimmed={someFilterActive && !isSelected('danger')}
        onClick={toggle('danger')}
      />
      <KpiCard
        title="Por vencer"
        value={stats.porVencer}
        hint="Próximos 60 días"
        variant="warning"
        icon={<AlertTriangle size={20} />}
        selectable={selectable}
        selected={isSelected('warning')}
        dimmed={someFilterActive && !isSelected('warning')}
        onClick={toggle('warning')}
      />
      <KpiCard
        title="Vigentes"
        value={stats.vigentes}
        hint={`${pctVigentes}% del portafolio`}
        variant="success"
        icon={<ShieldCheck size={20} />}
        selectable={selectable}
        selected={isSelected('success')}
        dimmed={someFilterActive && !isSelected('success')}
        onClick={toggle('success')}
      />
      <KpiCard
        title="Total certificados"
        value={stats.total}
        hint={someFilterActive ? 'Quitar filtro' : 'Activos en el portal'}
        variant="info"
        icon={<BarChart3 size={20} />}
        selectable={selectable}
        selected={isTotalSelected}
        onClick={toggle('all')}
      />
    </div>
  )
}
