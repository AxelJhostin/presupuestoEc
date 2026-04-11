import Link from 'next/link'
import {
  Calculator, FileText, Download, CheckCircle2, ChevronRight,
  MessageCircle, TrendingUp, BookOpen, Users, Zap, BarChart3
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-slate-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-slate-900 font-bold text-lg">PresupuestoEC</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Ingresar
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
              Hecho para ingenieros y maestros de obra en Ecuador
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Presupuestos de obra<br />
              <span className="text-blue-600">en minutos,</span> no en horas
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              Cálculos automáticos según la NEC, APU profesional, comparador de proveedores y PDF listo para entregar. Todo en una sola herramienta, gratis.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors flex items-center gap-2 text-base shadow-sm"
              >
                Crear cuenta gratis
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="border border-slate-300 text-slate-700 font-medium px-6 py-3.5 rounded-lg hover:bg-slate-50 transition-colors text-base"
              >
                Ya tengo cuenta
              </Link>
            </div>
            <p className="text-xs text-slate-400">Sin tarjeta de crédito · Sin límite de presupuestos · Para toda Ecuador</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { valor: '6', label: 'Elementos NEC calculados', sub: 'Losa, columna, pintura y más' },
              { valor: 'APU', label: 'Análisis de precios unitarios', sub: 'Biblioteca reutilizable' },
              { valor: 'PDF', label: 'Exportación profesional', sub: 'Con tus datos de ingeniero' },
              { valor: '100%', label: 'Gratis para siempre', sub: 'Sin límite de presupuestos' },
            ].map(s => (
              <div key={s.valor} className="text-center">
                <p className="text-3xl font-bold text-blue-600 mb-1">{s.valor}</p>
                <p className="text-sm font-medium text-slate-700">{s.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modos */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Dos modos para cada situación</h2>
            <p className="text-slate-500 text-lg">Elige el que mejor se adapte a tu proyecto.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white border-2 border-blue-100 rounded-xl p-8 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-900">Modo Calculadora</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">NEC</span>
              </div>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Ingresa las medidas y la app calcula automáticamente cemento, acero, arena, ripio y encofrado según la Norma Ecuatoriana de la Construcción.
              </p>
              <div className="space-y-2">
                {['Losa maciza', 'Columna rectangular', 'Pintura de pared', 'Mampostería de bloque', 'Cerámica / porcelanato', 'Contrapiso con malla'].map(e => (
                  <div key={e} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-xl p-8 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
                <FileText className="w-6 h-6 text-slate-600" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-900">Modo Libre</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Manual</span>
              </div>
              <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                Construye tu presupuesto fila por fila con descripciones, cantidades y precios personalizados. Con catálogo de 50+ materiales para ir más rápido.
              </p>
              <div className="space-y-2">
                {['Total control sobre cada item', 'Catálogo de 50+ materiales', 'Agrega tus propios rubros', 'Para cualquier tipo de obra', 'Comparador de proveedores', 'Organización por secciones'].map(e => (
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

      {/* Features grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Todo lo que necesitas en un solo lugar</h2>
            <p className="text-slate-500 text-lg">Diseñado específicamente para el mercado ecuatoriano.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Download className="w-5 h-5 text-blue-600" />,
                titulo: 'PDF + Excel profesional',
                descripcion: 'Descarga tu presupuesto en PDF o Excel con tu nombre, empresa, datos del cliente y resumen financiero completo.',
              },
              {
                icon: <Calculator className="w-5 h-5 text-blue-600" />,
                titulo: 'Cálculos NEC verificados',
                descripcion: 'Fórmulas verificadas contra la Norma Ecuatoriana de la Construcción. Resultados confiables y defendibles ante tu cliente.',
              },
              {
                icon: <BookOpen className="w-5 h-5 text-blue-600" />,
                titulo: 'APU — Análisis de Precios Unitarios',
                descripcion: 'Crea tu biblioteca de APUs con desglose de materiales, mano de obra y equipo. Reutilízalos en todos tus presupuestos.',
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
                titulo: 'Precios de referencia Manabí',
                descripcion: 'Consulta precios actualizados de materiales y mano de obra para la zona costera. Incluye rangos mínimo, máximo y referencia.',
              },
              {
                icon: <Users className="w-5 h-5 text-blue-600" />,
                titulo: 'Comparador de proveedores',
                descripcion: 'Compara precios de hasta 5 proveedores por material. Identifica automáticamente la mejor opción y calcula el ahorro.',
              },
              {
                icon: <MessageCircle className="w-5 h-5 text-blue-600" />,
                titulo: 'Compartir por WhatsApp',
                descripcion: 'Genera un mensaje pre-armado con el resumen del presupuesto y el link al PDF. Listo para enviar al cliente en un clic.',
              },
              {
                icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
                titulo: 'Lista de compras',
                descripcion: 'Marca qué materiales ya compraste, cuáles están parcialmente listos y cuáles faltan. Control total de tu obra.',
              },
              {
                icon: <Zap className="w-5 h-5 text-blue-600" />,
                titulo: 'Plantillas de presupuesto',
                descripcion: 'Guarda presupuestos como plantillas y úsalos como base para proyectos similares. Ahorra tiempo en cada obra nueva.',
              },
              {
                icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
                titulo: 'Resumen financiero',
                descripcion: 'Agrega imprevistos y utilidad con sliders. Ve el total final con todos los costos antes de entregar al cliente.',
              },
            ].map(f => (
              <div key={f.titulo} className="border border-slate-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.titulo}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Para todo profesional de la construcción</h2>
            <p className="text-slate-500 text-lg">No importa el tamaño del proyecto ni la experiencia técnica.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                emoji: '👷',
                titulo: 'Maestros de obra',
                descripcion: 'Presupuesta trabajos de remodelación, ampliación o construcción básica sin necesidad de software complejo.',
              },
              {
                emoji: '🏗️',
                titulo: 'Ingenieros civiles',
                descripcion: 'Genera presupuestos formales con APU, cálculos NEC y PDF profesional para presentar a clientes y entidades.',
              },
              {
                emoji: '🔨',
                titulo: 'Técnicos y albañiles',
                descripcion: 'Calcula materiales para trabajos específicos como pintura, cerámica o mampostería y presenta un precio claro.',
              },
            ].map(p => (
              <div key={p.titulo} className="bg-white border border-slate-200 rounded-xl p-8 text-center hover:border-blue-200 transition-colors">
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{p.titulo}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Empieza hoy, es completamente gratis</h2>
          <p className="text-blue-200 mb-10 text-lg max-w-xl mx-auto">
            Crea tu cuenta y arma tu primer presupuesto en menos de 5 minutos. Sin tarjeta de crédito, sin límites.
          </p>
          <Link
            href="/register"
            className="bg-white hover:bg-slate-50 text-blue-600 font-bold px-10 py-4 rounded-xl transition-colors inline-flex items-center gap-2 text-lg shadow-lg"
          >
            Crear cuenta gratis
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-blue-300 text-sm mt-6">Para ingenieros, maestros de obra y técnicos en Ecuador</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm text-slate-700 font-semibold">PresupuestoEC</span>
          </div>
          <p className="text-xs text-slate-400">Generador de presupuestos de obra para Ecuador · Norma NEC · Manabí</p>
          <div className="flex items-center gap-4">
            <Link href="/terminos" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Términos de uso</Link>
            <Link href="/privacidad" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privacidad</Link>
            <Link href="/login" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Ingresar</Link>
            <Link href="/register" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Registrarse</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}