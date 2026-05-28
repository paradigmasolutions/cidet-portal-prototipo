import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'
import { CidetLogo } from '../components/layout/CidetLogo'
import { useI18n } from '../i18n'
import type { UserMode } from '../i18n'

const demoModes: UserMode[] = ['small_client', 'large_client', 'internal']

function resolveMode(email: string, demo: string | null): UserMode {
  if (demo && demoModes.includes(demo as UserMode)) {
    return demo as UserMode
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail.includes('@cidet')) return 'internal'
  if (
    normalizedEmail.includes('andinas')
    || normalizedEmail.includes('pequeno')
    || normalizedEmail.includes('peque')
  ) return 'small_client'

  // Default del login → modo interno. Para forzar vista de cliente usar
  // ?demo=large_client o ?demo=small_client en la URL del login.
  return 'internal'
}

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setMode } = useI18n()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const demo = useMemo(() => searchParams.get('demo'), [searchParams])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMode(resolveMode(email, demo))
    navigate('/')
  }

  // Login minimalista de una sola columna, centrado. Logo arriba, tagline
  // muy corta, form mínimo. Sin decoraciones, sin párrafos descriptivos,
  // sin elementos no funcionales (Recordarme, Recuperar acceso).
  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-6 py-12">
        <CidetLogo className="h-9 w-auto text-cidet-navy" />

        <h1 className="mt-10 text-2xl font-extrabold text-gray-950">
          Gestión de certificaciones
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 w-full space-y-3">
          <div className="flex h-12 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-cidet-cyan focus-within:ring-2 focus-within:ring-cidet-cyan/20">
            <Mail size={18} className="text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Correo electrónico"
              className="h-full flex-1 bg-transparent text-sm font-semibold text-gray-950 outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex h-12 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 focus-within:border-cidet-cyan focus-within:ring-2 focus-within:ring-cidet-cyan/20">
            <LockKeyhole size={18} className="text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Contraseña"
              className="h-full flex-1 bg-transparent text-sm font-semibold text-gray-950 outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cidet-navy px-5 text-sm font-bold text-white hover:bg-cidet-darker"
          >
            Entrar
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </main>
  )
}
