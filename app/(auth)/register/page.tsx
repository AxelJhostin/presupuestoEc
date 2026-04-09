'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

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
      toast.error(data.error)
      setLoading(false)
      return
    }

    toast.success('Cuenta creada exitosamente.')
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
            Tu herramienta de presupuestos de obra
          </h1>
          <p className="text-blue-200 text-lg">
            Crea tu cuenta gratis y empieza a presupuestar en minutos.
          </p>
        </div>

        <div className="bg-blue-500 rounded-lg p-6">
          <p className="text-white font-medium mb-1">Sin límites. Sin tarjeta.</p>
          <p className="text-blue-200 text-sm">
            Crea todos los presupuestos que necesites, exporta PDFs profesionales y gestiona tus proyectos desde un solo lugar.
          </p>
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
            <h2 className="text-2xl font-bold text-slate-900">Crea tu cuenta</h2>
            <p className="text-slate-500 text-sm mt-1">Gratis, sin tarjeta de crédito</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
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
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirmar contraseña</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Ingresar
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}