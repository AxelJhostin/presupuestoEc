import Link from 'next/link'
import { FolderOpen } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="bg-white border border-dashed border-slate-300 rounded-lg py-20 text-center">
      <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
      <p className="text-slate-500 font-medium">Aún no tienes presupuestos</p>
      <p className="text-slate-400 text-sm mt-1">Crea tu primer presupuesto para comenzar</p>
      <Link
        href="/dashboard/new"
        className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
      >
        Crear presupuesto
      </Link>
    </div>
  )
}