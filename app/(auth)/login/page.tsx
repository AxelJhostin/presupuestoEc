'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white rounded-md flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">P</span>
            </div>
            <span className="text-white text-lg font-bold">PresupuestoEC</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Presupuestos de obra profesionales en minutos
          </h1>
          <p className="text-blue-200 text-lg">
            Cálculos automáticos según la NEC. Para ingenieros independientes en Ecuador.
          </p>
        </div>

        <div className="space-y-4">
          {[
            { num: '6', label: 'Elementos constructivos' },
            { num: 'NEC', label: 'Norma Ecuatoriana de la Construcción' },
            { num: 'PDF', label: 'Exportación profesional' },
          ].map(item => (
            <div key={item.num} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{item.num}</span>
              </div>
              <span className="text-blue-100 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              <span className="text-slate-900 font-bold">PresupuestoEC</span>
            </div>
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}