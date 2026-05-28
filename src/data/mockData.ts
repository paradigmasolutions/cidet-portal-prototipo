import type { Certificate, CertificateDetail, Contact, ProcessStage } from '../types/certificate'

// Mock de 30 certificados distribuidos entre clientes del catálogo CIDET
// para que la sección "Certificados" se vea con volumen real (filtros,
// paginación y agrupación tienen sentido). Distribución por estado:
//   20 Vigente · 5 Por vencer · 3 Vencido · 2 Suspendido
// Hoy = 2026-05-28; "Por vencer" = vencimiento dentro de los próximos 60d.
export const certificates: Certificate[] = [
  // ─── SIGNIFY COLOMBIANA — 8 certs ────────────────────────────────────────
  {
    id: '1',  numero: '08097', empresa: 'SIGNIFY COLOMBIANA S.A.S', denominacion: 'LUMINARIAS',
    esquema: 'Esquema 5 RETILAP', estado: 'vigente',
    producto: 'Luminarias LED industriales', familia: 'Iluminación interior',
    referencias: ['BY698P', 'BY570P', 'WT120C'], normas: ['RETILAP 2024', 'IEC 60598-1'],
    plantaPrincipal: 'Signify Luminaires México S.A. de C.V.',
    fechaOtorgamiento: '2023-06-25', fechaProximaAuditoria: '2026-09-25', fechaVencimiento: '2028-06-25',
    certificador: 'CIDET', comercialCidet: 'Betty Ochoa', diasRestantes: 759,
  },
  {
    id: '2',  numero: '08213', empresa: 'SIGNIFY COLOMBIANA S.A.S', denominacion: 'LUMINARIAS',
    esquema: 'Esquema 5 RETILAP', estado: 'vigente',
    producto: 'Paneles LED para techo', familia: 'Iluminación interior',
    referencias: ['RC065B', 'RC125B', 'SP480P'], normas: ['RETILAP 2024'],
    plantaPrincipal: 'Signify Luminaires (Shanghai) Co. Ltd',
    fechaOtorgamiento: '2024-01-18', fechaProximaAuditoria: '2026-12-15', fechaVencimiento: '2029-01-18',
    certificador: 'CIDET', comercialCidet: 'Betty Ochoa', diasRestantes: 966,
  },
  {
    id: '3',  numero: '08342', empresa: 'SIGNIFY COLOMBIANA S.A.S', denominacion: 'LUMINARIAS',
    esquema: 'Esquema 5 RETILAP', estado: 'vigente',
    producto: 'Downlights LED empotrables', familia: 'Iluminación interior',
    referencias: ['DN130B', 'DN145B', 'RS151B'], normas: ['RETILAP 2024'],
    plantaPrincipal: 'Signify Netherlands B.V.',
    fechaOtorgamiento: '2024-04-02', fechaProximaAuditoria: '2027-04-02', fechaVencimiento: '2029-04-02',
    certificador: 'CIDET', comercialCidet: 'Betty Ochoa', diasRestantes: 1040,
  },
  {
    id: '4',  numero: '08456', empresa: 'SIGNIFY COLOMBIANA S.A.S', denominacion: 'LUMINARIAS',
    esquema: 'Esquema 5 RETILAP', estado: 'vigente',
    producto: 'Luminarias viales LED', familia: 'Iluminación exterior',
    referencias: ['BRP392', 'BRP710', 'BRP491'], normas: ['RETILAP 2024', 'IEC 60598-2-3'],
    plantaPrincipal: 'Signify Luminaires (Shanghai) Co. Ltd',
    fechaOtorgamiento: '2024-09-10', fechaProximaAuditoria: '2027-09-10', fechaVencimiento: '2029-09-10',
    certificador: 'CIDET', comercialCidet: 'Betty Ochoa', diasRestantes: 1201,
  },
  {
    id: '5',  numero: '08092', empresa: 'SIGNIFY COLOMBIANA S.A.S', denominacion: 'FUENTES',
    esquema: 'Esquema 5 RETIE', estado: 'por_vencer',
    producto: 'Drivers LED', familia: 'Componentes para iluminación',
    referencias: ['Xitanium 150W', 'Xitanium 75W', 'CertaDrive 45W'], normas: ['RETIE 2024', 'NTC 2050'],
    plantaPrincipal: 'Signify Luminaires (Shanghai) Co. Ltd',
    fechaOtorgamiento: '2023-03-03', fechaProximaAuditoria: '2026-06-15', fechaVencimiento: '2026-07-21',
    certificador: 'CIDET', comercialCidet: 'Betty Ochoa', diasRestantes: 54,
  },
  {
    id: '6',  numero: '07908', empresa: 'SIGNIFY COLOMBIANA S.A.S', denominacion: 'FUENTES',
    esquema: 'Esquema 5 RETIE', estado: 'por_vencer',
    producto: 'Fuentes electrónicas para LED', familia: 'Componentes para iluminación',
    referencias: ['Xitanium 60W', 'CertaDrive 22W'], normas: ['RETIE 2024'],
    plantaPrincipal: 'Signify North America Corporation',
    fechaOtorgamiento: '2022-12-15', fechaProximaAuditoria: '2026-06-05', fechaVencimiento: '2026-06-30',
    certificador: 'CIDET', comercialCidet: 'Betty Ochoa', diasRestantes: 33,
  },
  {
    id: '7',  numero: '07796', empresa: 'SIGNIFY COLOMBIANA S.A.S', denominacion: 'LUMINARIAS',
    esquema: 'Esquema 5 RETILAP', estado: 'vencido',
    producto: 'Luminarias de alumbrado público antiguas', familia: 'Iluminación exterior',
    referencias: ['BGP236', 'BGP237', 'BGP281'], normas: ['RETILAP 2024', 'IEC 60598-2-3'],
    plantaPrincipal: 'Signify Luminaires (Shanghai) Co. Ltd',
    fechaOtorgamiento: '2019-02-22', fechaProximaAuditoria: '2024-02-21', fechaVencimiento: '2024-02-21',
    certificador: 'CIDET', comercialCidet: 'Betty Ochoa', diasRestantes: -827,
  },
  {
    id: '8',  numero: '08095', empresa: 'SIGNIFY COLOMBIANA S.A.S', denominacion: 'FUENTES',
    esquema: 'Esquema 5 RETIE', estado: 'suspendido',
    producto: 'Fuentes electrónicas industriales', familia: 'Componentes para iluminación',
    referencias: ['CertaDrive 30W', 'CertaDrive 60W'], normas: ['RETIE 2024'],
    plantaPrincipal: 'Signify North America Corporation',
    fechaOtorgamiento: '2023-03-03', fechaProximaAuditoria: '2025-11-06', fechaVencimiento: '2027-02-21',
    fechaSuspension: '2025-11-06', certificador: 'CIDET', comercialCidet: 'Betty Ochoa', diasRestantes: 269,
    observaciones: 'Suspendido por falta de seguimiento. Pendiente acordar plan de reactivación.',
  },

  // ─── SCHNEIDER ELECTRIC — 5 certs ────────────────────────────────────────
  {
    id: '9',  numero: '08811', empresa: 'SCHNEIDER ELECTRIC DE COLOMBIA', denominacion: 'TABLEROS',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Tableros de distribución eléctrica', familia: 'Tableros y celdas',
    referencias: ['Acti9 iC60N', 'Prisma Plus G', 'Prisma Pack 250'], normas: ['RETIE 2024', 'NTC 3475'],
    plantaPrincipal: 'Schneider Electric Industries Tlaxcala México',
    fechaOtorgamiento: '2024-05-12', fechaProximaAuditoria: '2026-08-12', fechaVencimiento: '2029-05-12',
    certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: 1080,
  },
  {
    id: '10', numero: '08654', empresa: 'SCHNEIDER ELECTRIC DE COLOMBIA', denominacion: 'INTERRUPTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Interruptores automáticos en caja moldeada', familia: 'Protección y maniobra',
    referencias: ['EasyPact CVS', 'NSX100', 'NSX250'], normas: ['RETIE 2024', 'NTC 2116'],
    plantaPrincipal: 'Schneider Electric Manufacturing Reynosa México',
    fechaOtorgamiento: '2024-02-20', fechaProximaAuditoria: '2027-02-20', fechaVencimiento: '2029-02-20',
    certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: 998,
  },
  {
    id: '11', numero: '08502', empresa: 'SCHNEIDER ELECTRIC DE COLOMBIA', denominacion: 'CONTACTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Contactores y relés térmicos', familia: 'Maniobra y mando',
    referencias: ['TeSys D LC1D', 'TeSys F LC1F', 'LRD'], normas: ['RETIE 2024', 'IEC 60947-4-1'],
    plantaPrincipal: 'Schneider Electric Le Vaudreuil Francia',
    fechaOtorgamiento: '2023-11-08', fechaProximaAuditoria: '2026-11-08', fechaVencimiento: '2028-11-08',
    certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: 894,
  },
  {
    id: '12', numero: '08234', empresa: 'SCHNEIDER ELECTRIC DE COLOMBIA', denominacion: 'TRANSFORMADORES',
    esquema: 'Esquema 5 RETIE', estado: 'por_vencer',
    producto: 'Transformadores secos de distribución', familia: 'Transformación',
    referencias: ['Trihal 15kV 500kVA', 'Trihal 15kV 1000kVA'], normas: ['RETIE 2024', 'NTC 1465'],
    plantaPrincipal: 'Schneider Electric Tarragona España',
    fechaOtorgamiento: '2023-01-30', fechaProximaAuditoria: '2026-06-20', fechaVencimiento: '2026-07-10',
    certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: 43,
  },
  {
    id: '13', numero: '08108', empresa: 'SCHNEIDER ELECTRIC DE COLOMBIA', denominacion: 'TABLEROS',
    esquema: 'Esquema 5 RETIE', estado: 'suspendido',
    producto: 'Gabinetes metálicos para tableros', familia: 'Tableros y celdas',
    referencias: ['Spacial S3D', 'Spacial SF'], normas: ['RETIE 2024'],
    plantaPrincipal: 'Schneider Electric Industries Tlaxcala México',
    fechaOtorgamiento: '2022-09-05', fechaProximaAuditoria: '2025-09-05', fechaVencimiento: '2027-09-05',
    fechaSuspension: '2026-01-12', certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: 465,
    observaciones: 'Suspendido por hallazgos sin cierre en última auditoría.',
  },

  // ─── LEGRAND — 4 certs ───────────────────────────────────────────────────
  {
    id: '14', numero: '08723', empresa: 'LEGRAND COLOMBIA S.A.', denominacion: 'INTERRUPTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Interruptores de uso general', familia: 'Aparamenta',
    referencias: ['Galea Life', 'Plexo 55', 'Niloé'], normas: ['RETIE 2024', 'NTC 1337'],
    plantaPrincipal: 'Legrand Limoges Francia',
    fechaOtorgamiento: '2024-03-15', fechaProximaAuditoria: '2027-03-15', fechaVencimiento: '2029-03-15',
    certificador: 'CIDET', comercialCidet: 'Carlos Restrepo', diasRestantes: 1021,
  },
  {
    id: '15', numero: '08597', empresa: 'LEGRAND COLOMBIA S.A.', denominacion: 'TOMACORRIENTES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Tomacorrientes con polo a tierra', familia: 'Aparamenta',
    referencias: ['Mosaic 2P+T', 'Galea Life 2P+T'], normas: ['RETIE 2024', 'NTC 1650'],
    plantaPrincipal: 'Legrand Limoges Francia',
    fechaOtorgamiento: '2024-01-08', fechaProximaAuditoria: '2027-01-08', fechaVencimiento: '2029-01-08',
    certificador: 'CIDET', comercialCidet: 'Carlos Restrepo', diasRestantes: 955,
  },
  {
    id: '16', numero: '08401', empresa: 'LEGRAND COLOMBIA S.A.', denominacion: 'CANALIZACIONES',
    esquema: 'Esquema 4 RETIE', estado: 'vigente',
    producto: 'Canalizaciones plásticas', familia: 'Canalización y soporte',
    referencias: ['DLP 50x80', 'DLP 50x105', 'Mosaic'], normas: ['RETIE 2024', 'NTC 5538'],
    plantaPrincipal: 'Legrand Pau Francia',
    fechaOtorgamiento: '2023-08-22', fechaProximaAuditoria: '2026-08-22', fechaVencimiento: '2028-08-22',
    certificador: 'CIDET', comercialCidet: 'Carlos Restrepo', diasRestantes: 816,
  },
  {
    id: '17', numero: '08145', empresa: 'LEGRAND COLOMBIA S.A.', denominacion: 'BREAKERS',
    esquema: 'Esquema 5 RETIE', estado: 'por_vencer',
    producto: 'Interruptores automáticos modulares', familia: 'Protección y maniobra',
    referencias: ['DX³ 6000', 'DX³ 10000'], normas: ['RETIE 2024', 'NTC 2116'],
    plantaPrincipal: 'Legrand Antibes Francia',
    fechaOtorgamiento: '2022-11-12', fechaProximaAuditoria: '2026-06-25', fechaVencimiento: '2026-07-25',
    certificador: 'CIDET', comercialCidet: 'Carlos Restrepo', diasRestantes: 58,
  },

  // ─── CENTELSA — 4 certs ──────────────────────────────────────────────────
  {
    id: '18', numero: '09120', empresa: 'CENTELSA S.A.', denominacion: 'CONDUCTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Cables de cobre aislados THHN/THWN', familia: 'Conductores aislados',
    referencias: ['THHN 12 AWG', 'THWN 10 AWG', 'THHN 8 AWG'], normas: ['RETIE 2024', 'NTC 359'],
    plantaPrincipal: 'CENTELSA Yumbo Colombia',
    fechaOtorgamiento: '2023-10-15', fechaProximaAuditoria: '2026-10-15', fechaVencimiento: '2028-10-15',
    certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: 870,
  },
  {
    id: '19', numero: '09045', empresa: 'CENTELSA S.A.', denominacion: 'CONDUCTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Cables de potencia para media tensión', familia: 'Conductores aislados',
    referencias: ['MV-90 15kV', 'MV-90 25kV'], normas: ['RETIE 2024', 'NTC 2186'],
    plantaPrincipal: 'CENTELSA Yumbo Colombia',
    fechaOtorgamiento: '2023-06-08', fechaProximaAuditoria: '2026-06-08', fechaVencimiento: '2028-06-08',
    certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: 741,
  },
  {
    id: '20', numero: '08956', empresa: 'CENTELSA S.A.', denominacion: 'CONDUCTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Cables aluminio aislado', familia: 'Conductores aislados',
    referencias: ['XHHW-2 4/0 AWG', 'XHHW-2 250 kcmil'], normas: ['RETIE 2024', 'NTC 1332'],
    plantaPrincipal: 'CENTELSA Yumbo Colombia',
    fechaOtorgamiento: '2023-02-14', fechaProximaAuditoria: '2026-08-10', fechaVencimiento: '2028-02-14',
    certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: 627,
  },
  {
    id: '21', numero: '08812', empresa: 'CENTELSA S.A.', denominacion: 'CONDUCTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vencido',
    producto: 'Cables apantallados control', familia: 'Conductores aislados',
    referencias: ['RZ1-K 2x1.5mm²', 'RZ1-K 3x2.5mm²'], normas: ['RETIE 2024', 'NTC 5326'],
    plantaPrincipal: 'CENTELSA Yumbo Colombia',
    fechaOtorgamiento: '2021-02-10', fechaProximaAuditoria: '2026-02-10', fechaVencimiento: '2026-02-10',
    certificador: 'CIDET', comercialCidet: 'Luisa Betancur', diasRestantes: -107,
  },

  // ─── ABB — 3 certs ───────────────────────────────────────────────────────
  {
    id: '22', numero: '08877', empresa: 'ABB LTDA', denominacion: 'MOTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Motores eléctricos trifásicos IE3', familia: 'Máquinas rotativas',
    referencias: ['M3BP 132S', 'M3BP 160M', 'M3BP 200L'], normas: ['RETIE 2024', 'NTC 3477'],
    plantaPrincipal: 'ABB Tlaquepaque México',
    fechaOtorgamiento: '2024-06-01', fechaProximaAuditoria: '2027-06-01', fechaVencimiento: '2029-06-01',
    certificador: 'CIDET', comercialCidet: 'David Velásquez', diasRestantes: 1100,
  },
  {
    id: '23', numero: '08612', empresa: 'ABB LTDA', denominacion: 'VARIADORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Variadores de velocidad para motores', familia: 'Accionamientos',
    referencias: ['ACS580-01', 'ACS580-04'], normas: ['RETIE 2024', 'IEC 61800-5-1'],
    plantaPrincipal: 'ABB Helsinki Finlandia',
    fechaOtorgamiento: '2024-01-22', fechaProximaAuditoria: '2027-01-22', fechaVencimiento: '2029-01-22',
    certificador: 'CIDET', comercialCidet: 'David Velásquez', diasRestantes: 969,
  },
  {
    id: '24', numero: '08023', empresa: 'ABB LTDA', denominacion: 'MOTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vencido',
    producto: 'Motores eléctricos antiguos IE2', familia: 'Máquinas rotativas',
    referencias: ['M2BAX 132', 'M2BAX 160'], normas: ['RETIE 2024'],
    plantaPrincipal: 'ABB Tlaquepaque México',
    fechaOtorgamiento: '2018-05-14', fechaProximaAuditoria: '2023-05-14', fechaVencimiento: '2023-05-14',
    certificador: 'CIDET', comercialCidet: 'David Velásquez', diasRestantes: -1110,
  },

  // ─── ILUMINACIONES ANDINAS — 1 cert ──────────────────────────────────────
  {
    id: '25', numero: 'IA-0245', empresa: 'ILUMINACIONES ANDINAS S.A.S', denominacion: 'LUMINARIAS',
    esquema: 'Esquema 5 RETILAP', estado: 'vigente',
    producto: 'Luminarias LED para vías', familia: 'Iluminación exterior',
    referencias: ['LV-80W', 'LV-120W'], normas: ['RETILAP 2024'],
    plantaPrincipal: 'Planta Medellín',
    fechaOtorgamiento: '2024-09-25', fechaProximaAuditoria: '2026-09-25', fechaVencimiento: '2029-09-25',
    certificador: 'CIDET', comercialCidet: 'Juan David Agudelo', diasRestantes: 1216,
  },

  // ─── PROCABLES — 2 certs ─────────────────────────────────────────────────
  {
    id: '26', numero: '08742', empresa: 'PROCABLES S.A.S', denominacion: 'CONDUCTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Cables RZ1-K libres de halógenos', familia: 'Conductores aislados',
    referencias: ['RZ1-K 0.6/1kV 3x6', 'RZ1-K 0.6/1kV 3x10'], normas: ['RETIE 2024', 'NTC 5326'],
    plantaPrincipal: 'PROCABLES Bogotá Colombia',
    fechaOtorgamiento: '2023-12-04', fechaProximaAuditoria: '2026-12-04', fechaVencimiento: '2028-12-04',
    certificador: 'CIDET', comercialCidet: 'Juan David Agudelo', diasRestantes: 920,
  },
  {
    id: '27', numero: '08311', empresa: 'PROCABLES S.A.S', denominacion: 'CONDUCTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Cables encauchetados ST', familia: 'Conductores flexibles',
    referencias: ['ST 3x14 AWG', 'ST 3x12 AWG'], normas: ['RETIE 2024', 'NTC 4116'],
    plantaPrincipal: 'PROCABLES Bogotá Colombia',
    fechaOtorgamiento: '2023-04-20', fechaProximaAuditoria: '2026-08-20', fechaVencimiento: '2028-04-20',
    certificador: 'CIDET', comercialCidet: 'Juan David Agudelo', diasRestantes: 692,
  },

  // ─── SIEMENS — 2 certs ───────────────────────────────────────────────────
  {
    id: '28', numero: '08533', empresa: 'SIEMENS S.A.', denominacion: 'BREAKERS',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Interruptores automáticos termo-magnéticos', familia: 'Protección y maniobra',
    referencias: ['5SL6', '3VA1'], normas: ['RETIE 2024', 'NTC 2116'],
    plantaPrincipal: 'Siemens Cornellà España',
    fechaOtorgamiento: '2023-09-18', fechaProximaAuditoria: '2026-09-18', fechaVencimiento: '2028-09-18',
    certificador: 'CIDET', comercialCidet: 'Carlos Restrepo', diasRestantes: 843,
  },
  {
    id: '29', numero: '08176', empresa: 'SIEMENS S.A.', denominacion: 'CONTACTORES',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Contactores para mando de motores', familia: 'Maniobra y mando',
    referencias: ['Sirius 3RT', 'Sirius 3RH'], normas: ['RETIE 2024', 'IEC 60947-4-1'],
    plantaPrincipal: 'Siemens Cornellà España',
    fechaOtorgamiento: '2023-01-15', fechaProximaAuditoria: '2026-07-15', fechaVencimiento: '2028-01-15',
    certificador: 'CIDET', comercialCidet: 'Carlos Restrepo', diasRestantes: 597,
  },

  // ─── EATON — 1 cert (cliente menor que mostramos para variedad) ──────────
  {
    id: '30', numero: '08988', empresa: 'EATON INDUSTRIES COLOMBIA S.A.S', denominacion: 'TABLEROS',
    esquema: 'Esquema 5 RETIE', estado: 'vigente',
    producto: 'Tableros para automatización industrial', familia: 'Tableros y celdas',
    referencias: ['xEffect', 'xPole'], normas: ['RETIE 2024'],
    plantaPrincipal: 'Eaton Tlalpan México',
    fechaOtorgamiento: '2024-07-08', fechaProximaAuditoria: '2027-07-08', fechaVencimiento: '2029-07-08',
    certificador: 'CIDET', comercialCidet: 'David Velásquez', diasRestantes: 1137,
  },
]

