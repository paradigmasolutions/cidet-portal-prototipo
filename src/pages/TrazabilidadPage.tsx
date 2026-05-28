import { useState } from 'react'
import { cn, formatDate } from '../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/Badge'
import {
  CheckCircle2, Clock, Circle, Phone, Mail, User,
} from 'lucide-react'
import { certificates, processStages, contacts } from '../data/mockData'
import type { Certificate } from '../types/certificate'

const stageStatusIcon = {
  completado: CheckCircle2,
  en_progreso: Clock,
  pendiente: Circle,
}

const stageStatusColor = {
  completado: 'text-emerald-500',
  en_progreso: 'text-cidet-cyan',
  pendiente: 'text-gray-300',
}

const stageStatusLabel = {
  completado: 'Completado',
  en_progreso: 'En progreso',
  pendiente: 'Pendiente',
}

export function TrazabilidadPage() {
  const [selectedCert, setSelectedCert] = useState<Certificate>(certificates[0])

  const completedCount = processStages.filter(s => s.estado === 'completado').length
  const totalStages = processStages.length
  const progressPercent = Math.round((completedCount / totalStages) * 100)

  return (
    <>
      <PageHeader
        title="Trazabilidad del Proceso"
        description="Seguimiento de etapas de certificación en curso"
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
            </button>
          ))}

          {/* Contacts Card */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Contactos CIDET
            </p>
            <Card>
              <CardContent className="p-4 space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.email} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-cidet-cyan/10 rounded-full flex items-center justify-center shrink-0">
                      <User size={14} className="text-cidet-cyan" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{contact.nombre}</p>
                      <p className="text-xs text-cidet-cyan font-medium">{contact.rol}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Mail size={10} className="text-gray-400" />
                        <p className="text-xs text-gray-400 truncate">{contact.email}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={10} className="text-gray-400" />
                        <p className="text-xs text-gray-400">{contact.telefono}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Progress summary */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Certificado {selectedCert.numero}</h3>
                  <p className="text-sm text-gray-500">{selectedCert.denominacion} &middot; {selectedCert.empresa}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-cidet-cyan">{progressPercent}%</p>
                  <p className="text-xs text-gray-400">{completedCount} de {totalStages} etapas</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cidet-cyan to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Etapas del Proceso</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="relative">
                {processStages.map((stage, index) => {
                  const Icon = stageStatusIcon[stage.estado]
                  const isLast = index === processStages.length - 1
                  const isPhaseBreak = index > 0 && stage.id.split('.')[0] !== processStages[index - 1].id.split('.')[0]

                  return (
                    <div key={stage.id}>
                      {isPhaseBreak && (
                        <div className="ml-3 pl-8 py-3">
                          <div className="border-t border-dashed border-gray-200" />
                        </div>
                      )}
                      <div className="flex gap-4 relative">
                        {/* Timeline line + icon */}
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "relative z-10 flex items-center justify-center w-7 h-7 rounded-full",
                            stage.estado === 'en_progreso' ? "bg-cidet-cyan/10 ring-2 ring-cidet-cyan/30" :
                            stage.estado === 'completado' ? "bg-emerald-50" : "bg-gray-50"
                          )}>
                            <Icon size={16} className={stageStatusColor[stage.estado]} />
                          </div>
                          {!isLast && (
                            <div className={cn(
                              "w-0.5 flex-1 min-h-[32px]",
                              stage.estado === 'completado' ? "bg-emerald-200" : "bg-gray-100"
                            )} />
                          )}
                        </div>

                        {/* Content */}
                        <div className={cn(
                          "flex-1 pb-6 -mt-0.5",
                          isLast && "pb-2"
                        )}>
                          <div className={cn(
                            "rounded-xl p-4 border transition-all",
                            stage.estado === 'en_progreso'
                              ? "bg-cidet-cyan/5 border-cidet-cyan/20 shadow-sm"
                              : stage.estado === 'completado'
                              ? "bg-white border-gray-100"
                              : "bg-gray-50/50 border-gray-100/50"
                          )}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-gray-400">{stage.id}</span>
                                  <h4 className={cn(
                                    "text-sm font-semibold",
                                    stage.estado === 'pendiente' ? "text-gray-400" : "text-gray-900"
                                  )}>
                                    {stage.etapa}
                                  </h4>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{stage.responsable}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className={cn(
                                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                                  stage.estado === 'completado' ? "bg-emerald-50 text-emerald-600" :
                                  stage.estado === 'en_progreso' ? "bg-cyan-50 text-cidet-cyan" :
                                  "bg-gray-100 text-gray-400"
                                )}>
                                  {stageStatusLabel[stage.estado]}
                                </span>
                                {stage.fechaInicio && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(stage.fechaInicio)}
                                    {stage.fechaFin && ` → ${formatDate(stage.fechaFin)}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
