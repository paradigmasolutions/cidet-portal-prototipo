import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface ChartDataItem {
  periodo: string
  vencidos: number
  porVencer: number
  vigentes: number
}

const COLORS = {
  vencidos: '#B42318',
  porVencer: '#B54708',
  vigentes: '#128760',
}

const tooltipStyle = {
  backgroundColor: 'white',
  border: 'none',
  borderRadius: '12px',
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)',
  padding: '12px 16px',
}

export function CertificateBarChart({ data }: { data: ChartDataItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="30%">
        <XAxis
          dataKey="periodo"
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="vencidos" stackId="a" fill={COLORS.vencidos} name="Vencidos" radius={[0, 0, 0, 0]} />
        <Bar dataKey="porVencer" stackId="a" fill={COLORS.porVencer} name="Por Vencer" radius={[0, 0, 0, 0]} />
        <Bar dataKey="vigentes" stackId="a" fill={COLORS.vigentes} name="Vigentes" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface PieChartProps {
  data: { name: string; value: number; color: string }[]
}

export function CertificatePieChart({ data }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-sm text-gray-600 ml-1">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
