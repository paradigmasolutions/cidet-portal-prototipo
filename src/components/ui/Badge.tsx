import { cn } from '../../lib/utils'
import type { CertificateStatus } from '../../types/certificate'

const variants: Record<CertificateStatus, string> = {
  vencido: 'bg-white text-status-expired ring-status-expired/25',
  suspendido: 'bg-white text-status-suspended ring-status-suspended/25',
  por_vencer: 'bg-white text-status-expiring ring-status-expiring/25',
  vigente: 'bg-white text-status-valid ring-status-valid/25',
}

const labels: Record<CertificateStatus, string> = {
  vencido: 'Vencido',
  suspendido: 'Suspendido',
  por_vencer: 'Por vencer',
  vigente: 'Vigente',
}

export function StatusBadge({ status }: { status: CertificateStatus }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset",
      variants[status]
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === 'vigente' ? 'bg-status-valid' :
        status === 'por_vencer' ? 'bg-status-expiring' :
        status === 'suspendido' ? 'bg-status-suspended' : 'bg-status-expired'
      )} />
      {labels[status]}
    </span>
  )
}
