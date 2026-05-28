import { formatDate } from '../../lib/utils'
import { ExternalLink, MapPin } from 'lucide-react'
import { certificateDetail } from '../../data/mockData'

export function TabPlantas() {
  const { plantas } = certificateDetail

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <MapPin size={16} className="text-cidet-cyan" />
        <h3 className="font-semibold text-gray-900">Plantas del Certificado</h3>
        <span className="text-xs text-gray-400 font-medium ml-1">({plantas.length})</span>
      </div>

      <div className="grid gap-4">
        {plantas.map((planta) => (
          <div
            key={planta.nombre}
            className="rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h4 className="font-semibold text-gray-900">{planta.nombre}</h4>
                <p className="text-sm text-gray-500 mt-0.5">{planta.pais}</p>
              </div>
              <a
                href={planta.urlCertificado}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cidet-cyan/5 text-cidet-cyan rounded-lg text-xs font-semibold hover:bg-cidet-cyan/10 transition-colors shrink-0"
              >
                Ver certificado <ExternalLink size={12} />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-50">
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Código ISO 9001</p>
                <code className="text-sm font-mono bg-gray-50 px-2 py-0.5 rounded mt-1 inline-block">
                  {planta.codigoISO9001}
                </code>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Vencimiento ISO</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(planta.fechaVencimientoISO)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
