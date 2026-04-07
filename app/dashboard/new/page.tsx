import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Calculator, FileText } from 'lucide-react'

export default async function NewPresupuestoPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 text-sm">
          ← Volver
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Nuevo presupuesto</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">¿Cómo quieres armar tu presupuesto?</h2>
          <p className="text-slate-500 mt-2 text-sm">Elige el modo que mejor se adapte a tu proyecto</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Modo Calculadora */}
          <Link
            href="/dashboard/new/calculator"
            className="group bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Modo Calculadora</h3>
            <p className="text-sm text-slate-500">
              Ingresa las medidas y la app calcula automáticamente los materiales según la NEC.
            </p>
            <div className="mt-4 text-xs text-blue-600 font-medium">
              Losa · Columna · Pintura
            </div>
          </Link>

          {/* Modo Libre */}
          <Link
            href="/dashboard/new/free"
            className="group bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-400 hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Modo Libre</h3>
            <p className="text-sm text-slate-500">
              Construye tu presupuesto fila por fila con precios y cantidades personalizadas.
            </p>
            <div className="mt-4 text-xs text-slate-500 font-medium">
              Total control · Sin restricciones
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}