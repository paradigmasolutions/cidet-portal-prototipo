import { createContext, useContext, useMemo, useState } from 'react'

export type Locale = 'es' | 'en'
export type UserMode = 'small_client' | 'large_client' | 'internal'

// Identidad mínima del cliente que un usuario interno CIDET está "viendo
// como". Cuando el admin entra al portal lo hace sobre el portafolio
// completo (viewAsClient = null) y selecciona uno desde el sidebar para
// aterrizar en su espacio.
export interface ViewAsClient {
  id: string
  legalName: string
}

export type TranslationKey =
  | 'nav.summary'
  | 'nav.certificates'
  | 'nav.processes'
  | 'nav.prequote'
  | 'nav.documents'
  | 'nav.contact'
  | 'nav.exit'
  | 'nav.certification'
  | 'nav.workspace'
  | 'nav.portfolio'
  | 'user.client'
  | 'user.smallClient'
  | 'user.internal'
  | 'common.lastUpdate'
  | 'common.search'
  | 'common.language'
  | 'common.role'
  | 'common.client'
  | 'common.internal'
  | 'switcher.label'
  | 'switcher.placeholder'
  | 'switcher.allClients'
  | 'switcher.viewingAs'
  | 'switcher.clear'

const translations: Record<Locale, Record<TranslationKey, string>> = {
  es: {
    'nav.summary': 'Procesos',
    'nav.certificates': 'Certificados',
    'nav.processes': 'Auditorías en proceso',
    'nav.prequote': 'Solicitar preoferta',
    'nav.documents': 'Actualizar documentos',
    'nav.contact': 'Contáctanos',
    'nav.exit': 'Salir',
    'nav.certification': 'Certificación',
    'nav.workspace': 'Espacio de trabajo',
    'nav.portfolio': 'Portafolio',
    'user.client': 'SIGNIFY COLOMBIANA',
    'user.smallClient': 'ILUMINACIONES ANDINAS',
    'user.internal': 'Hernán Mauricio Rojas',
    'common.lastUpdate': 'Última actualización',
    'common.search': 'Buscar',
    'common.language': 'Idioma',
    'common.role': 'Perfil',
    'common.client': 'Cliente',
    'common.internal': 'CIDET interno',
    'switcher.label': 'Cliente',
    'switcher.placeholder': 'Selecciona un cliente',
    'switcher.allClients': 'Todos los clientes',
    'switcher.viewingAs': 'Viendo como',
    'switcher.clear': 'Volver al portafolio',
  },
  en: {
    'nav.summary': 'Processes',
    'nav.certificates': 'Certificates',
    'nav.processes': 'Audits in progress',
    'nav.prequote': 'Request prequote',
    'nav.documents': 'Update documents',
    'nav.contact': 'Contact us',
    'nav.exit': 'Sign out',
    'nav.certification': 'Certification',
    'nav.workspace': 'Workspace',
    'nav.portfolio': 'Portfolio',
    'user.client': 'SIGNIFY COLOMBIANA',
    'user.smallClient': 'ILUMINACIONES ANDINAS',
    'user.internal': 'Hernán Mauricio Rojas',
    'common.lastUpdate': 'Last update',
    'common.search': 'Search',
    'common.language': 'Language',
    'common.role': 'Profile',
    'common.client': 'Client',
    'common.internal': 'CIDET internal',
    'switcher.label': 'Client',
    'switcher.placeholder': 'Select a client',
    'switcher.allClients': 'All clients',
    'switcher.viewingAs': 'Viewing as',
    'switcher.clear': 'Back to portfolio',
  },
}

interface I18nContextValue {
  locale: Locale
  mode: UserMode
  viewAsClient: ViewAsClient | null
  setLocale: (locale: Locale) => void
  setMode: (mode: UserMode) => void
  setViewAsClient: (client: ViewAsClient | null) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es')
  // Por defecto entramos como CIDET interno — Felipe muestra todo desde la
  // vista admin y explica al cliente "lo que tú ves es esto pero filtrado".
  const [mode, setMode] = useState<UserMode>('internal')
  const [viewAsClient, setViewAsClient] = useState<ViewAsClient | null>(null)

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    mode,
    viewAsClient,
    setLocale,
    setMode,
    setViewAsClient,
    t: (key) => translations[locale][key],
  }), [locale, mode, viewAsClient])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider')
  }
  return context
}
