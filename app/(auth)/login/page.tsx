'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, Calculator, FileDown, Zap } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error)
      setLoading(false)
      return
    }

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
            Presupuestos de obra profesionales en minutos
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Cálculos automáticos según la NEC. Para ingenieros, maestros de obra y técnicos independientes en Ecuador.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {[
            { icon: <Calculator className="w-4 h-4 text-blue-300" />, label: '6 elementos NEC — losa, columna, pintura, mampostería, cerámica, contrapiso' },
            { icon: <FileDown className="w-4 h-4 text-blue-300" />, label: 'Exporta PDF y Excel profesional con tus datos de ingeniero' },
            { icon: <Zap className="w-4 h-4 text-blue-300" />, label: 'APU, comparador de proveedores, precios de referencia Manabí' },
            { icon: <CheckCircle2 className="w-4 h-4 text-blue-300" />, label: 'Gratis para siempre — sin límite de presupuestos' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/40 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                {item.icon}
              </div>
              <span className="text-blue-100 text-sm leading-relaxed">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Footer branding */}
        <div className="pt-8 border-t border-blue-500/30">
          <p className="text-blue-300 text-xs">
            Hecho para el mercado ecuatoriano · Precios de referencia Manabí · Norma NEC
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Logo móvil */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-slate-900 font-bold text-lg">PresupuestoEC</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Bienvenido de vuelta</h2>
            <p className="text-slate-500 text-sm mt-1">Ingresa a tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Regístrate gratis
            </Link>
          </p>

          <p className="text-center text-xs text-slate-400 mt-8">
            Sin tarjeta de crédito · Sin límite de presupuestos
          </p>
        </div>
      </div>

    </div>
  )
}