import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-slate-100 px-6 py-4 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-slate-900 font-bold">PresupuestoEC</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Términos de uso</h1>
          <p className="text-slate-500">Última actualización: abril 2025</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Aceptación de los términos</h2>
            <p className="text-slate-600 leading-relaxed">
              Al acceder y usar PresupuestoEC, aceptas cumplir con estos términos de uso. Si no estás de acuerdo con alguna parte de estos términos, no debes usar la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Descripción del servicio</h2>
            <p className="text-slate-600 leading-relaxed">
              PresupuestoEC es una plataforma web que permite a ingenieros civiles, maestros de obra y técnicos independientes en Ecuador crear, gestionar y exportar presupuestos de obra. El servicio incluye cálculos automáticos basados en la Norma Ecuatoriana de la Construcción (NEC), exportación PDF y Excel, y herramientas de gestión de proyectos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Registro y cuenta</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              Para usar PresupuestoEC debes crear una cuenta con un correo electrónico válido y una contraseña. Eres responsable de:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Mantener la confidencialidad de tu contraseña</li>
              <li>Todas las actividades realizadas bajo tu cuenta</li>
              <li>Notificarnos inmediatamente si sospechas uso no autorizado de tu cuenta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Uso aceptable</h2>
            <p className="text-slate-600 leading-relaxed mb-3">Aceptas usar PresupuestoEC únicamente para fines lícitos. Está prohibido:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Usar la plataforma para actividades ilegales o fraudulentas</li>
              <li>Intentar acceder a cuentas de otros usuarios</li>
              <li>Interferir con el funcionamiento normal de la plataforma</li>
              <li>Reproducir, duplicar o vender cualquier parte del servicio sin autorización</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Exactitud de los cálculos</h2>
            <p className="text-slate-600 leading-relaxed">
              Las fórmulas de cálculo de PresupuestoEC están basadas en la Norma Ecuatoriana de la Construcción (NEC) y fuentes técnicas verificadas. Sin embargo, los resultados son estimaciones de referencia. El usuario es responsable de verificar los cálculos antes de usarlos en proyectos reales. PresupuestoEC no se hace responsable por errores derivados del uso de los cálculos en obras de construcción.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Propiedad intelectual</h2>
            <p className="text-slate-600 leading-relaxed">
              PresupuestoEC y todo su contenido, incluyendo pero no limitado a texto, gráficos, logos y software, son propiedad de sus creadores y están protegidos por las leyes de propiedad intelectual aplicables en Ecuador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Disponibilidad del servicio</h2>
            <p className="text-slate-600 leading-relaxed">
              Nos esforzamos por mantener PresupuestoEC disponible en todo momento, pero no garantizamos disponibilidad ininterrumpida. Podemos realizar mantenimientos o actualizaciones que requieran interrupciones temporales del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Modificaciones</h2>
            <p className="text-slate-600 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor al ser publicados en la plataforma. El uso continuado de PresupuestoEC después de los cambios implica la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Ley aplicable</h2>
            <p className="text-slate-600 leading-relaxed">
              Estos términos se rigen por las leyes de la República del Ecuador. Cualquier disputa será resuelta en los tribunales competentes de Ecuador.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contacto</h2>
            <p className="text-slate-600 leading-relaxed">
              Si tienes preguntas sobre estos términos puedes contactarnos a través de la plataforma.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-slate-500">© 2025 PresupuestoEC</span>
          <div className="flex items-center gap-4">
            <Link href="/terminos" className="text-xs text-blue-600 hover:underline">Términos de uso</Link>
            <Link href="/privacidad" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Política de privacidad</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}