import ReactECharts from 'echarts-for-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { KpiCardGrid } from '../components/dashboard/KpiCard'
import { cidetPortfolioStats } from '../data/mockData'

// Hoy en el demo (2026-05-28). Hardcoded para que la ventana móvil del
// gráfico (3 meses atrás / 6 meses adelante) cuente siempre lo mismo
// independiente del día en que se abra el prototipo.
const TODAY = new Date('2026-05-28')

// ─── Datos de la franja móvil de 9 meses ────────────────────────────────
//
// Distribución sintética plausible de la cartera CIDET completa (no del
// universo del cliente actual): vencidos por mes en los 3 meses pasados,
// próximos a vencer por mes en los 6 futuros. En producción esto vendrá
// de un agregado sobre certification.certificate filtrado por mes de
// `expiration_at`.
const monthlyMock: { vencidos: number; porVencer: number }[] = [
  { vencidos: 14, porVencer: 0 },   // hoy − 3
  { vencidos: 9,  porVencer: 0 },   // hoy − 2
  { vencidos: 6,  porVencer: 0 },   // hoy − 1
  { vencidos: 0,  porVencer: 18 },  // mes actual
  { vencidos: 0,  porVencer: 26 },  // hoy + 1
  { vencidos: 0,  porVencer: 31 },  // hoy + 2
  { vencidos: 0,  porVencer: 22 },  // hoy + 3
  { vencidos: 0,  porVencer: 19 },  // hoy + 4
  { vencidos: 0,  porVencer: 15 },  // hoy + 5
]

interface MonthBucket {
  label: string
  isPast: boolean
  vencidos: number
  porVencer: number
}

function buildMonthlyTimeline(): MonthBucket[] {
  const buckets: MonthBucket[] = []
  const start = new Date(TODAY.getFullYear(), TODAY.getMonth() - 3, 1)
  for (let i = 0; i < 9; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const isPast = next.getTime() <= TODAY.getTime()
    const monthLabel = d.toLocaleDateString('es-CO', { month: 'short', year: '2-digit' })
    buckets.push({ label: monthLabel, isPast, ...monthlyMock[i] })
  }
  return buckets
}

// ─── Charts ──────────────────────────────────────────────────────────────

function VencimientosTimelineChart() {
  const buckets = buildMonthlyTimeline()
  const todayIdx = buckets.findIndex((b) => !b.isPast)

  const option = {
    // bottom alto: deja aire entre los labels del eje X y la leyenda.
    grid: { left: 36, right: 12, top: 16, bottom: 56 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 11, color: '#6b768e' },
      data: ['Vencidos', 'Por vencer'],
    },
    xAxis: {
      type: 'category',
      data: buckets.map((b) => b.label),
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#6b768e' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { fontSize: 11, color: '#6b768e' },
      minInterval: 1,
    },
    series: [
      {
        name: 'Vencidos',
        type: 'bar',
        stack: 'mes',
        data: buckets.map((b) => b.vencidos),
        itemStyle: { color: '#ef4444', borderRadius: [3, 3, 0, 0] },
        emphasis: { focus: 'series' },
      },
      {
        name: 'Por vencer',
        type: 'bar',
        stack: 'mes',
        data: buckets.map((b) => b.porVencer),
        itemStyle: { color: '#f59e0b', borderRadius: [3, 3, 0, 0] },
        emphasis: { focus: 'series' },
      },
    ],
    // Marca visual de la línea de Hoy entre el último mes pasado y el primero futuro.
    graphic: todayIdx > 0 ? [
      {
        type: 'group',
        left: `calc(${36 + (todayIdx - 0.5) * ((100 - 36 - 12) / buckets.length)}%)`,
        children: [],
      },
    ] : [],
  }

  return <ReactECharts option={option} style={{ height: 360, width: '100%' }} notMerge lazyUpdate />
}

function EstadoDonutChart() {
  const option = {
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 11, color: '#6b768e' },
    },
    series: [
      {
        type: 'pie',
        radius: ['58%', '82%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: cidetPortfolioStats.vigentes, name: 'Vigentes', itemStyle: { color: '#178f5b' } },
          { value: cidetPortfolioStats.porVencer, name: 'Por vencer', itemStyle: { color: '#f59e0b' } },
          { value: cidetPortfolioStats.vencidos, name: 'Vencidos', itemStyle: { color: '#ef4444' } },
          { value: cidetPortfolioStats.suspendidos, name: 'Suspendidos', itemStyle: { color: '#6b768e' } },
        ],
      },
    ],
  }
  return <ReactECharts option={option} style={{ height: 360, width: '100%' }} notMerge lazyUpdate />
}

// ─── Página ──────────────────────────────────────────────────────────────

export function PortafolioPage() {
  return (
    <>
      <PageHeader
        title="Portafolio CIDET"
        description="Lectura agregada de la cartera para identificar dónde priorizar la gestión."
      />

      <div className="mb-5">
        <KpiCardGrid stats={cidetPortfolioStats} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Vencimientos · ventana móvil de 9 meses</CardTitle>
          </CardHeader>
          <CardContent>
            <VencimientosTimelineChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <EstadoDonutChart />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
