import Link from 'next/link'
import { Calculator, FileText, Download, CheckCircle2, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-slate-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-slate-900 font-bold">PresupuestoEC</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Ingresar
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Hecho para ingenieros en Ecuador
          </div>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
            Presupuestos de obra<br />en minutos, no en horas
          </h1>
          <p className="text-xl text-slate-500 mb-10 leading-relaxed">
            Calcula materiales automáticamente según la NEC o construye tu presupuesto fila por fila. Exporta un PDF profesional listo para entregar a tu cliente.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors flex items-center gap-2"
            >
              Crear cuenta gratis
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="border border-slate-300 text-slate-700 font-medium px-6 py-3 rounded-md hover:bg-slate-50 transition-colors"
            >
              Ya tengo cuenta
            </Link>
          </div>
          <p className="text-xs text-slate-400 mt-4">Sin tarjeta de crédito. Sin límite de presupuestos.</p>
        </div>
      </section>

      {/* Modos */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Dos modos para cada situación</h2>
            <p className="text-slate-500">Elige el que mejor se adapte a tu proyecto.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Modo Calculadora</h3>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Ingresa las medidas y la app calcula automáticamente cemento, acero, arena, ripio y encofrado según la Norma Ecuatoriana de la Construcción.
              </p>
              <div className="space-y-2">
                {['Losa maciza', 'Columna rectangular', 'Pintura de pared', 'Mampostería de bloque', 'Cerámica / porcelanato', 'Contrapiso'].map(e => (
                  <div key={e} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-8">
              <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center mb-5">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Modo Libre</h3>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Construye tu presupuesto fila por fila con descripciones, cantidades y precios personalizados. Con catálogo de materiales predefinidos para ir más rápido.
              </p>
              <div className="space-y-2">
                {['Total control sobre cada item', 'Catálogo de materiales incluido', 'Agrega tus propios rubros', 'Cualquier tipo de obra'].map(e => (
                  <div key={e} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Todo lo que necesitas</h2>
            <p className="text-slate-500">Diseñado específicamente para el mercado ecuatoriano.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: <Download className="w-5 h-5 text-blue-600" />,
                titulo: 'PDF profesional',
                descripcion: 'Descarga tu presupuesto en PDF con tu nombre, empresa y datos de contacto. Listo para entregar al cliente.',
              },
              {
                icon: <Calculator className="w-5 h-5 text-blue-600" />,
                titulo: 'Cálculos NEC',
                descripcion: 'Fórmulas verificadas contra la Norma Ecuatoriana de la Construcción. Resultados confiables y defendibles.',
              },
              {
                icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
                titulo: 'Lista de compras',
                descripcion: 'Marca qué materiales ya tienes, cuáles están parcialmente comprados y cuáles faltan.',
              },
            ].map(f => (
              <div key={f.titulo} className="border border-slate-200 rounded-lg p-6">
                <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.titulo}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Empieza hoy, es gratis</h2>
          <p className="text-blue-200 mb-8">Crea tu cuenta y arma tu primer presupuesto en menos de 5 minutos.</p>
          <Link
            href="/register"
            className="bg-white hover:bg-slate-50 text-blue-600 font-semibold px-8 py-3 rounded-md transition-colors inline-flex items-center gap-2"
          >
            Crear cuenta gratis
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm text-slate-600 font-medium">PresupuestoEC</span>
          </div>
          <p className="text-xs text-slate-400">Generador de presupuestos de obra para Ecuador</p>
        </div>
      </footer>

    </div>
  )
}