import Link from 'next/link'
import { Calculator, FileText } from 'lucide-react'

interface Presupuesto {
  id: string
  nombre: string
  modo: string
  fecha: string
  total: number
  numero?: number
  estado?: string
  cliente_nombre?: string
}

const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
  borrador: { label: 'Borrador', color: 'bg-slate-100 text-slate-500' },
  enviado: { label: 'Enviado', color: 'bg-blue-50 text-blue-600' },
  aprobado: { label: 'Aprobado', color: 'bg-green-50 text-green-600' },
  en_ejecucion: { label: 'En ejecución', color: 'bg-amber-50 text-amber-600' },
}

export default function PresupuestoCard({ p }: { p: Presupuesto }) {
  const estado = ESTADO_CONFIG[p.estado || 'borrador']

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
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
              {p.nombre}
            </p>
            {p.numero && (
              <span className="text-xs text-slate-400 font-mono">
                P-{String(p.numero).padStart(3, '0')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-slate-400">
              {new Date(p.fecha).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' })}
              {' · '}
              <span className="capitalize">{p.modo}</span>
            </p>
            {p.cliente_nombre && (
              <span className="text-xs text-slate-400">· {p.cliente_nombre}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${estado.color}`}>
          {estado.label}
        </span>
        <span className="font-bold text-slate-900">${Number(p.total).toFixed(2)}</span>
      </div>
    </Link>
  )
}