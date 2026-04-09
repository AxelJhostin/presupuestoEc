import { FileText, Calculator } from 'lucide-react'

interface Props {
  total: number
  calculadora: number
  libre: number
}

export default function StatsBar({ total, calculadora, libre }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-10">
      <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total</p>
        <p className="text-2xl font-bold text-slate-900">{total}</p>
        <p className="text-xs text-slate-400 mt-0.5">presupuestos</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Calculator className="w-3 h-3 text-blue-500" />
          <p className="text-xs text-slate-400 uppercase tracking-wide">Calculadora</p>
        </div>
        <p className="text-2xl font-bold text-slate-900">{calculadora}</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg px-5 py-4">
        <div className="flex items-center gap-1.5 mb-1">
          <FileText className="w-3 h-3 text-slate-400" />
          <p className="text-xs text-slate-400 uppercase tracking-wide">Libre</p>
        </div>
        <p className="text-2xl font-bold text-slate-900">{libre}</p>
      </div>
    </div>
  )
}