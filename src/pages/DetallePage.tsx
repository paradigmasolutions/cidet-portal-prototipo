import { useState } from 'react'
import { cn, formatDate } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/Badge'
import {
  Building2, Calendar, FileText, FlaskConical, Globe, MapPin,
  ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react'
import { certificates, certificateDetail } from '../data/mockData'
import type { Certificate } from '../types/certificate'

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {Icon && (
        <div className="p-1.5 bg-gray-50 rounded-lg shrink-0 mt-0.5">
          <Icon size={14} className="text-gray-400" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-900 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export function DetallePage() {
  const [selectedCert, setSelectedCert] = useState<Certificate>(certificates[0])
  const [ensayosOpen, setEnsayosOpen] = useState(true)

  const detail = certificateDetail

  return (
    <>
      <PageHeader
        title="Detalle de Certificado"
        description="Información completa del certificado seleccionado"
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar: Certificate selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Seleccionar certificado
          </p>
          {certificates.map((cert) => (
            <button
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className={cn(
                "w-full text-left rounded-xl p-4 border transition-all",
                selectedCert.id === cert.id
                  ? "bg-cidet-cyan/5 border-cidet-cyan/30 shadow-sm"
                  : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">{cert.numero}</span>
                <StatusBadge status={cert.estado} />
              </div>
              <p className="text-xs text-gray-500">{cert.denominacion}</p>
              <p className="text-xs text-gray-400 mt-1">Vence: {formatDate(cert.fechaVencimiento)}</p>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Header card */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">Certificado {selectedCert.numero}</h2>
                    <StatusBadge status={selectedCert.estado} />
                  </div>
                  <p className="text-gray-500">{selectedCert.denominacion} &middot; Esquema {selectedCert.esquema}</p>
                </div>
                <div className={cn(
                  "text-right px-4 py-2 rounded-xl",
                  selectedCert.diasRestantes < 0 ? "bg-red-50" :
                  selectedCert.diasRestantes < 30 ? "bg-amber-50" : "bg-emerald-50"
                )}>
                  <p className="text-xs text-gray-500">Días restantes</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    selectedCert.diasRestantes < 0 ? "text-red-600" :
                    selectedCert.diasRestantes < 30 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {selectedCert.diasRestantes}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-8">
                <InfoRow label="Empresa" value={selectedCert.empresa} icon={Building2} />
                <InfoRow label="Certificador" value={selectedCert.certificador} icon={FileText} />
                <InfoRow label="Fecha Otorgamiento" value={formatDate(detail.fechaOtorgamiento)} icon={Calendar} />
                <InfoRow label="Fecha Vencimiento" value={formatDate(detail.fechaVencimiento)} icon={Calendar} />
                {detail.fechaSeguimiento1 && (
                  <InfoRow label="Seguimiento 1" value={formatDate(detail.fechaSeguimiento1)} icon={Calendar} />
                )}
                {detail.fechaSeguimiento2 && (
                  <InfoRow label="Seguimiento 2" value={formatDate(detail.fechaSeguimiento2)} icon={Calendar} />
                )}
              </div>

              {/* Fabricantes */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Fabricantes</p>
                <div className="flex flex-wrap gap-2">
                  {detail.fabricantes.map((fab) => (
                    <span key={fab} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-600 font-medium">
                      <Globe size={12} className="text-gray-400" />
                      {fab}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plantas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin size={16} className="text-cidet-cyan" />
                Plantas del Certificado
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Planta</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">País</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ISO 9001</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Venc. ISO</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Certificado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {detail.plantas.map((planta) => (
                      <tr key={planta.nombre} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3.5 font-medium text-gray-900">{planta.nombre}</td>
                        <td className="px-5 py-3.5 text-gray-600">{planta.pais}</td>
                        <td className="px-5 py-3.5">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">{planta.codigoISO9001}</code>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">{formatDate(planta.fechaVencimientoISO)}</td>
                        <td className="px-5 py-3.5">
                          <a href={planta.urlCertificado} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-cidet-cyan hover:underline text-xs font-medium">
                            Ver certificado <ExternalLink size={12} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Ensayos */}
          <Card>
            <CardHeader
              className="cursor-pointer select-none"
              onClick={() => setEnsayosOpen(!ensayosOpen)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical size={16} className="text-cidet-cyan" />
                  Ensayos Realizados
                  <span className="text-xs font-normal text-gray-400 ml-1">({detail.ensayos.length})</span>
                </CardTitle>
                {ensayosOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </div>
            </CardHeader>
            {ensayosOpen && (
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Referencia</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ensayo</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Laboratorio</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {detail.ensayos.map((ensayo, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-5 py-3.5 font-medium text-gray-900 max-w-[200px]">
                            <p className="truncate">{ensayo.referencia}</p>
                          </td>
                          <td className="px-5 py-3.5 text-gray-700">{ensayo.ensayo}</td>
                          <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatDate(ensayo.fecha)}</td>
                          <td className="px-5 py-3.5 text-gray-500 text-xs max-w-[200px]">
                            <p className="truncate">{ensayo.laboratorio}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{ensayo.metodo}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}
