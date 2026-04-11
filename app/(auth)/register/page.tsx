'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Users, Star, Eye, EyeOff, XCircle } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const fortaleza = (() => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: 'Muy corta', color: 'bg-red-400', ancho: 'w-1/4', texto: 'text-red-500' }
    if (password.length < 8) return { label: 'Débil', color: 'bg-amber-400', ancho: 'w-2/4', texto: 'text-amber-500' }
    if (!/[0-9]/.test(password)) return { label: 'Regular', color: 'bg-yellow-400', ancho: 'w-3/4', texto: 'text-yellow-600' }
    return { label: 'Fuerte', color: 'bg-green-500', ancho: 'w-full', texto: 'text-green-600' }
  })()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirm) {
      toast.error('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      if (data.error?.includes('Ya existe') || data.error?.includes('already') || data.error?.includes('duplicate') || res.status === 409) {
        toast.error('Este correo ya está registrado. ¿Quieres ingresar?', {
          action: {
            label: 'Ir al login',
            onClick: () => window.location.href = '/login',
          },
        })
      } else {
        toast.error(data.error)
      }
      setLoading(false)
      return
    }

    toast.success('Cuenta creada exitosamente.')
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Panel izquierdo — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-blue-600 text-sm font-bold">P</span>
            </div>
            <span className="text-white text-xl font-bold">PresupuestoEC</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Tu herramienta de presupuestos de obra
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Crea tu cuenta gratis y empieza a presupuestar en minutos. Sin límites, sin tarjeta de crédito.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { icon: <CheckCircle2 className="w-4 h-4 text-green-300" />, label: 'Presupuestos ilimitados — para siempre gratis' },
            { icon: <CheckCircle2 className="w-4 h-4 text-green-300" />, label: 'PDF profesional con tus datos de ingeniero' },
            { icon: <CheckCircle2 className="w-4 h-4 text-green-300" />, label: 'Cálculos automáticos NEC sin errores' },
            { icon: <CheckCircle2 className="w-4 h-4 text-green-300" />, label: 'Comparador de proveedores y APUs incluidos' },
            { icon: <CheckCircle2 className="w-4 h-4 text-green-300" />, label: 'Precios de referencia para Manabí actualizados' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="shrink-0">{item.icon}</div>
              <span className="text-blue-100 text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-blue-500/40 rounded-xl p-5 border border-blue-400/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-200" />
            <span className="text-blue-200 text-xs font-medium uppercase tracking-wide">Para ingenieros y maestros de obra</span>
          </div>
          <p className="text-white text-sm leading-relaxed">
            Diseñado específicamente para el mercado ecuatoriano. Fórmulas NEC verificadas, precios de referencia locales y exportación profesional.
          </p>
          <div className="flex items-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-blue-500/30">
          <p className="text-blue-300 text-xs">Hecho para el mercado ecuatoriano · Norma NEC · Manabí</p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-slate-900 font-bold text-lg">PresupuestoEC</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Crea tu cuenta</h2>
            <p className="text-slate-500 text-sm mt-1">Gratis, sin tarjeta de crédito · Listo en 30 segundos</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
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

            {/* Contraseña */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fortaleza && (
                <div className="space-y-1">
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${fortaleza.color} ${fortaleza.ancho}`} />
                  </div>
                  <p className={`text-xs ${fortaleza.texto}`}>
                    Fortaleza: <span className="font-medium">{fortaleza.label}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirm && (
                <div className="flex items-center gap-1.5">
                  {password === confirm
                    ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-xs text-green-600">Las contraseñas coinciden</span></>
                    : <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-xs text-red-500">Las contraseñas no coinciden</span></>
                  }
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Ingresar
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-4">
            Al registrarte aceptas nuestros{' '}
            <Link href="/terminos" className="text-blue-600 hover:underline">Términos de uso</Link>
            {' '}y{' '}
            <Link href="/privacidad" className="text-blue-600 hover:underline">Política de privacidad</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}