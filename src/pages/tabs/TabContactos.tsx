import { Mail, Phone, User, Users } from 'lucide-react'
import { contacts } from '../../data/mockData'

export function TabContactos() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Users size={16} className="text-cidet-cyan" />
        <h3 className="font-semibold text-gray-900">Contactos CIDET</h3>
        <span className="text-xs text-gray-400 font-medium ml-1">({contacts.length})</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {contacts.map((contact) => (
          <div
            key={contact.email}
            className="rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-cidet-cyan/10 rounded-xl flex items-center justify-center shrink-0">
                <User size={18} className="text-cidet-cyan" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900">{contact.nombre}</h4>
                <span className="inline-flex items-center px-2 py-0.5 bg-cidet-cyan/5 text-cidet-cyan text-[11px] font-semibold rounded-full mt-1">
                  {contact.rol}
                </span>
                <div className="mt-3 space-y-1.5">
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-cidet-cyan transition-colors">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </a>
                  <a href={`tel:${contact.telefono}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-cidet-cyan transition-colors">
                    <Phone size={13} className="text-gray-400 shrink-0" />
                    <span>{contact.telefono}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
