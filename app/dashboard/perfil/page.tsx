'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, User, Building2, Phone, Mail, Save, Trash2 } from 'lucide-react'
import { Eye, EyeOff, Lock } from 'lucide-react'

function validarTelefono(tel: string): boolean {
  if (!tel) return true
  const limpio = tel.replace(/[\s\-\+]/g, '')
  return /^(0\d{9}|[1-9]\d{8}|593\d{9})$/.test(limpio)
}

export default function PerfilPage() {
  const router = useRouter()
  const supabase = createClient()

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  // Cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [cambiandoPassword, setCambiandoPassword] = useState(false)
  const [showActual, setShowActual] = useState(false)
  const [showNueva, setShowNueva] = useState(false)

  useEffect(() => {
    async function cargarPerfil() {
      setLoading(true)
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.push('/login'); return }
      const { userId, email: userEmail } = await res.json()
      setEmail(userEmail)

      const { data } = await supabase
        .from('usuarios')
        .select('nombre, telefono, empresa')
        .eq('id', userId)
        .single()

      if (data) {
        setNombre(data.nombre || '')
        setTelefono(data.telefono || '')
        setEmpresa(data.empresa || '')
      }
      setLoading(false)
    }
    cargarPerfil()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault()

    if (nombre.trim() && nombre.trim().length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres.')
      return
    }

    if (nombre.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.]+$/.test(nombre.trim())) {
      toast.error('El nombre solo puede contener letras.')
      return
    }

    if (telefono && !validarTelefono(telefono)) {
      toast.error('Teléfono inválido. Ingresa 10 dígitos (ej: 0999123456).')
      return
    }

    setGuardando(true)

    const res = await fetch('/api/auth/me')
    if (!res.ok) { router.push('/login'); return }
    const { userId } = await res.json()

    const { error } = await supabase
      .from('usuarios')
      .update({ nombre: nombre.trim(), telefono: telefono.trim(), empresa: empresa.trim() })
      .eq('id', userId)

    if (error) {
      toast.error('Error al guardar el perfil.')
    } else {
      toast.success('Perfil actualizado.')
    }
    setGuardando(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Cargando...</p>
      </div>
    )
  }

  async function handleCambiarPassword(e: React.FormEvent) {
    e.preventDefault()

    if (passwordNueva.length < 6) {
      toast.error('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (passwordNueva !== passwordConfirm) {
      toast.error('Las contraseñas no coinciden.')
      return
    }

    setCambiandoPassword(true)

    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwordActual, passwordNueva }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error)
    } else {
      toast.success('Contraseña actualizada.')
      setPasswordActual('')
      setPasswordNueva('')
      setPasswordConfirm('')
    }

    setCambiandoPassword(false)
  }

  async function handleEliminarCuenta() {
    const confirmacion = window.confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible y eliminará todos tus presupuestos.'
    )
    if (!confirmacion) return

    const confirmacion2 = window.confirm(
      'Última confirmación: ¿Eliminar permanentemente tu cuenta y todos tus datos?'
    )
    if (!confirmacion2) return

    setEliminando(true)

    const res = await fetch('/api/auth/delete-account', { method: 'DELETE' })

    if (res.ok) {
      toast.success('Cuenta eliminada.')
      window.location.href = '/'
    } else {
      toast.error('Error al eliminar la cuenta.')
      setEliminando(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-px h-4 bg-slate-200" />
          <div>
            <h1 className="text-base font-semibold text-slate-900">Mi perfil</h1>
            <p className="text-xs text-slate-400">Tus datos aparecerán en el encabezado del PDF</p>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl">
              {nombre || 'Tu nombre aquí'}
            </p>
            <p className="text-blue-200 text-sm mt-0.5">
              {empresa || 'Sin empresa registrada'} · {email}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Formulario */}
          <div className="xl:col-span-2">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Información personal</h2>
                <p className="text-xs text-slate-400 mt-0.5">Estos datos aparecen en el PDF de tus presupuestos</p>
              </div>

              <form onSubmit={handleGuardar} className="p-6 space-y-5">

                {/* Email */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Correo electrónico
                  </Label>
                  <Input value={email} disabled className="bg-slate-50 text-slate-400" />
                  <p className="text-xs text-slate-400">El correo no se puede cambiar.</p>
                </div>

                {/* Nombre */}
                <div className="space-y-1.5">
                  <Label htmlFor="nombre" className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Nombre completo
                  </Label>
                  <Input
                    id="nombre"
                    placeholder="Ing. Juan Pérez"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    maxLength={80}
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <Label htmlFor="telefono" className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    placeholder="0999 123 456"
                    value={telefono}
                    onChange={e => setTelefono(e.target.value)}
                    maxLength={15}
                  />
                  <p className="text-xs text-slate-400">10 dígitos (ej: 0999123456) o con código de país (ej: 593999123456)</p>
                </div>

                {/* Empresa */}
                <div className="space-y-1.5">
                  <Label htmlFor="empresa" className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Empresa / Estudio (opcional)
                  </Label>
                  <Input
                    id="empresa"
                    placeholder="Constructora Pérez"
                    value={empresa}
                    onChange={e => setEmpresa(e.target.value)}
                    maxLength={100}
                  />
                </div>

                <Button type="submit" className="w-full flex items-center gap-2" disabled={guardando}>
                  <Save className="w-4 h-4" />
                  {guardando ? 'Guardando...' : 'Guardar perfil'}
                </Button>
              </form>
            </div>
          </div>

          {/* Panel lateral — preview PDF */}
          <div className="xl:col-span-1">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Vista previa en PDF</h3>
                <p className="text-xs text-slate-400 mt-0.5">Así aparecerás en el encabezado</p>
              </div>
              <div className="p-6">
                {/* Simulación del header del PDF */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex items-start justify-between pb-3 border-b-2 border-blue-600">
                    <div>
                      <p className="text-blue-600 font-bold text-lg">PresupuestoEC</p>
                      <p className="text-slate-400 text-xs mt-0.5">Generador de presupuestos de obra — Ecuador</p>
                    </div>
                    {(nombre || empresa) && (
                      <div className="text-right">
                        {nombre && <p className="text-slate-800 font-semibold text-xs">{nombre}</p>}
                        {empresa && <p className="text-slate-500 text-xs mt-0.5">{empresa}</p>}
                        {telefono && <p className="text-slate-500 text-xs mt-0.5">{telefono}</p>}
                        {email && <p className="text-slate-500 text-xs mt-0.5">{email}</p>}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="h-2 bg-slate-200 rounded w-3/4" />
                    <div className="h-2 bg-slate-200 rounded w-1/2" />
                    <div className="h-2 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3 text-center">
                  La vista previa se actualiza en tiempo real
                </p>
              </div>
            </div>
          </div>
        </div>  

        {/* Cambio de contraseña */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              Cambiar contraseña
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Actualiza tu contraseña de acceso</p>
          </div>
          <form onSubmit={handleCambiarPassword} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Contraseña actual</Label>
              <div className="relative">
                <Input
                  type={showActual ? 'text' : 'password'}
                  placeholder="Tu contraseña actual"
                  value={passwordActual}
                  onChange={e => setPasswordActual(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowActual(!showActual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Nueva contraseña</Label>
              <div className="relative">
                <Input
                  type={showNueva ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={passwordNueva}
                  onChange={e => setPasswordNueva(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNueva(!showNueva)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNueva ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Confirmar nueva contraseña</Label>
              <Input
                type="password"
                placeholder="Repite la nueva contraseña"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={cambiandoPassword}>
              {cambiandoPassword ? 'Actualizando...' : 'Cambiar contraseña'}
            </Button>
          </form>
        </div>

        {/* Zona de peligro */}
        <div className="bg-white border border-red-200 rounded-xl overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-red-100 bg-red-50">
            <h2 className="font-semibold text-red-700 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Zona de peligro
            </h2>
            <p className="text-xs text-red-400 mt-0.5">Acciones irreversibles</p>
          </div>
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Eliminar cuenta</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Elimina permanentemente tu cuenta y todos tus presupuestos. Esta acción no se puede deshacer.
              </p>
            </div>
            <button
              onClick={handleEliminarCuenta}
              disabled={eliminando}
              className="shrink-0 flex items-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {eliminando ? 'Eliminando...' : 'Eliminar cuenta'}
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}