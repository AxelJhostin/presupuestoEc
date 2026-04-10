'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, Calculator, BookOpen } from 'lucide-react'
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

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              <div>
                <h1 className="text-base font-semibold text-slate-900">
                  {vista === 'lista' ? 'Biblioteca de APUs' : vista === 'nuevo' ? 'Nuevo APU' : 'Editar APU'}
                </h1>
                <p className="text-xs text-slate-400">
                  {vista === 'lista'
                    ? 'Análisis de precios unitarios reutilizables'
                    : 'Completa el desglose de materiales, mano de obra y equipo'
                  }
                </p>
              </div>
            </div>
          </div>
          {vista === 'lista' && (
            <button
              onClick={() => { setApuEditando(null); setVista('nuevo') }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo APU
            </button>
          )}
          {vista !== 'lista' && (
            <button
              onClick={() => { setVista('lista'); setApuEditando(null) }}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Volver a la biblioteca
            </button>
          )}
        </div>
      </header>

      {/* Banner solo en lista */}
      {vista === 'lista' && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Biblioteca de APUs</h2>
                <p className="text-blue-200 text-sm mt-0.5">
                  {apus.length > 0
                    ? `${apus.length} rubro${apus.length !== 1 ? 's' : ''} guardado${apus.length !== 1 ? 's' : ''} · Reutilízalos en cualquier presupuesto`
                    : 'Crea rubros con desglose de materiales, mano de obra y equipo'
                  }
                </p>
              </div>
            </div>
            {apus.length > 0 && (
              <div className="hidden sm:flex items-center gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">{apus.length}</p>
                  <p className="text-xs text-blue-200">APUs totales</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    ${(apus.reduce((acc, a) => acc + Number(a.precio_unitario), 0) / apus.length).toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-200">Precio unitario promedio</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">

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
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-16 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-blue-400" />
                </div>
                <p className="font-semibold text-slate-700 mb-2 text-lg">No tienes APUs guardados</p>
                <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                  Los APUs son análisis de precios unitarios. Define el costo de cada rubro con desglose de materiales, mano de obra y equipo, y reutilízalos en todos tus presupuestos.
                </p>
                <button
                  onClick={() => setVista('nuevo')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                >
                  Crear mi primer APU
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Mis APUs</h2>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{apus.length} rubros</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {apus.map(apu => (
                    <div key={apu.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {apu.codigo && (
                            <span className="text-xs font-mono bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded shrink-0">
                              {apu.codigo}
                            </span>
                          )}
                          <p className="font-medium text-slate-900 truncate">{apu.descripcion}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                            {apu.unidad}
                          </span>
                          <span className="text-xs text-slate-400">
                            CD: <span className="font-medium text-slate-600">${Number(apu.costo_directo).toFixed(2)}</span>
                          </span>
                          <span className="text-xs text-slate-400">
                            Indirectos: <span className="font-medium text-slate-600">{apu.indirectos_pct}%</span>
                          </span>
                          <span className="text-xs text-slate-400">
                            Utilidad: <span className="font-medium text-slate-600">{apu.utilidad_pct}%</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="font-bold text-blue-600 text-base">
                            ${Number(apu.precio_unitario).toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-400">por {apu.unidad}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setApuEditando(apu); setVista('editar') }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEliminar(apu.id!)}
                            className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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