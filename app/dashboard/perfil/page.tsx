'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
      toast.error('Teléfono inválido. Ingresa 10 dígitos (ej: 0999123456) o con código de país (ej: 593999123456).')
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 text-sm">
          ← Dashboard
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Mi perfil</h1>
      </header>

      <main className="max-w-lg mx-auto px-6 py-10">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <p className="text-sm text-slate-500 mb-6">
            Estos datos aparecerán en el PDF de tus presupuestos.
          </p>

          <form onSubmit={handleGuardar} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Correo electrónico</Label>
              <Input value={email} disabled className="bg-slate-50 text-slate-400" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input
                id="nombre"
                placeholder="Ing. Juan Pérez"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                maxLength={80}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                placeholder="0999 123 456"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                maxLength={15}
              />
              <p className="text-xs text-slate-400">10 dígitos (ej: 0999123456) o con código de país (ej: 593999123456)</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="empresa">Empresa / Estudio (opcional)</Label>
              <Input
                id="empresa"
                placeholder="Constructora Pérez"
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
                maxLength={100}
              />
            </div>

            <Button type="submit" className="w-full" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar perfil'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}