export const certificateDetail: CertificateDetail = {
  ...certificates[1],
  fabricantes: [
    'SIGNIFY LUMINAIRES (SHANGHAI) CO.LTD CHINA',
    'SIGNIFY BV',
    'SIGNIFY NORTH AMERICA CORPORATION',
    'Signify Luminaires México, S.A. de C.V.'
  ],
  fechaSeguimiento1: '2022-02-21',
  fechaSeguimiento2: '2023-02-21',
  norma: 'REGLAMENTO TÉCNICO SALVADOREÑO RTS 29.02.01:21',
  plantas: [
    {
      nombre: 'SIGNIFY LUMINAIRES (SHANGHAI) CO. Ltd',
      pais: 'China',
      codigoISO9001: 'NL16/B18844057',
      fechaVencimientoISO: '2027-01-24',
      urlCertificado: 'https://cidet.sharepoint.com/sites/fpoid'
    },
    {
      nombre: 'SIGNIFY NETHERLANDS B.V.',
      pais: 'Países Bajos',
      codigoISO9001: 'NL16/B18844057',
      fechaVencimientoISO: '2027-01-24',
      urlCertificado: 'https://cidet.sharepoint.com/sites/fpoid'
    }
  ],
  ensayos: [
    {
      referencia: 'BOMBILLAS DE SODIO 600W',
      ensayo: 'Características Eléctricas y Flujo Luminoso',
      fecha: '2021-05-20',
      laboratorio: 'CIDET',
      acreditado: false,
      metodo: 'ET 820:2013 numeral 7.2.6',
      resultado: 'No cumple'
    },
    {
      referencia: 'LAMP. SON-T PLUS 600W E40',
      ensayo: 'Spectroradiometric summary test report',
      fecha: '2021-05-20',
      laboratorio: 'Lighting Test Center Europe Philips Lighting Belgium NV',
      acreditado: false,
      metodo: 'EN IEC 60662'
    }
  ]
}

