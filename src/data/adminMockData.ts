export interface UserAccount {
  id: string
  empresa: string
  nombre: string
  email: string
  rol: 'cliente' | 'admin'
  estado: 'activo' | 'inactivo'
  ultimoAcceso: string | null
  certificados: number
}

export interface AccessLog {
  id: string
  usuario: string
  empresa: string
  accion: string
  fecha: string
  ip: string
  dispositivo: string
}

export interface AlertConfig {
  id: string
  tipo: string
  descripcion: string
  diasAntes: number
  emailActivo: boolean
  portalActivo: boolean
}

export const users: UserAccount[] = [
  { id: '1', empresa: 'SIGNIFY COLOMBIANA S.A.S', nombre: 'Carlos Mendoza', email: 'carlos.mendoza@signify.com', rol: 'cliente', estado: 'activo', ultimoAcceso: '2026-02-24T08:30:00', certificados: 5 },
  { id: '2', empresa: 'SIGNIFY COLOMBIANA S.A.S', nombre: 'Laura Gómez', email: 'laura.gomez@signify.com', rol: 'cliente', estado: 'activo', ultimoAcceso: '2026-02-20T14:15:00', certificados: 5 },
  { id: '3', empresa: 'LUMINEX S.A.', nombre: 'Andrés Ríos', email: 'arios@luminex.co', rol: 'cliente', estado: 'activo', ultimoAcceso: '2026-02-18T09:45:00', certificados: 3 },
  { id: '4', empresa: 'ELECTRO COMPONENTES LTDA', nombre: 'María Castillo', email: 'mcastillo@electrocomp.com', rol: 'cliente', estado: 'inactivo', ultimoAcceso: '2025-11-03T16:20:00', certificados: 2 },
  { id: '5', empresa: 'INDUSTRIAS LUMEN S.A.S', nombre: 'Jorge Patiño', email: 'jpatiño@lumen.com.co', rol: 'cliente', estado: 'activo', ultimoAcceso: null, certificados: 1 },
  { id: '6', empresa: 'CIDET', nombre: 'Luis Castañeda', email: 'luis.castaneda@cidet.org.co', rol: 'admin', estado: 'activo', ultimoAcceso: '2026-02-24T07:00:00', certificados: 0 },
  { id: '7', empresa: 'CIDET', nombre: 'Steven Ramírez', email: 'steven.ramirez@cidet.org.co', rol: 'admin', estado: 'activo', ultimoAcceso: '2026-02-23T17:30:00', certificados: 0 },
]

export const accessLogs: AccessLog[] = [
  { id: '1', usuario: 'carlos.mendoza@signify.com', empresa: 'SIGNIFY COLOMBIANA S.A.S', accion: 'Inicio de sesión', fecha: '2026-02-24T08:30:12', ip: '190.25.44.102', dispositivo: 'Chrome / Windows' },
  { id: '2', usuario: 'carlos.mendoza@signify.com', empresa: 'SIGNIFY COLOMBIANA S.A.S', accion: 'Consulta certificado 07796', fecha: '2026-02-24T08:31:05', ip: '190.25.44.102', dispositivo: 'Chrome / Windows' },
  { id: '3', usuario: 'carlos.mendoza@signify.com', empresa: 'SIGNIFY COLOMBIANA S.A.S', accion: 'Descarga reporte PDF', fecha: '2026-02-24T08:35:20', ip: '190.25.44.102', dispositivo: 'Chrome / Windows' },
  { id: '4', usuario: 'luis.castaneda@cidet.org.co', empresa: 'CIDET', accion: 'Inicio de sesión', fecha: '2026-02-24T07:00:45', ip: '200.13.232.10', dispositivo: 'Edge / Windows' },
  { id: '5', usuario: 'luis.castaneda@cidet.org.co', empresa: 'CIDET', accion: 'Creación de usuario jpatiño@lumen.com.co', fecha: '2026-02-24T07:05:30', ip: '200.13.232.10', dispositivo: 'Edge / Windows' },
  { id: '6', usuario: 'laura.gomez@signify.com', empresa: 'SIGNIFY COLOMBIANA S.A.S', accion: 'Inicio de sesión', fecha: '2026-02-20T14:15:33', ip: '190.25.44.105', dispositivo: 'Safari / macOS' },
  { id: '7', usuario: 'laura.gomez@signify.com', empresa: 'SIGNIFY COLOMBIANA S.A.S', accion: 'Consulta trazabilidad 08092', fecha: '2026-02-20T14:18:12', ip: '190.25.44.105', dispositivo: 'Safari / macOS' },
  { id: '8', usuario: 'arios@luminex.co', empresa: 'LUMINEX S.A.', accion: 'Inicio de sesión', fecha: '2026-02-18T09:45:01', ip: '181.49.100.55', dispositivo: 'Chrome / Android' },
  { id: '9', usuario: 'steven.ramirez@cidet.org.co', empresa: 'CIDET', accion: 'Deshabilitación usuario mcastillo@electrocomp.com', fecha: '2026-02-17T11:20:00', ip: '200.13.232.12', dispositivo: 'Chrome / Windows' },
  { id: '10', usuario: 'mcastillo@electrocomp.com', empresa: 'ELECTRO COMPONENTES LTDA', accion: 'Intento de sesión fallido', fecha: '2026-02-17T15:42:00', ip: '186.80.21.33', dispositivo: 'Chrome / Windows' },
]

export const alertConfigs: AlertConfig[] = [
  { id: '1', tipo: 'Vencimiento próximo', descripcion: 'Notificación cuando un certificado está próximo a vencer', diasAntes: 60, emailActivo: true, portalActivo: true },
  { id: '2', tipo: 'Vencimiento próximo', descripcion: 'Segundo recordatorio de vencimiento', diasAntes: 30, emailActivo: true, portalActivo: true },
  { id: '3', tipo: 'Vencimiento próximo', descripcion: 'Alerta urgente de vencimiento', diasAntes: 15, emailActivo: true, portalActivo: true },
  { id: '4', tipo: 'Cambio de etapa', descripcion: 'Notificación cuando un certificado avanza de etapa en el proceso', diasAntes: 0, emailActivo: true, portalActivo: true },
  { id: '5', tipo: 'Suspensión', descripcion: 'Notificación inmediata cuando un certificado es suspendido', diasAntes: 0, emailActivo: true, portalActivo: true },
  { id: '6', tipo: 'Resumen semanal', descripcion: 'Resumen del estado de todos los certificados del cliente', diasAntes: 0, emailActivo: false, portalActivo: false },
]

export const currentProfile = {
  empresa: 'SIGNIFY COLOMBIANA S.A.S',
  nit: '900.123.456-7',
  nombre: 'Carlos Mendoza',
  cargo: 'Director de Calidad',
  email: 'carlos.mendoza@signify.com',
  telefono: '+57 310 555 1234',
  direccion: 'Cra 43A #1-50, Torre Sur, Piso 12, Medellín',
  fechaRegistro: '2024-06-15',
}
