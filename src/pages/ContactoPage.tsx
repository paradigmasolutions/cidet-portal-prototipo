import { Mail, Phone } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { contacts } from '../data/mockData'

export function ContactoPage() {
  const [searchParams] = useSearchParams()
  const certificate = searchParams.get('certificate')
  const reason = searchParams.get('reason')

  return (
    <>
      <PageHeader
        title={certificate ? `Contacto por certificado ${certificate}` : 'Contactar a CIDET'}
        description={reason ? reason : 'Equipo asociado a tus certificados y procesos abiertos'}
      />

      {certificate && (
        <div className="mb-5 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-gray-950">Consulta contextual</p>
          <p className="mt-1 text-sm text-gray-600">
            El mensaje se enviara con referencia al certificado {certificate}, para que el equipo CIDET conserve el contexto.
          </p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {contacts.map((contact) => (
          <Card key={`${contact.email}-${contact.rol}`}>
            <CardContent>
              <p className="text-xs font-bold uppercase text-cidet-cyan-dark">{contact.rol}</p>
              <p className="mt-2 text-lg font-bold text-gray-900">{contact.nombre}</p>
              <div className="mt-5 space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-cidet-cyan" />
                {contact.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={15} className="text-cidet-cyan" />
                  {contact.telefono}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Mensaje para CIDET</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="min-h-[140px] w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-cidet-cyan"
            placeholder="Describe tu consulta sobre certificados, auditorias o documentos."
          />
          <button className="mt-4 h-11 rounded-lg bg-cidet-navy px-5 text-sm font-bold text-white">
            Enviar mensaje
          </button>
        </CardContent>
      </Card>
    </>
  )
}
