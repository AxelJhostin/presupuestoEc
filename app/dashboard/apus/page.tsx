'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Calculator } from 'lucide-react'
import { toast } from 'sonner'
import APUEditor, { type APUData } from '@/components/APUEditor'

export default function APUsPage() {
  const [apus, setApus] = useState<APUData[]>([])
  const [cargando, setCargando] = useState(true)
  const [vista, setVista] = useState<'lista' | 'nuevo' | 'editar'>('lista')
  const [apuEditando, setApuEditando] = useState<APUData | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    cargarApus()
  }, [])

  async function cargarApus() {
    setCargando(true)
    const res = await fetch('/api/apus')
    if (res.ok) {
      const { apus } = await res.json()
      setApus(apus)
    }
    setCargando(false)
  }

  async function handleGuardar(apu: APUData) {
    setGuardando(true)
    const method = apu.id ? 'PUT' : 'POST'
    const res = await fetch('/api/apus', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...apu, componentes: apu.componentes }),
    })

    if (res.ok) {
      toast.success(apu.id ? 'APU actualizado.' : 'APU guardado en tu biblioteca.')
      await cargarApus()
      setVista('lista')
      setApuEditando(null)
    } else {
      toast.error('Error al guardar el APU.')
    }
    setGuardando(false)
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminar este APU de tu biblioteca?')) return

    const res = await fetch(`/api/apus?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('APU eliminado.')
      setApus(prev => prev.filter(a => a.id !== id))
    } else {
      toast.error('Error al eliminar.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <h1 className="text-base font-semibold text-slate-900">
                {vista === 'lista' ? 'Biblioteca de APUs' : vista === 'nuevo' ? 'Nuevo APU' : 'Editar APU'}
              </h1>
            </div>
          </div>
          {vista === 'lista' && (
            <button
              onClick={() => { setApuEditando(null); setVista('nuevo') }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo APU
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {vista !== 'lista' ? (
          <APUEditor
            apu={apuEditando || undefined}
            onGuardar={handleGuardar}
            onCancelar={() => { setVista('lista'); setApuEditando(null) }}
            guardando={guardando}
          />
        ) : (
          <div className="space-y-4">

            {cargando ? (
              <div className="text-center py-16 text-slate-400 text-sm">Cargando biblioteca...</div>
            ) : apus.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg px-6 py-16 text-center">
                <Calculator className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p className="font-medium text-slate-700 mb-1">No tienes APUs guardados</p>
                <p className="text-sm text-slate-400 mb-6">
                  Los APUs son análisis de precios unitarios. Crea uno para reutilizarlo en tus presupuestos.
                </p>
                <button
                  onClick={() => setVista('nuevo')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Crear mi primer APU
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Mis APUs</h2>
                  <span className="text-xs text-slate-400">{apus.length} rubros</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {apus.map(apu => (
                    <div key={apu.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {apu.codigo && (
                            <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                              {apu.codigo}
                            </span>
                          )}
                          <p className="font-medium text-slate-900 truncate">{apu.descripcion}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-400">Unidad: {apu.unidad}</span>
                          <span className="text-xs text-slate-400">
                            CD: ${Number(apu.costo_directo).toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-400">
                            Indirectos: {apu.indirectos_pct}% · Utilidad: {apu.utilidad_pct}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-blue-600 text-sm">
                          ${Number(apu.precio_unitario).toFixed(2)}/{apu.unidad}
                        </span>
                        <button
                          onClick={() => { setApuEditando(apu); setVista('editar') }}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminar(apu.id!)}
                          className="text-slate-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}