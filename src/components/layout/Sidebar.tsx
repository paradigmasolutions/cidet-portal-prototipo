import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileSearch, LogOut, User,
  UploadCloud, FolderUp, MessageCircle,
  Building2, Check, ChevronDown, BarChart3, Info,
} from 'lucide-react'
import { CidetLogo } from './CidetLogo'
import type { LucideIcon } from 'lucide-react'
import { useI18n } from '../../i18n'
import type { TranslationKey } from '../../i18n'
import { cidetClients } from '../../data/cidetClients'

interface NavItem {
  to: string
  icon: LucideIcon
  label: TranslationKey
  // Si onClick está presente, se ejecuta antes de navegar (útil para items
  // que necesitan resetear estado, como "Portafolio" → setViewAsClient(null)).
  onClick?: () => void
  // Cuando es true, el item se pinta apagado y no navega — se usa para
  // representar opciones que sólo tienen sentido con un cliente en contexto.
  disabled?: boolean
  // Texto del tooltip cuando el item está disabled (explica por qué).
  disabledHint?: string
}

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const { t } = useI18n()

  return (
    <div className="mb-5">
      <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const { to, icon: Icon, label, onClick, disabled, disabledHint } = item
          if (disabled) {
            // Tooltip CSS-only en lugar del `title` nativo — éste último no
            // aparece bajo cursor-not-allowed en varios browsers. Usamos
            // group-hover sobre un span absoluto.
            return (
              <span
                key={`${to}-${label}`}
                className="group relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium text-slate-500 cursor-not-allowed opacity-60"
                aria-disabled
              >
                <Icon size={17} strokeWidth={1.8} />
                <span className="flex-1">{t(label)}</span>
                <Info size={13} className="shrink-0 text-slate-500" aria-hidden />
                {disabledHint && (
                  <span
                    role="tooltip"
                    className="pointer-events-none hidden absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[11px] font-bold text-white shadow-lg group-hover:block"
                  >
                    {disabledHint}
                  </span>
                )}
              </span>
            )
          }
          return (
            <NavLink
              key={`${to}-${label}`}
              to={to}
              end={to === '/'}
              onClick={onClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-[inset_3px_0_0_#00cfff]'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.07]'
                }`
              }
            >
              <Icon size={17} strokeWidth={1.8} />
              {t(label)}
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}

// Dropdown de selección de cliente. Sólo se renderiza para modo interno;
// el cliente final no tiene multi-tenant y por tanto no necesita switcher.
//
// Cambiar de cliente (o limpiar la selección) NO navega — el usuario se
// queda en la ruta donde estaba para conservar el contexto (ej. estás en
// /certificados, cambias de cliente, sigues viendo certificados pero del
// nuevo cliente). La navegación explícita a "/" se hace desde el item
// "Portafolio" del nav.
function ClientSwitcher() {
  const { t, viewAsClient, setViewAsClient } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const label = viewAsClient ? viewAsClient.legalName : t('switcher.allClients')

  return (
    <div className="mb-5 px-3" ref={ref}>
      <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {t('switcher.label')}
      </p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
          viewAsClient
            ? 'border-cidet-cyan/40 bg-cidet-cyan/10 text-white hover:border-cidet-cyan/70'
            : 'border-white/10 bg-white/[0.04] text-slate-200 hover:border-white/20'
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Building2 size={16} className={viewAsClient ? 'text-cidet-cyan' : 'text-slate-400'} />
        <span className="flex-1 truncate text-[12px] font-bold">{label}</span>
        <ChevronDown size={14} className="shrink-0 text-slate-400" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-30 mt-2 w-[256px] overflow-hidden rounded-lg border border-slate-700 bg-cidet-darker shadow-2xl"
        >
          <button
            type="button"
            role="option"
            aria-selected={!viewAsClient}
            onClick={() => {
              setViewAsClient(null)
              setOpen(false)
            }}
            className={`flex w-full items-center gap-2 border-b border-slate-700/60 px-3 py-2.5 text-left text-[12px] font-bold hover:bg-white/[0.06] ${
              !viewAsClient ? 'text-cidet-cyan' : 'text-slate-200'
            }`}
          >
            <BarChart3 size={14} />
            <span className="flex-1">{t('switcher.allClients')}</span>
            {!viewAsClient && <Check size={14} />}
          </button>
          <div className="max-h-72 overflow-y-auto">
            {cidetClients.map((c) => {
              const selected = viewAsClient?.id === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setViewAsClient({ id: c.id, legalName: c.legalName })
                    setOpen(false)
                  }}
                  className={`flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-white/[0.06] ${
                    selected ? 'bg-white/[0.05]' : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[12px] font-bold ${selected ? 'text-cidet-cyan' : 'text-slate-100'}`}>
                      {c.legalName}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                      {c.taxId ? `NIT ${c.taxId} · ` : ''}
                      {c.certificateCount} certificados · {c.activeProcessCount} en curso
                    </p>
                  </div>
                  {selected && <Check size={14} className="shrink-0 text-cidet-cyan" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { t, mode } = useI18n()
  const isInternal = mode === 'internal'

  // La aplicación es UNA sola — lo que ve cualquier usuario es la misma
  // estructura; la data cambia. Por eso ya no hay items "disabled" según
  // contexto: el portal siempre está navegable.
  const internalSection: NavItem[] = [
    { to: '/portafolio', icon: BarChart3, label: 'nav.portfolio' },
  ]

  // "Solicitar preoferta" y "Actualizar documentos" quedan fuera del alcance
  // V1 (Felipe, 2026-05-28). Se muestran apagados con icono ⓘ + tooltip
  // para que el cliente vea hacia dónde evoluciona el portal, pero sin que
  // pueda navegar a una vista incompleta.
  const certificationSection: NavItem[] = [
    { to: '/',             icon: LayoutDashboard, label: 'nav.summary'    },
    { to: '/certificados', icon: FileSearch,      label: 'nav.certificates' },
    { to: '/preoferta',    icon: UploadCloud,     label: 'nav.prequote',   disabled: true, disabledHint: 'Fuera de alcance' },
    { to: '/documentos',   icon: FolderUp,        label: 'nav.documents',  disabled: true, disabledHint: 'Fuera de alcance' },
    { to: '/contacto',     icon: MessageCircle,   label: 'nav.contact'    },
  ]

  const userName = isInternal
    ? t('user.internal')
    : mode === 'small_client'
      ? t('user.smallClient')
      : t('user.client')
  const userEmail = isInternal
    ? 'mauricio.rojas@cidet.org.co'
    : mode === 'small_client'
      ? 'calidad@iluminacionesandinas.com'
      : 'cliente@signify.com'

  // Para la barra inferior móvil sólo mostramos los activos: las opciones
  // disabled no aportan en un grid tan pequeño y confundirían.
  const mobileNav = certificationSection.filter((i) => !i.disabled).slice(0, 5)

  return (
    <>
    <aside className="fixed left-0 top-0 right-0 h-[72px] bg-cidet-navy flex z-50 md:right-auto md:bottom-0 md:h-auto md:w-[280px] md:flex-col">
      <div className="flex items-center px-4 py-4 border-b border-slate-700/50 md:h-[92px] md:justify-center md:px-6 md:py-6">
        <CidetLogo className="h-7 w-auto md:h-9" />
      </div>

      <nav className="hidden flex-1 px-3 py-5 overflow-y-auto md:block">
        {isInternal && <ClientSwitcher />}
        {isInternal && <NavSection title={t('common.internal')} items={internalSection} />}
        <NavSection title={t('nav.certification')} items={certificationSection} />
      </nav>

      <div className="hidden px-3 py-4 border-t border-slate-700/50 md:block">
        <div className="flex items-center gap-3 px-3">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
            <User size={15} className="text-cidet-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{userName}</p>
            <p className="text-slate-400 text-[11px] truncate">{userEmail}</p>
          </div>
          <button className="p-1.5 text-slate-500 hover:text-red-400 shrink-0">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-gray-200 bg-white md:hidden">
      {mobileNav.map(({ to, icon: Icon, label, onClick }) => (
        <NavLink
          key={`${to}-${label}`}
          to={to}
          end={to === '/'}
          onClick={onClick}
          className={({ isActive }) =>
            `flex h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold ${
              isActive ? 'text-cidet-navy' : 'text-gray-500'
            }`
          }
        >
          <Icon size={18} />
          <span className="max-w-[64px] truncate">{t(label)}</span>
        </NavLink>
      ))}
    </nav>
    </>
  )
}
