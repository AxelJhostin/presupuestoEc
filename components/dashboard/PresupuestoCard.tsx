import Link from 'next/link'
import { Calculator, FileText } from 'lucide-react'

interface Presupuesto {
  id: string
  nombre: string
  modo: string
  fecha: string
  total: number
}

export default function PresupuestoCard({ p }: { p: Presupuesto }) {
  return (
    <Link
      href={`/dashboard/${p.id}`}
      className="bg-white border border-slate-200 rounded-lg px-5 py-4 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
          p.modo === 'calculadora' ? 'bg-blue-50' : 'bg-slate-100'
        }`}>
          {p.modo === 'calculadora'
            ? <Calculator className="w-4 h-4 text-blue-600" />
            : <FileText className="w-4 h-4 text-slate-500" />
          }
        </div>
        <div>
          <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{p.nombre}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(p.fecha).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' })}
            {' · '}
            <span className="capitalize">{p.modo}</span>
          </p>
        </div>
      </div>
      <span className="font-bold text-slate-900">${Number(p.total).toFixed(2)}</span>
    </Link>
  )
}