export const processStages: ProcessStage[] = [
  { id: '1.1', etapa: 'Oferta creada', responsable: 'Juan David Agudelo Hoyos', fechaInicio: '2024-12-15', fechaFin: '2024-12-20', estado: 'completado' },
  { id: '1.2', etapa: 'Aceptación de la oferta', responsable: 'Juan David Agudelo Hoyos', fechaInicio: '2024-12-21', fechaFin: '2025-01-05', estado: 'completado' },
  { id: '1.3', etapa: 'Auditor asignado', responsable: 'Etimagdiel Ramírez Sánchez', fechaInicio: '2025-01-06', fechaFin: '2025-01-10', estado: 'completado' },
  { id: '1.4', etapa: 'Documentos revisados', responsable: 'Gabriel Jaime Pérez Jiménez', fechaInicio: '2025-01-11', fechaFin: '2025-01-20', estado: 'completado' },
  { id: '1.5', etapa: 'Plan de auditoría', responsable: 'Gabriel Jaime Pérez Jiménez', fechaInicio: '2025-01-21', fechaFin: '2025-02-01', estado: 'completado' },
  { id: '2.1', etapa: 'Acta de apertura', responsable: 'Gabriel Jaime Pérez Jiménez', fechaInicio: '2025-02-05', fechaFin: '2025-02-05', estado: 'completado' },
  { id: '2.2', etapa: 'Evaluación Sis. Producción', responsable: 'Gabriel Jaime Pérez Jiménez', fechaInicio: '2025-02-06', fechaFin: '2025-02-15', estado: 'completado' },
  { id: '2.3', etapa: 'Uso de marca', responsable: 'Gabriel Jaime Pérez Jiménez', fechaInicio: '2025-02-16', fechaFin: '2025-02-20', estado: 'completado' },
  { id: '2.4', etapa: 'Requisitos inspección', responsable: 'Gabriel Jaime Pérez Jiménez', fechaInicio: '2025-02-21', fechaFin: '2025-03-01', estado: 'en_progreso' },
  { id: '2.5', etapa: 'Marcación de muestras', responsable: 'Gabriel Jaime Pérez Jiménez', fechaInicio: '2025-03-02', estado: 'pendiente' },
  { id: '2.6', etapa: 'Envío de muestras', responsable: 'Gabriel Jaime Pérez Jiménez', estado: 'pendiente' },
  { id: '2.7', etapa: 'Reportes de ensayos', responsable: 'Gabriel Jaime Pérez Jiménez', estado: 'pendiente' },
  { id: '2.8', etapa: 'Controversias', responsable: 'Gabriel Jaime Pérez Jiménez', estado: 'pendiente' },
  { id: '2.9', etapa: 'Entrega Informe Auditoría', responsable: 'Gabriel Jaime Pérez Jiménez', estado: 'pendiente' },
  { id: '3.1', etapa: 'Decisión final', responsable: 'Etimagdiel Ramírez Sánchez', estado: 'pendiente' }
]

