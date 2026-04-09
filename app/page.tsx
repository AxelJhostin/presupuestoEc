import Link from 'next/link'
import { Calculator, FileText, Download } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-lg font-bold text-slate-900">PresupuestoEC</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Ingresar
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Registrarse gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          Hecho para ingenieros en Ecuador
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
          Presupuestos de obra<br className="hidden sm:block" /> en minutos, no en horas
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10">
          Calcula materiales automáticamente según la NEC o construye tu presupuesto fila por fila. Exporta un PDF profesional listo para entregar.
        </p>
        <Link
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md transition-colors text-base"
        >
          Crear cuenta gratis
        </Link>
        <p className="text-xs text-slate-400 mt-3">Sin tarjeta de crédito. Sin límite de presupuestos.</p>
      </section>

      {/* Modos */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Dos modos para cada situación</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Modo Calculadora</h3>
            <p className="text-sm text-slate-500 mb-4">
              Ingresa las medidas y la app calcula automáticamente cemento, acero, arena, ripio y encofrado según la Norma Ecuatoriana de la Construcción.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Losa maciza', 'Columna rectangular', 'Pintura de pared'].map(e => (
                <span key={e} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{e}</span>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-6">
            <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Modo Libre</h3>
            <p className="text-sm text-slate-500 mb-4">
              Construye tu presupuesto fila por fila con descripciones, cantidades y precios personalizados. Como Excel pero más limpio y rápido.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Total control', 'Sin restricciones', 'Cualquier rubro'].map(e => (
                <span key={e} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{e}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PDF */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center gap-8">
          <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-lg mb-1">PDF profesional en un clic</h3>
            <p className="text-slate-500 text-sm">
              Descarga tu presupuesto en PDF con formato limpio y profesional, listo para presentar a tu cliente o adjuntar a una propuesta.
            </p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Empieza hoy, es gratis</h2>
        <p className="text-slate-500 mb-8 text-sm">Crea tu cuenta y arma tu primer presupuesto en menos de 5 minutos.</p>
        <Link
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-md transition-colors"
        >
          Crear cuenta gratis
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        PresupuestoEC — Generador de presupuestos de obra para Ecuador
      </footer>

    </div>
  )
}