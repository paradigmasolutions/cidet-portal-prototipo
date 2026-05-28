// Declaraciones mínimas para `frappe-gantt`. El paquete no incluye tipos
// oficiales (al 2026-05); declaramos solo el subset que usamos en
// ProcesosPage para que la compilación TS estricta no se queje.

declare module 'frappe-gantt' {
  export interface FrappeTask {
    id: string
    name: string
    start: Date | string
    end: Date | string
    progress?: number
    custom_class?: string
    dependencies?: string
  }

  export interface FrappePopupContext {
    task: FrappeTask
    set_title(value: string): void
    set_subtitle(value: string): void
    set_details(value: string): void
  }

  export interface FrappeOptions {
    view_mode?: 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month' | string
    bar_height?: number
    bar_corner_radius?: number
    padding?: number
    header_height?: number
    column_width?: number
    readonly?: boolean
    popup?: (ctx: FrappePopupContext) => void
  }

  export default class Gantt {
    constructor(element: HTMLElement, tasks: FrappeTask[], options?: FrappeOptions)
  }
}