export const contacts: Contact[] = [
  { nombre: 'Betty Ochoa', telefono: '(604) 444 12 11 EXT 188', email: 'betty.ochoa@cidet.org.co', rol: 'Comercial' },
  { nombre: 'David Velásquez', telefono: '(604) 444 12 11 EXT 188', email: 'david.velasquez@cidet.org.co', rol: 'Técnico' },
  { nombre: 'Etimagdiel Ramírez', telefono: '(604) 444 12 11 EXT 188', email: 'etimagdiel.ramirez@cidet.org.co', rol: 'Auditor Líder' },
  { nombre: 'Gabriel Pérez', telefono: '(604) 444 12 11 EXT 188', email: 'gabriel.perez@cidet.org.co', rol: 'Auditor' }
]

// Counts del listado de certificados (30 items en `certificates`). Los KPIs
// del Home y de la sección Certificados consumen estos números — por eso
// deben cuadrar exactamente con la distribución del array.
export const summaryStats = {
  vencidos: 3,
  suspendidos: 2,
  porVencer: 5,
  vigentes: 20,
  total: 30
}

// Agregado de portafolio CIDET (vista interna). Suma de varios clientes
// activos — refleja la "vista bosque" que pidieron en la reunión, pero
// vive en la vista admin, no en la vista cliente.
export const cidetPortfolioStats = {
  vencidos: 18,
  suspendidos: 11,
  porVencer: 47,
  vigentes: 312,
  total: 388
}

export const chartData = [
  { periodo: 'Feb 2024', vencidos: 2, porVencer: 0, vigentes: 0 },
  { periodo: 'Feb 2025', vencidos: 0, porVencer: 1, vigentes: 2 },
  { periodo: 'Jun 2026', vencidos: 0, porVencer: 0, vigentes: 2 }
]
