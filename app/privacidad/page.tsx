import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacidadPage() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Política de privacidad</h1>
          <p className="text-slate-500">Última actualización: abril 2025</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Información que recopilamos</h2>
            <p className="text-slate-600 leading-relaxed mb-3">Al usar PresupuestoEC recopilamos la siguiente información:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Información de cuenta:</strong> correo electrónico y contraseña (almacenada de forma encriptada)</li>
              <li><strong>Información de perfil:</strong> nombre, empresa y teléfono que ingresas voluntariamente</li>
              <li><strong>Datos de uso:</strong> presupuestos, items, cálculos y configuraciones que creas en la plataforma</li>
              <li><strong>Datos del cliente:</strong> nombre, teléfono y RUC de tus clientes que ingresas en los presupuestos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Cómo usamos tu información</h2>
            <p className="text-slate-600 leading-relaxed mb-3">Usamos la información recopilada para:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Proveer y mantener el servicio de PresupuestoEC</li>
              <li>Autenticar tu identidad y proteger tu cuenta</li>
              <li>Generar los PDFs y documentos Excel con tus datos</li>
              <li>Mejorar la plataforma basándonos en el uso general</li>
              <li>Enviarte emails relacionados con tu cuenta (recuperación de contraseña, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Almacenamiento y seguridad</h2>
            <p className="text-slate-600 leading-relaxed">
              Tus datos se almacenan en Supabase, una plataforma de base de datos segura con cifrado en reposo y en tránsito. Las contraseñas se almacenan usando bcrypt, un algoritmo de hash seguro — nunca almacenamos contraseñas en texto plano. Implementamos medidas de seguridad razonables para proteger tu información contra acceso no autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Compartir información con terceros</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              No vendemos, intercambiamos ni transferimos tu información personal a terceros, excepto en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Proveedores de servicio:</strong> Supabase (base de datos) y Vercel (hosting) que nos ayudan a operar la plataforma bajo estrictos acuerdos de confidencialidad</li>
              <li><strong>Servicio de email:</strong> Resend para el envío de emails transaccionales como recuperación de contraseña</li>
              <li><strong>Requerimiento legal:</strong> si la ley lo requiere o para proteger nuestros derechos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Tus derechos</h2>
            <p className="text-slate-600 leading-relaxed mb-3">Tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Acceder</strong> a tu información personal desde tu perfil</li>
              <li><strong>Corregir</strong> información incorrecta actualizando tu perfil</li>
              <li><strong>Eliminar</strong> tu cuenta y todos tus datos desde la sección Zona de peligro en tu perfil</li>
              <li><strong>Exportar</strong> tus presupuestos en PDF o Excel en cualquier momento</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Cookies y sesión</h2>
            <p className="text-slate-600 leading-relaxed">
              PresupuestoEC usa una cookie segura llamada <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">auth_token</code> para mantener tu sesión iniciada. Esta cookie es estrictamente necesaria para el funcionamiento de la plataforma, no se usa para rastreo publicitario y expira automáticamente después de 7 días.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Retención de datos</h2>
            <p className="text-slate-600 leading-relaxed">
              Conservamos tu información mientras tu cuenta esté activa. Al eliminar tu cuenta, todos tus datos son eliminados permanentemente de nuestros sistemas en un plazo máximo de 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Menores de edad</h2>
            <p className="text-slate-600 leading-relaxed">
              PresupuestoEC no está dirigido a menores de 18 años. No recopilamos conscientemente información de menores de edad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Cambios a esta política</h2>
            <p className="text-slate-600 leading-relaxed">
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos de cambios significativos publicando la nueva política en esta página con la fecha de actualización.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contacto</h2>
            <p className="text-slate-600 leading-relaxed">
              Si tienes preguntas sobre esta política de privacidad o sobre el manejo de tus datos, puedes contactarnos a través de la plataforma.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-slate-500">© 2025 PresupuestoEC</span>
          <div className="flex items-center gap-4">
            <Link href="/terminos" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Términos de uso</Link>
            <Link href="/privacidad" className="text-xs text-blue-600 hover:underline">Política de privacidad</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}