import { FileUp } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { certificates } from '../data/mockData'

export function DocumentosPage() {
  return (
    <>
      <PageHeader
        title="Actualizar documentos de soporte"
        description="Adjunta nuevas versiones de certificados ISO 9001 o reportes de ensayo"
      />

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Certificados aplicables</CardTitle>
          </CardHeader>
          <CardContent>
            <label className="mb-3 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm font-semibold text-gray-800">
              <input type="checkbox" defaultChecked className="accent-cidet-cyan" />
              Aplica para todos
            </label>
            <div className="space-y-2">
              {certificates.map((certificate) => (
                <label key={certificate.id} className="flex items-center gap-2 rounded-lg border border-gray-100 p-3 text-sm">
                  <input type="checkbox" className="accent-cidet-cyan" />
                  <span className="font-semibold text-gray-800">{certificate.numero}</span>
                  <span className="text-gray-400">{certificate.denominacion}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cargar documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {['Certificado ISO 9001 de planta', 'Reporte de ensayo previo'].map((title) => (
                <button
                  key={title}
                  className="min-h-[220px] rounded-lg border border-dashed border-gray-300 bg-gray-50 p-5 text-left hover:border-cidet-cyan hover:bg-white"
                >
                  <FileUp className="text-cidet-cyan-dark" size={26} />
                  <p className="mt-5 text-base font-bold text-gray-900">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Cada nueva carga queda versionada. Las versiones anteriores no se sobrescriben.
                  </p>
                </button>
              ))}
            </div>
            <button className="mt-5 h-11 rounded-lg bg-cidet-navy px-5 text-sm font-bold text-white">
              Confirmar documentos y actualizar
            </button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
