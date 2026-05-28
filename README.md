# Portal de Clientes CIDET — Prototipo

Prototipo navegable del **Portal de Clientes CIDET**, mantenido por
[Paradigma Solutions](https://paradigmasolutions.co/) como artefacto de
discusión con CIDET.

> Es un **prototipo de UI**. Toda la data es mock. No hay backend ni
> persistencia real; el botón "Entrar" funciona sin credenciales.

## Qué se puede mostrar

- **Portafolio CIDET** (`/portafolio`) — KPI cards + gráfico de vencimientos
  con ventana móvil de 9 meses + distribución por estado.
- **Procesos** (`/`) — 4 KPI clickeables como filtro (Alertas · Acción
  cliente · Acción CIDET · En curso), procesos jerárquicos
  Negocio → Certificado → Actividad con drill-down, sección de alertas
  con filtros por tipo.
- **Detalle del proceso** (`/procesos?certificate=…`) — Gantt con plan vs
  real, retrasos visibles, contacto de la etapa activa.
- **Certificados** (`/certificados`) — KPI filtro, búsqueda, vista Tabla /
  Archivo, ordenamiento, paginación, side panel flotante al seleccionar,
  y página de detalle por pestañas (`/certificados/:numero`) con
  Trazabilidad histórica.

## Stack

- [Vite](https://vitejs.dev/) + React 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Frappe Gantt](https://frappe.io/gantt) para el detalle del proceso
- [Apache ECharts](https://echarts.apache.org/) (`echarts-for-react`)
  para los gráficos del Portafolio
- [Lucide](https://lucide.dev/) para iconografía
- [React Router](https://reactrouter.com/)

## Cómo correrlo localmente

```bash
npm install
npm run dev
```

Por defecto abre en [http://localhost:5173](http://localhost:5173).

### Modos de demo

El login asigna un modo a partir del email (o vía query `?demo=…`):

| Modo | Cómo activar | Qué cambia |
|---|---|---|
| `internal` (default) | login con cualquier email o `?demo=internal` | Vista CIDET con selector de cliente |
| `large_client` | email no-@cidet o `?demo=large_client` | Vista de cliente con cartera grande |
| `small_client` | email con `andinas` / `peque` o `?demo=small_client` | Vista de cliente con un solo certificado |

## Build

```bash
npm run build
```

El output queda en `dist/`. Listo para servir como estático en Vercel,
Netlify, etc.

## Licencia

Prototipo propiedad de Paradigma Solutions / CIDET. Uso interno para
discusión del producto.
