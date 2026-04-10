import { FileText, Calculator, CheckCircle2, DollarSign } from 'lucide-react'

interface Props {
  total: number
  calculadora: number
  libre: number
  aprobados: number
  totalFacturado: number
}

export default function StatsBar({ total, calculadora, aprobados, totalFacturado }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      <div className="bg-white border border-slate-200 rounded-xl px-5 py-5 flex items-center gap-4">
        <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{total}</p>
          <p className="text-xs text-slate-400 mt-0.5">Presupuestos totales</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl px-5 py-5 flex items-center gap-4">
        <div className="w-11 h-11 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{calculadora}</p>
          <p className="text-xs text-slate-400 mt-0.5">Modo calculadora NEC</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl px-5 py-5 flex items-center gap-4">
        <div className="w-11 h-11 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{aprobados}</p>
          <p className="text-xs text-slate-400 mt-0.5">Aprobados por cliente</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl px-5 py-5 flex items-center gap-4">
        <div className="w-11 h-11 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
          <DollarSign className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">${totalFacturado.toFixed(0)}</p>
          <p className="text-xs text-slate-400 mt-0.5">En aprobados + ejecución</p>
        </div>
      </div>

    </div>
  )
}