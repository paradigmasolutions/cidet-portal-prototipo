import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Download, FileText, FlaskConical, GitBranch, MapPin, Users,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { StatusBadge } from '../components/ui/Badge'
import { TabInfo } from './tabs/TabInfo'
import { TabPlantas } from './tabs/TabPlantas'
import { TabEnsayos } from './tabs/TabEnsayos'
import { TabTrazabilidad } from './tabs/TabTrazabilidad'
import { TabContactos } from './tabs/TabContactos'
import { certificates } from '../data/mockData'

// Vista detalle por pestañas para un certificado emitido. La trazabilidad
// se muestra en modo "histórico" (todo check) porque el cert ya está
// emitido — su proceso terminó. La intención es didáctica: que el cliente
// entienda por dónde pasó el certificado.

const tabs = [
  { id: 'info',         label: 'Certificado',  icon: FileText },
  { id: 'plantas',      label: 'Plantas',      icon: MapPin },
  { id: 'ensayos',      label: 'Ensayos',      icon: FlaskConical },
  { id: 'trazabilidad', label: 'Trazabilidad', icon: GitBranch },
  { id: 'contactos',    label: 'Contactos',    icon: Users },
] as const

type TabId = typeof tabs[number]['id']

export function CertificadoDetallePage() {
  const { numero = '08097' } = useParams<{ numero: string }>()
  const navigate = useNavigate()
  const cert = certificates.find((c) => c.numero === numero) ?? certificates[0]
  const [activeTab, setActiveTab] = useState<TabId>('info')

  return (
    <>
      {/* Header compacto inline — mismo patrón que el detalle de proceso. */}
      <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-gray-200 pb-4">
        <button
          onClick={() => navigate('/certificados')}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-bold text-gray-700 hover:border-cidet-cyan hover:text-cidet-navy"
        >
          <ArrowLeft size={13} />
          Volver
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Certificado</span>
            <h1 className="text-xl font-extrabold tracking-tight text-cidet-navy">N.° {cert.numero}</h1>
            <StatusBadge status={cert.estado} />
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            {cert.denominacion} · {cert.producto} · {cert.empresa}
          </p>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-cidet-navy px-3 text-xs font-bold text-white hover:bg-cidet-darker">
          <Download size={14} />
          Descargar PDF
        </button>
      </div>

      {/* Pestañas: misma estructura que el viejo CertificateDetailPage del
          11da1a5 (Información · Plantas · Ensayos · Trazabilidad · Contactos)
          pero con el look del prototipo actual. */}
      <div className="overflow-hidden rounded-lg border border-gray-100/80 bg-white shadow-sm">
        <div className="overflow-x-auto border-b border-gray-100">
          <nav className="-mb-px flex min-w-max gap-1 px-3 md:px-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-all md:px-4 md:py-3.5',
                  activeTab === id
                    ? 'border-cidet-cyan text-cidet-cyan'
                    : 'border-transparent text-gray-400 hover:border-gray-200 hover:text-gray-600',
                )}
              >
                <Icon size={15} strokeWidth={2} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 md:p-6">
          {activeTab === 'info' && <TabInfo certificate={cert} />}
          {activeTab === 'plantas' && <TabPlantas />}
          {activeTab === 'ensayos' && <TabEnsayos />}
          {activeTab === 'trazabilidad' && <TabTrazabilidad certificate={cert} allCompleted />}
          {activeTab === 'contactos' && <TabContactos />}
        </div>
      </div>
    </>
  )
}
