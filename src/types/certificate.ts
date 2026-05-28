export type CertificateStatus = 'vigente' | 'suspendido' | 'vencido' | 'por_vencer'

export interface Certificate {
  id: string
  numero: string
  empresa: string
  denominacion: string
  esquema: string
  estado: CertificateStatus
  // Metadata acordada con el cliente (Felipe, 2026-05-28): tiempos +
  // plantas + productos + comercial CIDET. Todo lo demás (esquema, normas
  // técnicas, observaciones) es secundario y va en el detalle, no en el
  // listado/tarjeta.
  producto: string
  familia: string
  referencias: string[]
  normas: string[]
  plantaPrincipal: string
  fechaOtorgamiento: string
  fechaProximaAuditoria: string | null
  fechaVencimiento: string
  fechaSuspension?: string
  certificador: string
  comercialCidet: string
  diasRestantes: number
  observaciones?: string
}

export interface Plant {
  nombre: string
  pais: string
  codigoISO9001: string
  fechaVencimientoISO: string
  urlCertificado: string
}

export interface Ensayo {
  referencia: string
  ensayo: string
  fecha: string
  laboratorio: string
  acreditado: boolean
  metodo: string
  resultado?: string
}

export interface ProcessStage {
  id: string
  etapa: string
  responsable: string
  fechaInicio?: string
  fechaFin?: string
  estado: 'completado' | 'en_progreso' | 'pendiente'
}

export interface CertificateDetail extends Certificate {
  fabricantes: string[]
  fechaSeguimiento1?: string
  fechaSeguimiento2?: string
  norma?: string
  plantas: Plant[]
  ensayos: Ensayo[]
  etapas?: ProcessStage[]
}

export interface Contact {
  nombre: string
  telefono: string
  email: string
  rol: string
}
