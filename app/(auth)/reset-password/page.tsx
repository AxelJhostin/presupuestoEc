'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (!token) router.push('/login')
  }, [token, router])

  const fortaleza = (() => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: 'Muy corta', color: 'bg-red-400', ancho: 'w-1/4' }
    if (password.length < 8) return { label: 'Débil', color: 'bg-amber-400', ancho: 'w-2/4' }
    if (!/[0-9]/.test(password)) return { label: 'Regular', color: 'bg-yellow-400', ancho: 'w-3/4' }
    return { label: 'Fuerte', color: 'bg-green-500', ancho: 'w-full' }
  })()

  async function handleSubmit(e: React.FormEvent) {
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

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error)
      setLoading(false)
      return
    }

    setExito(true)
    setTimeout(() => router.push('/login'), 3000)
  }

  if (!token) return null

  return (
    <>
      {!exito ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Nueva contraseña</h2>
            <p className="text-slate-500 text-sm mt-1">Ingresa y confirma tu nueva contraseña.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
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
                    <div className={`h-full rounded-full transition-all ${fortaleza.color} ${fortaleza.ancho}`} />
                  </div>
                  <p className="text-xs text-slate-400">Fortaleza: <span className="font-medium">{fortaleza.label}</span></p>
                </div>
              )}
            </div>

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

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </Button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Contraseña actualizada!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Tu contraseña fue cambiada exitosamente. Redirigiendo al login...
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Ir al login
          </Link>
        </div>
      )}
    </>
  )
}

export default function ResetPasswordPage() {
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
            Crea una nueva contraseña
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Elige una contraseña segura para proteger tu cuenta y tus presupuestos.
          </p>
        </div>
        <div className="space-y-4">
          {[
            'Mínimo 6 caracteres',
            'Combina letras y números para mayor seguridad',
            'No compartas tu contraseña con nadie',
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

          <Suspense fallback={<p className="text-slate-400 text-sm">Cargando...</p>}>
            <ResetPasswordForm />
          </Suspense>

        </div>
      </div>
    </div>
  )
}