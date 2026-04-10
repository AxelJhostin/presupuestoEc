'use client'

import { useState } from 'react'
import { BookmarkPlus } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  presupuestoId: string
  nombrePresupuesto: string
}

export default function PlantillaButton({ presupuestoId, nombrePresupuesto }: Props) {
  const [guardando, setGuardando] = useState(false)
  const [mostrarInput, setMostrarInput] = useState(false)
  const [nombrePlantilla, setNombrePlantilla] = useState(`Plantilla — ${nombrePresupuesto}`)

  async function handleGuardar() {
    setGuardando(true)

    const res = await fetch('/api/presupuestos/plantilla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: presupuestoId, nombre_plantilla: nombrePlantilla }),
    })

    if (res.ok) {
      toast.success('Guardado como plantilla.')
      setMostrarInput(false)
    } else {
      toast.error('Error al guardar la plantilla.')
    }

    setGuardando(false)
  }

  if (mostrarInput) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={nombrePlantilla}
          onChange={e => setNombrePlantilla(e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-1.5 text-slate-700 focus:outline-none focus:border-blue-400 w-56"
          autoFocus
        />
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="text-sm font-medium bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Confirmar'}
        </button>
        <button
          onClick={() => setMostrarInput(false)}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setMostrarInput(true)}
      className="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
    >
      <BookmarkPlus className="w-3.5 h-3.5" />
      <span className="hidden sm:block">Plantilla</span>
    </button>
  )
}