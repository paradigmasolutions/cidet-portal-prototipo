import { cn, formatDate } from '../../lib/utils'
import { StatusBadge } from '../../components/ui/Badge'
import { Building2, Calendar, FileText, Globe, Hash } from 'lucide-react'
import { certificateDetail } from '../../data/mockData'
import type { Certificate } from '../../types/certificate'

function InfoField({ label, value, icon: Icon }: {
  label: string
  value: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-gray-50 last:border-0">
      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
        <Icon size={14} className="text-gray-400" />
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-900 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export function TabInfo({ certificate }: { certificate: Certificate }) {
  const detail = certificateDetail

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-gray-900">Certificado {certificate.numero}</h2>
            <StatusBadge status={certificate.estado} />
          </div>
          <p className="text-gray-500 text-sm">{certificate.denominacion} &middot; Esquema {certificate.esquema}</p>
        </div>
        <div className={cn(
          "text-right px-5 py-3 rounded-2xl",
          certificate.diasRestantes < 0 ? "bg-red-50" :
          certificate.diasRestantes < 30 ? "bg-amber-50" : "bg-emerald-50"
        )}>
          <p className="text-[11px] text-gray-500 font-medium">Días restantes</p>
          <p className={cn(
            "text-3xl font-bold tabular-nums",
            certificate.diasRestantes < 0 ? "text-red-600" :
            certificate.diasRestantes < 30 ? "text-amber-600" : "text-emerald-600"
          )}>
            {certificate.diasRestantes}
          </p>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid sm:grid-cols-2 gap-x-10">
        <InfoField label="Empresa" value={certificate.empresa} icon={Building2} />
        <InfoField label="Certificador" value={certificate.certificador} icon={FileText} />
        <InfoField label="Esquema" value={String(certificate.esquema)} icon={Hash} />
        <InfoField label="Norma" value={detail.norma || '—'} icon={FileText} />
        <InfoField label="Fecha Otorgamiento" value={formatDate(certificate.fechaOtorgamiento)} icon={Calendar} />
        <InfoField label="Fecha Vencimiento" value={formatDate(certificate.fechaVencimiento)} icon={Calendar} />
        {detail.fechaSeguimiento1 && (
          <InfoField label="Seguimiento 1" value={formatDate(detail.fechaSeguimiento1)} icon={Calendar} />
        )}
        {detail.fechaSeguimiento2 && (
          <InfoField label="Seguimiento 2" value={formatDate(detail.fechaSeguimiento2)} icon={Calendar} />
        )}
      </div>

      {/* Fabricantes */}
      <div>
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Fabricantes</p>
        <div className="flex flex-wrap gap-2">
          {detail.fabricantes.map((fab) => (
            <span key={fab} className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-xl text-xs text-gray-700 font-medium border border-gray-100">
              <Globe size={12} className="text-gray-400" />
              {fab}
            </span>
          ))}
        </div>
      </div>

      {/* Observaciones */}
      {certificate.observaciones && (
        <div className="bg-amber-50 border border-amber-200/50 rounded-xl p-4">
          <p className="text-[11px] text-amber-600 font-semibold uppercase tracking-wider mb-1">Observaciones</p>
          <p className="text-sm text-amber-800">{certificate.observaciones}</p>
        </div>
      )}
    </div>
  )
}
