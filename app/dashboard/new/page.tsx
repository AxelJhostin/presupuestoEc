import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/getUser'
import { Calculator, FileText, ArrowLeft, Zap, PenLine } from 'lucide-react'
import PlantillasSelector from '@/components/PlantillasSelector'

export default async function NewPresupuestoPage() {
  const user = getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-4 bg-slate-200" />
          <h1 className="text-base font-semibold text-slate-900">Nuevo presupuesto</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            ¿Cómo quieres armar tu presupuesto?
          </h2>
          <p className="text-slate-500">
            Elige el modo que mejor se adapte a tu proyecto
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Modo Calculadora */}
          <Link
            href="/dashboard/new/calculator"
            className="group bg-white border-2 border-slate-200 rounded-xl p-8 hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-slate-900">Modo Calculadora</h3>
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                <Zap className="w-3 h-3" />
                NEC
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Ingresa las medidas y la app calcula automáticamente los materiales según la Norma Ecuatoriana de la Construcción.
            </p>
            <div className="space-y-1.5">
              {['Losa maciza', 'Columna rectangular', 'Pintura', 'Mampostería', 'Cerámica', 'Contrapiso'].map(e => (
                <div key={e} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  {e}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
              Usar modo calculadora
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </Link>

          {/* Modo Libre */}
          <Link
            href="/dashboard/new/free"
            className="group bg-white border-2 border-slate-200 rounded-xl p-8 hover:border-slate-400 hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-200 transition-colors">
              <FileText className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-slate-900">Modo Libre</h3>
              <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                <PenLine className="w-3 h-3" />
                Manual
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Construye tu presupuesto fila por fila con precios y cantidades personalizadas. Con catálogo de materiales para ir más rápido.
            </p>
            <div className="space-y-1.5">
              {['Total control sobre cada item', 'Catálogo de materiales incluido', 'Agrega tus propios rubros', 'Cualquier tipo de obra'].map(e => (
                <div key={e} className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-1 h-1 bg-slate-400 rounded-full" />
                  {e}
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-1 text-sm font-medium text-slate-600 group-hover:gap-2 transition-all">
              Usar modo libre
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </Link>
        </div>

        {/* Plantillas guardadas */}
        <div className="mt-10">
          <PlantillasSelector />
        </div>
      </main>
    </div>
  )
}