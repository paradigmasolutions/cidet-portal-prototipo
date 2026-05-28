import type { ViewAsClient } from '../i18n'

// Catálogo mock de clientes CIDET para el selector del sidebar (vista
// interna). En producción esto vendrá de `/api/admin/clients` filtrado por
// orgs con al menos un certificado o un proceso activo y rankeado por
// actividad reciente. Cantidades de certificados y procesos se incluyen
// solo para enriquecer el dropdown — no son cálculos vivos en este mock.
export interface CidetClientOption extends ViewAsClient {
  taxId: string | null
  certificateCount: number
  activeProcessCount: number
}

export const cidetClients: CidetClientOption[] = [
  { id: 'cli-signify',      legalName: 'SIGNIFY COLOMBIANA S.A.S',          taxId: '860.045.124-2', certificateCount: 42, activeProcessCount: 7 },
  { id: 'cli-schneider',    legalName: 'SCHNEIDER ELECTRIC DE COLOMBIA',    taxId: '860.005.114-2', certificateCount: 36, activeProcessCount: 5 },
  { id: 'cli-legrand',      legalName: 'LEGRAND COLOMBIA S.A.',             taxId: '860.013.901-5', certificateCount: 28, activeProcessCount: 4 },
  { id: 'cli-centelsa',     legalName: 'CENTELSA S.A.',                     taxId: '890.300.341-8', certificateCount: 24, activeProcessCount: 6 },
  { id: 'cli-abb',          legalName: 'ABB LTDA',                          taxId: '860.002.144-6', certificateCount: 21, activeProcessCount: 3 },
  { id: 'cli-andinas',      legalName: 'ILUMINACIONES ANDINAS S.A.S',       taxId: '900.812.477-1', certificateCount: 1,  activeProcessCount: 1 },
  { id: 'cli-procables',    legalName: 'PROCABLES S.A.S',                   taxId: '900.214.876-3', certificateCount: 18, activeProcessCount: 2 },
  { id: 'cli-siemens',      legalName: 'SIEMENS S.A.',                      taxId: '860.005.477-4', certificateCount: 15, activeProcessCount: 2 },
]
