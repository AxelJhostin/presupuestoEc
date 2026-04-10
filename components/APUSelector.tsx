'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Calculator, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { APUData } from './APUEditor'

interface PresupuestoAPU {
  id: string
  apu_id?: string
  codigo?: string
  descripcion: string
  unidad: string
  rendimiento: number
  indirectos_pct: number
  utilidad_pct: number
  costo_directo: number
  precio_unitario: number
  cantidad_presupuesto: number
  subtotal_presupuesto: number
  presupuesto_apu_componentes: {
    tipo: string
    descripcion: string
    unidad: string
    cantidad: number
    precio_unitario: number
    subtotal: number
  }[]
}

interface Props {
  presupuestoId: string
}

export default function APUSelector({ presupuestoId }: Props) {
  const [mostrar, setMostrar] = useState(false)
  const [apusPresupuesto, setApusPresupuesto] = useState<PresupuestoAPU[]>([])
  const [biblioteca, setBiblioteca] = useState<APUData[]>([])
  const [cargando, setCargando] = useState(false)
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (mostrar) {
      cargarDatos()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mostrar])

  async function cargarDatos() {
    setCargando(true)
    const [resApus, resBiblioteca] = await Promise.all([
      fetch(`/api/apus/presupuesto?presupuesto_id=${presupuestoId}`),
      fetch('/api/apus'),
    ])

    if (resApus.ok) {
      const { apus } = await resApus.json()
      setApusPresupuesto(apus)
    }
    if (resBiblioteca.ok) {
      const { apus } = await resBiblioteca.json()
      setBiblioteca(apus)
    }
    setCargando(false)
  }

  async function agregarDesdeBiblioteca(apu: APUData) {
    const res = await fetch('/api/apus/presupuesto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        presupuesto_id: presupuestoId,
        apu_id: apu.id,
        codigo: apu.codigo,
        descripcion: apu.descripcion,
        unidad: apu.unidad,
        rendimiento: apu.rendimiento,
        indirectos_pct: apu.indirectos_pct,
        utilidad_pct: apu.utilidad_pct,
        costo_directo: apu.costo_directo,
        precio_unitario: apu.precio_unitario,
        cantidad_presupuesto: 1,
        componentes: apu.componentes,
      }),
    })

    if (res.ok) {
      toast.success(`APU "${apu.descripcion}" agregado.`)
      await cargarDatos()
    } else {
      toast.error('Error al agregar APU.')
    }
  }

  async function actualizarCantidad(id: string, cantidad: number) {
    setApusPresupuesto(prev => prev.map(a => {
      if (a.id !== id) return a
      return {
        ...a,
        cantidad_presupuesto: cantidad,
        subtotal_presupuesto: Math.round(a.precio_unitario * cantidad * 100) / 100,
      }
    }))
  }

  async function eliminarApu(id: string) {
    const res = await fetch(`/api/apus/presupuesto?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('APU eliminado del presupuesto.')
      setApusPresupuesto(prev => prev.filter(a => a.id !== id))
    } else {
      toast.error('Error al eliminar.')
    }
  }

  function toggleExpandido(id: string) {
    setExpandidos(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalAPUs = apusPresupuesto.reduce((acc, a) => acc + a.subtotal_presupuesto, 0)

  const bibliotecaNoAgregada = biblioteca.filter(
    b => !apusPresupuesto.some(a => a.apu_id === b.id)
  )

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="font-semibold text-slate-900">Análisis de Precios Unitarios</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Agrega rubros con desglose de materiales, mano de obra y equipo
            </p>
          </div>
        </div>
        <button
          onClick={() => setMostrar(!mostrar)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {mostrar ? 'Ocultar' : 'Abrir'}
        </button>
      </div>

      {mostrar && (
        <div className="p-6 space-y-6">

          {cargando ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Cargando APUs...
            </div>
          ) : (
            <>
              {/* APUs agregados al presupuesto */}
              {apusPresupuesto.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Rubros en este presupuesto
                  </p>
                  {apusPresupuesto.map(apu => (
                    <div key={apu.id} className="border border-slate-200 rounded-lg overflow-hidden">

                      {/* Header del APU */}
                      <div className="px-4 py-3 bg-slate-50 flex items-center justify-between gap-4">
                        <button
                          onClick={() => toggleExpandido(apu.id)}
                          className="flex items-center gap-2 flex-1 text-left"
                        >
                          {expandidos[apu.id]
                            ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                            : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          }
                          <div>
                            <div className="flex items-center gap-2">
                              {apu.codigo && (
                                <span className="text-xs font-mono bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                                  {apu.codigo}
                                </span>
                              )}
                              <span className="text-sm font-medium text-slate-900">{apu.descripcion}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              ${Number(apu.precio_unitario).toFixed(2)}/{apu.unidad} · CD: ${Number(apu.costo_directo).toFixed(2)}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400">Cant:</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={apu.cantidad_presupuesto}
                              onChange={e => actualizarCantidad(apu.id, parseFloat(e.target.value) || 0)}
                              className="h-7 w-20 text-sm text-right"
                            />
                            <span className="text-xs text-slate-400">{apu.unidad}</span>
                          </div>
                          <span className="font-bold text-blue-600 text-sm w-24 text-right">
                            ${apu.subtotal_presupuesto.toFixed(2)}
                          </span>
                          <button
                            onClick={() => eliminarApu(apu.id)}
                            className="text-slate-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Desglose del APU */}
                      {expandidos[apu.id] && (
                        <div className="px-4 py-3 space-y-3">
                          {(['material', 'mano_obra', 'equipo'] as const).map(tipo => {
                            const items = apu.presupuesto_apu_componentes.filter(c => c.tipo === tipo)
                            if (items.length === 0) return null
                            const labels = { material: 'Materiales', mano_obra: 'Mano de obra', equipo: 'Equipo' }
                            const colors = {
                              material: 'text-blue-600',
                              mano_obra: 'text-amber-600',
                              equipo: 'text-green-600',
                            }
                            return (
                              <div key={tipo}>
                                <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${colors[tipo]}`}>
                                  {labels[tipo]}
                                </p>
                                <table className="w-full text-xs">
                                  <thead className="text-slate-400">
                                    <tr>
                                      <th className="text-left pb-1">Descripción</th>
                                      <th className="text-center pb-1 w-16">Unidad</th>
                                      <th className="text-right pb-1 w-16">Cantidad</th>
                                      <th className="text-right pb-1 w-20">P. Unit.</th>
                                      <th className="text-right pb-1 w-20">Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50">
                                    {items.map((c, i) => (
                                      <tr key={i}>
                                        <td className="py-1 text-slate-600">{c.descripcion}</td>
                                        <td className="py-1 text-center text-slate-400">{c.unidad}</td>
                                        <td className="py-1 text-right text-slate-600">{c.cantidad}</td>
                                        <td className="py-1 text-right text-slate-600">${Number(c.precio_unitario).toFixed(2)}</td>
                                        <td className="py-1 text-right font-medium text-slate-700">${Number(c.subtotal).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )
                          })}

                          {/* Resumen costos */}
                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Costo directo</span>
                              <span className="text-slate-600">${Number(apu.costo_directo).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Indirectos ({apu.indirectos_pct}%)</span>
                              <span className="text-slate-500">+${(Number(apu.costo_directo) * apu.indirectos_pct / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Utilidad ({apu.utilidad_pct}%)</span>
                              <span className="text-slate-500">+${(Number(apu.costo_directo) * apu.utilidad_pct / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-semibold pt-1 border-t border-slate-100">
                              <span className="text-slate-700">Precio unitario</span>
                              <span className="text-blue-600">${Number(apu.precio_unitario).toFixed(2)}/{apu.unidad}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Total APUs */}
                  <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <span className="text-sm font-semibold text-blue-900">Total APUs</span>
                    <span className="text-lg font-bold text-blue-600">${totalAPUs.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Biblioteca de APUs disponibles */}
              {bibliotecaNoAgregada.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                    Agregar desde tu biblioteca
                  </p>
                  <div className="space-y-2">
                    {bibliotecaNoAgregada.map(apu => (
                      <div
                        key={apu.id}
                        className="flex items-center justify-between px-4 py-3 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            {apu.codigo && (
                              <span className="text-xs font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                {apu.codigo}
                              </span>
                            )}
                            <span className="text-sm font-medium text-slate-700">{apu.descripcion}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {apu.unidad} · ${Number(apu.precio_unitario).toFixed(2)}/{apu.unidad}
                          </p>
                        </div>
                        <button
                          onClick={() => agregarDesdeBiblioteca(apu)}
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-md transition-colors shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Agregar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Si no hay APUs en biblioteca */}
              {biblioteca.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Calculator className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No tienes APUs en tu biblioteca.</p>
                  <a
                    href="/dashboard/apus"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block"
                  >
                    Crear APUs en la biblioteca →
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}