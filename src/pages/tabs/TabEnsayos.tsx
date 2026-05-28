import { formatDate } from '../../lib/utils'
import { FlaskConical } from 'lucide-react'
import { certificateDetail } from '../../data/mockData'

export function TabEnsayos() {
  const { ensayos } = certificateDetail

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <FlaskConical size={16} className="text-cidet-cyan" />
        <h3 className="font-semibold text-gray-900">Ensayos Realizados</h3>
        <span className="text-xs text-gray-400 font-medium ml-1">({ensayos.length})</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Referencia</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Ensayo</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Laboratorio</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Método</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Resultado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {ensayos.map((ensayo, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-5 py-3.5 font-medium text-gray-900 max-w-[180px]">
                  <p className="truncate" title={ensayo.referencia}>{ensayo.referencia}</p>
                </td>
                <td className="px-5 py-3.5 text-gray-700">{ensayo.ensayo}</td>
                <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatDate(ensayo.fecha)}</td>
                <td className="px-5 py-3.5 text-gray-500 text-xs max-w-[180px]">
                  <p className="truncate" title={ensayo.laboratorio}>{ensayo.laboratorio}</p>
                </td>
                <td className="px-5 py-3.5">
                  <code className="text-xs bg-gray-50 px-2 py-1 rounded font-mono">{ensayo.metodo}</code>
                </td>
                <td className="px-5 py-3.5">
                  {ensayo.resultado ? (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      ensayo.resultado === 'No cumple'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {ensayo.resultado}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
