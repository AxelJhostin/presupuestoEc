import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-blue-400" />
        </div>
        <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-900 mb-3">Página no encontrada</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          La página que buscas no existe o fue movida. Verifica la URL o vuelve al inicio.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Ir al dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm text-slate-500 font-medium">PresupuestoEC</span>
        </div>
      </div>
    </div>
  )
}