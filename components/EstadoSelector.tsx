'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ESTADOS = [
  { value: 'borrador', label: 'Borrador', color: 'bg-slate-100 text-slate-500' },
  { value: 'enviado', label: 'Enviado', color: 'bg-blue-50 text-blue-600' },
  { value: 'aprobado', label: 'Aprobado', color: 'bg-green-50 text-green-600' },
  { value: 'en_ejecucion', label: 'En ejecución', color: 'bg-amber-50 text-amber-600' },
]

interface Props {
  presupuestoId: string
  estadoInicial: string
}

export default function EstadoSelector({ presupuestoId, estadoInicial }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [estado, setEstado] = useState(estadoInicial || 'borrador')
  const [guardando, setGuardando] = useState(false)

  const estadoActual = ESTADOS.find(e => e.value === estado) || ESTADOS[0]

  async function cambiarEstado(nuevoEstado: string) {
    setGuardando(true)
    setEstado(nuevoEstado)

    const { error } = await supabase
      .from('presupuestos')
      .update({ estado: nuevoEstado })
      .eq('id', presupuestoId)

    if (error) {
      toast.error('Error al actualizar el estado.')
      setEstado(estado)
    } else {
      toast.success('Estado actualizado.')
      router.refresh()
    }
    setGuardando(false)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Estado:</span>
      <div className="relative">
        <select
          value={estado}
          onChange={e => cambiarEstado(e.target.value)}
          disabled={guardando}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer appearance-none pr-6 ${estadoActual.color}`}
        >
          {ESTADOS.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs">▾</span>
      </div>
    </div>
  )
}