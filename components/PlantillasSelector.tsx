'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Plantilla {
  id: string
  nombre: string
  nombre_plantilla: string
  modo: string
  total: number
}

export default function PlantillasSelector() {
  const router = useRouter()
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const [cargando, setCargando] = useState(true)
  const [creando, setCreando] = useState<string | null>(null)

  useEffect(() => {
    async function cargar() {
      const res = await fetch('/api/presupuestos/plantilla')
      if (res.ok) {
        const { plantillas } = await res.json()
        setPlantillas(plantillas)
      }
      setCargando(false)
    }
    cargar()
  }, [])

  async function usarPlantilla(plantillaId: string) {
    setCreando(plantillaId)

    const res = await fetch('/api/presupuestos/duplicar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plantillaId }),
    })

    if (res.ok) {
      const { id } = await res.json()
      toast.success('Presupuesto creado desde plantilla.')
      router.push(`/dashboard/${id}`)
    } else {
      toast.error('Error al crear desde plantilla.')
      setCreando(null)
    }
  }

  if (cargando) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        Cargando plantillas...
      </div>
    )
  }

  if (plantillas.length === 0) return null

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-slate-400" />
        <h3 className="font-semibold text-slate-900">Usar una plantilla</h3>
        <span className="text-xs text-slate-400 ml-auto">{plantillas.length} guardadas</span>
      </div>
      <div className="divide-y divide-slate-50">
        {plantillas.map(p => (
          <div key={p.id} className="px-6 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {p.nombre_plantilla || p.nombre}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {p.modo === 'calculadora' ? 'Calculadora NEC' : 'Modo libre'}
                {' · '}
                ${Number(p.total).toFixed(2)} base
              </p>
            </div>
            <button
              onClick={() => usarPlantilla(p.id)}
              disabled={creando === p.id}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 shrink-0"
            >
              {creando === p.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                'Usar plantilla'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}