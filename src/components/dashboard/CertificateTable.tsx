import { cn, formatDate } from '../../lib/utils'
import { StatusBadge } from '../ui/Badge'
import { ChevronRight, Info } from 'lucide-react'
import type { Certificate } from '../../types/certificate'

interface CertificateTableProps {
  certificates: Certificate[]
  onSelect?: (cert: Certificate) => void
  selectedId?: string
}

export function CertificateTable({ certificates, onSelect, selectedId }: CertificateTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Certificado</th>
            <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
            <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Producto / referencia</th>
            <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Esquema</th>
            <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Proxima auditoria</th>
            <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Días</th>
            <th className="px-5 py-3.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {certificates.map((cert) => (
            <tr
              key={cert.id}
              onClick={() => onSelect?.(cert)}
              className={cn(
                "cursor-pointer group",
                selectedId === cert.id
                  ? "bg-cidet-cyan-light"
                  : "hover:bg-gray-50/80"
              )}
            >
              <td className="px-5 py-4">
                <div>
                  <span className="font-bold text-cidet-blue">{cert.numero}</span>
                  <p className="mt-1 text-xs text-gray-400">{cert.empresa}</p>
                </div>
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={cert.estado} />
              </td>
              <td className="px-5 py-4 text-gray-700">
                <p className="font-semibold text-gray-900">{cert.producto}</p>
                <p className="mt-1 text-xs text-gray-400">{cert.referencias.slice(0, 2).join(' / ')}</p>
              </td>
              <td className="px-5 py-4 text-gray-600">
                <span className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-bold text-gray-600">
                  <Info size={12} />
                  {cert.esquema}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-600">
                {cert.fechaProximaAuditoria ? formatDate(cert.fechaProximaAuditoria) : 'No aplica'}
              </td>
              <td className="px-5 py-4">
                <span className={cn(
                  "font-semibold tabular-nums",
                  cert.diasRestantes < 0 ? "text-red-600" :
                  cert.diasRestantes < 30 ? "text-amber-600" : "text-emerald-600"
                )}>
                  {cert.diasRestantes > 0 ? `${cert.diasRestantes}d` : `${Math.abs(cert.diasRestantes)}d vencido`}
                </span>
              </td>
              <td className="px-5 py-4">
                <ChevronRight size={16} className="text-gray-300 group-hover:text-cidet-cyan transition-colors" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
