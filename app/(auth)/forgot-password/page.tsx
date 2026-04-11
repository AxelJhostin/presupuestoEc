'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setEnviado(true)
    } else {
      toast.error('Error al enviar el email. Intenta de nuevo.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-blue-600 text-sm font-bold">P</span>
            </div>
            <span className="text-white text-xl font-bold">PresupuestoEC</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Recupera el acceso a tu cuenta
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Te enviaremos un link al correo registrado para que puedas crear una nueva contraseña.
          </p>
        </div>
        <div className="space-y-4">
          {[
            'Link de recuperación válido por 1 hora',
            'Solo funciona con el correo registrado',
            'Tu contraseña actual no cambia hasta que uses el link',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-300 shrink-0" />
              <span className="text-blue-100 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-blue-500/30">
          <p className="text-blue-300 text-xs">PresupuestoEC · Ecuador</p>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Logo móvil */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-slate-900 font-bold text-lg">PresupuestoEC</span>
          </div>

          {!enviado ? (
            <>
              <div className="mb-8">
                <Link href="/login" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver al login
                </Link>
                <h2 className="text-2xl font-bold text-slate-900">¿Olvidaste tu contraseña?</h2>
                <p className="text-slate-500 text-sm mt-1">Ingresa tu correo y te enviamos un link de recuperación.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar link de recuperación'}
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                ¿Recordaste tu contraseña?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Ingresar
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Revisa tu correo</h2>
              <p className="text-slate-500 text-sm mb-2">
                Si <strong>{email}</strong> está registrado, recibirás un link para restablecer tu contraseña.
              </p>
              <p className="text-slate-400 text-xs mb-8">
                El link expira en 1 hora. Revisa también tu carpeta de spam.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Volver al login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}