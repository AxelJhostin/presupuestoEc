'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-6xl font-bold text-red-500 mb-2">500</h1>
        <h2 className="text-xl font-bold text-slate-900 mb-3">Algo salió mal</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Ocurrió un error inesperado. Puedes intentar recargar la página o volver al inicio.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Ir al dashboard
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-slate-300 mt-6">
            Código de error: {error.digest}
          </p>
        )}
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