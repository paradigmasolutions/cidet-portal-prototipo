import { cn, formatDate } from '../../lib/utils'
import { CheckCircle2, Clock, Circle, GitBranch } from 'lucide-react'
import { processStages } from '../../data/mockData'
import type { Certificate } from '../../types/certificate'

const stageIcon = {
  completado: CheckCircle2,
  en_progreso: Clock,
  pendiente: Circle,
}

const stageColor = {
  completado: 'text-emerald-500',
  en_progreso: 'text-cidet-cyan',
  pendiente: 'text-gray-300',
}

const stageLabel = {
  completado: 'Completado',
  en_progreso: 'En progreso',
  pendiente: 'Pendiente',
}

// `allCompleted` se usa desde la vista detalle de un cert ya emitido: el
// proceso terminó, todo se muestra en check. La trazabilidad ahí es
// histórica y didáctica (que el cliente entienda por dónde pasó), no un
// estado vivo del workflow.
export function TabTrazabilidad({ certificate, allCompleted = false }: { certificate: Certificate; allCompleted?: boolean }) {
  const stages = allCompleted
    ? processStages.map((s) => ({ ...s, estado: 'completado' as const }))
    : processStages
  const completedCount = stages.filter((s) => s.estado === 'completado').length
  const totalStages = stages.length
  const progressPercent = Math.round((completedCount / totalStages) * 100)

  return (
    <div>
      {/* Progress header */}
      <div className="flex items-center gap-2 mb-5">
        <GitBranch size={16} className="text-cidet-cyan" />
        <h3 className="font-semibold text-gray-900">Trazabilidad del Proceso</h3>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">
          Certificado <span className="font-semibold text-gray-700">{certificate.numero}</span> &middot; {certificate.denominacion}
        </p>
        <p className="text-sm font-bold text-cidet-cyan">{progressPercent}% completado</p>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-gradient-to-r from-cidet-cyan to-emerald-400 rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Timeline */}
      <div className="relative">
        {stages.map((stage, index) => {
          const Icon = stageIcon[stage.estado]
          const isLast = index === stages.length - 1
          const isPhaseBreak = index > 0 && stage.id.split('.')[0] !== stages[index - 1].id.split('.')[0]

          return (
            <div key={stage.id}>
              {isPhaseBreak && (
                <div className="ml-[13px] pl-8 py-2">
                  <div className="border-t border-dashed border-gray-200" />
                </div>
              )}
              <div className="flex gap-4 relative">
                {/* Icon + line */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-7 h-7 rounded-full",
                    stage.estado === 'en_progreso' ? "bg-cidet-cyan/10 ring-2 ring-cidet-cyan/30" :
                    stage.estado === 'completado' ? "bg-emerald-50" : "bg-gray-50"
                  )}>
                    <Icon size={15} className={stageColor[stage.estado]} />
                  </div>
                  {!isLast && (
                    <div className={cn(
                      "w-0.5 flex-1 min-h-[24px]",
                      stage.estado === 'completado' ? "bg-emerald-200" : "bg-gray-100"
                    )} />
                  )}
                </div>

                {/* Card */}
                <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
                  <div className={cn(
                    "rounded-xl p-4 border transition-all",
                    stage.estado === 'en_progreso'
                      ? "bg-cidet-cyan/[0.03] border-cidet-cyan/20"
                      : stage.estado === 'completado'
                      ? "bg-white border-gray-100"
                      : "bg-gray-50/30 border-gray-100/50"
                  )}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{stage.id}</span>
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
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                          stage.estado === 'completado' ? "bg-emerald-50 text-emerald-600" :
                          stage.estado === 'en_progreso' ? "bg-cidet-cyan/10 text-cidet-cyan" :
                          "bg-gray-100 text-gray-400"
                        )}>
                          {stageLabel[stage.estado]}
                        </span>
                        {stage.fechaInicio && (
                          <p className="text-[11px] text-gray-400 mt-1 tabular-nums">
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
    </div>
  )
}
