import { useState } from 'react'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { PageHeader } from '../../components/ui/PageHeader'
import { currentProfile } from '../../data/adminMockData'
import {
  Building2, Mail, Phone, MapPin, Save, Lock, Eye, EyeOff,
  ShieldCheck, Calendar, Award, CheckCircle2,
} from 'lucide-react'

function Field({ label, value, icon: Icon }: {
  label: string
  value: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-50 last:border-0">
      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
        <Icon size={14} className="text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-900 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export function PerfilPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const p = currentProfile

  return (
    <>
      <PageHeader
        title="Mi Perfil"
        description="Información de su cuenta y configuración personal"
      />

      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Profile info */}
        <div className="space-y-6">
          {/* Hero card */}
          <Card>
            <CardContent className="p-6">
              {/* Avatar + name */}
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cidet-cyan to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-sm shadow-cidet-cyan/20 shrink-0">
                  CM
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{p.nombre}</h2>
                  <p className="text-sm text-gray-500">{p.cargo}</p>
                  <p className="text-xs text-cidet-cyan font-medium mt-0.5">{p.empresa}</p>
                </div>
              </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { label: 'Empresa', value: p.empresa, icon: Building2 },
                    { label: 'Miembro desde', value: new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric' }).format(new Date(p.fechaRegistro)), icon: Calendar },
                    { label: 'Certificados', value: '5 activos', icon: Award },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3.5">
                      <Icon size={14} className="text-gray-400 mb-1.5" />
                      <p className="text-xs font-semibold text-gray-700">{value}</p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-x-8">
                <Field label="Email" value={p.email} icon={Mail} />
                <Field label="Teléfono" value={p.telefono} icon={Phone} />
                <Field label="NIT" value={p.nit} icon={Building2} />
                <Field label="Dirección" value={p.direccion} icon={MapPin} />
              </div>
              <p className="text-[11px] text-gray-400 mt-4 bg-gray-50 rounded-lg p-3">
                Para actualizar la información de su empresa, contacte al administrador CIDET a través de
                <a href="mailto:soporte@cidet.org.co" className="text-cidet-cyan font-semibold ml-1">soporte@cidet.org.co</a>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock size={15} className="text-cidet-cyan" />
                Cambiar Contraseña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block mb-1.5">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cidet-cyan/30 focus:border-cidet-cyan pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block mb-1.5">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cidet-cyan/30 focus:border-cidet-cyan"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block mb-1.5">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cidet-cyan/30 focus:border-cidet-cyan"
                />
              </div>
              <button
                onClick={() => setSaved(true)}
                className={cn(
                  "w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  saved
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                    : "bg-cidet-cyan text-white hover:bg-cidet-cyan-dark shadow-sm shadow-cidet-cyan/20"
                )}
              >
                {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
                {saved ? 'Contraseña actualizada' : 'Actualizar Contraseña'}
              </button>
            </CardContent>
          </Card>

          {/* Session info */}
          <Card>
            <CardContent className="py-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={15} className="text-emerald-500" />
                <p className="text-sm font-semibold text-gray-700">Sesión Actual</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Dispositivo', value: 'Chrome / Windows' },
                  { label: 'IP', value: '190.25.44.102' },
                  { label: 'Último acceso', value: '24 feb 2026, 08:30 AM' },
                  { label: 'Ubicación', value: 'Medellín, Colombia' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-xs font-medium text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
