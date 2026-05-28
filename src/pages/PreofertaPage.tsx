import { UploadCloud } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

const uploadBuckets = [
  'Fichas técnicas y catálogos de productos',
  'Certificados ISO 9001 de plantas',
  'Reportes de ensayo previos',
]

export function PreofertaPage() {
  const [searchParams] = useSearchParams()
  const certificate = searchParams.get('certificate')
  const reason = searchParams.get('reason')

  return (
    <>
      <PageHeader
        title={certificate ? `Solicitud para certificado ${certificate}` : 'Iniciar solicitud'}
        description={reason ? reason : 'Renovación, ampliación, nuevo certificado o actualización documental'}
      />

      {certificate && (
        <div className="mb-5 rounded-lg border border-cidet-cyan/20 bg-cidet-cyan-light p-4">
          <p className="text-sm font-bold text-cidet-navy">Contexto de la solicitud</p>
          <p className="mt-1 text-sm text-gray-600">
            Esta solicitud queda asociada al certificado {certificate}. CIDET usará la información histórica del certificado, sus referencias, plantas y ensayos como punto de partida.
          </p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Documentos requeridos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {uploadBuckets.map((bucket) => (
                <button
                  key={bucket}
                  className="min-h-[170px] rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-left hover:border-cidet-cyan hover:bg-white"
                >
                  <UploadCloud className="text-cidet-cyan-dark" size={24} />
                  <p className="mt-4 text-sm font-bold text-gray-900">{bucket}</p>
                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    PDF, Word, Excel o imagen. El archivo se valida antes de guardarse en el NAS.
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
              <select className="h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-cidet-cyan">
                <option>RETIE 2024 - Luminarias de alumbrado publico</option>
                <option>RETILAP 2024 - Fuentes LED</option>
                <option>RTS29 El Salvador</option>
              </select>
              <button className="h-11 rounded-lg bg-cidet-navy px-4 text-sm font-bold text-white">
                Solicitar preoferta
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ultimas solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {['PF-SIGNIFY-0042', 'PF-SIGNIFY-0041', 'PF-SIGNIFY-0040'].map((code, index) => (
                <div key={code} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-bold text-gray-900">{code}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {index === 0 ? 'En revision comercial' : 'Contactado por CIDET'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
