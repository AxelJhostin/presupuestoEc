'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Item {
  id: string
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface Props {
  items: Item[]
  asignacionesIniciales?: Record<string, string>
}

const SECCIONES_DEFAULT = [
  'Estructura',
  'Mampostería',
  'Pisos y revestimientos',
  'Pintura',
  'Instalaciones eléctricas',
  'Instalaciones hidrosanitarias',
  'Cubierta',
  'Mano de obra',
  'Otros',
]

export default function SeccionesPresupuesto({ items, asignacionesIniciales = {} }: Props) {
  const supabase = createClient()
  const [asignaciones, setAsignaciones] = useState<Record<string, string>>(asignacionesIniciales)
  const [expandidas, setExpandidas] = useState<Record<string, boolean>>({})
  const [mostrar, setMostrar] = useState(false)

  async function asignarSeccion(itemId: string, seccion: string) {
    setAsignaciones(prev => ({ ...prev, [itemId]: seccion }))
    await supabase
      .from('items_presupuesto')
      .update({ seccion: seccion || null })
      .eq('id', itemId)
  }

  function toggleSeccion(nombre: string) {
    setExpandidas(prev => ({ ...prev, [nombre]: !prev[nombre] }))
  }

  const grupos: Record<string, Item[]> = {}
  items.forEach(item => {
    const seccion = asignaciones[item.id] || 'Sin asignar'
    if (!grupos[seccion]) grupos[seccion] = []
    grupos[seccion].push(item)
  })

  const seccionesUsadas = Object.keys(grupos).filter(s => s !== 'Sin asignar')
  const itemsSinAsignar = grupos['Sin asignar'] || []
  const todosAsignados = itemsSinAsignar.length === 0

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4 text-slate-400" />
          <div>
            <h3 className="font-semibold text-slate-900">Organizar por secciones</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Agrupa los materiales por categoría para un presupuesto más claro
            </p>
          </div>
        </div>
        <button
          onClick={() => setMostrar(!mostrar)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {mostrar ? 'Ocultar' : 'Organizar'}
        </button>
      </div>

      {mostrar && (
        <div>
          {/* Asignación de items */}
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
              Asigna cada item a una sección
            </p>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{item.descripcion}</p>
                    <p className="text-xs text-slate-400">{item.cantidad} {item.unidad} · ${item.subtotal.toFixed(2)}</p>
                  </div>
                  <select
                    value={asignaciones[item.id] || ''}
                    onChange={e => asignarSeccion(item.id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-md px-2 py-1.5 text-slate-600 bg-white shrink-0 min-w-40"
                  >
                    <option value="">Sin asignar</option>
                    {SECCIONES_DEFAULT.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Vista previa organizada */}
          {seccionesUsadas.length > 0 && (
            <div>
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Vista previa organizada
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {seccionesUsadas.map(seccion => {
                  const seccionItems = grupos[seccion]
                  const subtotalSeccion = seccionItems.reduce((acc, i) => acc + i.subtotal, 0)
                  const expandida = expandidas[seccion] !== false

                  return (
                    <div key={seccion}>
                      <button
                        onClick={() => toggleSeccion(seccion)}
                        className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {expandida
                            ? <ChevronDown className="w-4 h-4 text-slate-400" />
                            : <ChevronRight className="w-4 h-4 text-slate-400" />
                          }
                          <span className="text-sm font-semibold text-slate-700">{seccion}</span>
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {seccionItems.length} items
                          </span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">${subtotalSeccion.toFixed(2)}</span>
                      </button>

                      {expandida && (
                        <div className="divide-y divide-slate-50 bg-slate-50/50">
                          {seccionItems.map(item => (
                            <div key={item.id} className="px-10 py-2.5 flex items-center justify-between">
                              <div>
                                <p className="text-sm text-slate-600">{item.descripcion}</p>
                                <p className="text-xs text-slate-400">{item.cantidad} {item.unidad}</p>
                              </div>
                              <span className="text-sm text-slate-700 font-medium">${item.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Items sin asignar */}
                {itemsSinAsignar.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSeccion('Sin asignar')}
                      className="w-full flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {expandidas['Sin asignar'] !== false
                          ? <ChevronDown className="w-4 h-4 text-slate-300" />
                          : <ChevronRight className="w-4 h-4 text-slate-300" />
                        }
                        <span className="text-sm font-semibold text-slate-400">Sin asignar</span>
                        <span className="text-xs text-slate-300 bg-slate-100 px-2 py-0.5 rounded-full">
                          {itemsSinAsignar.length} items
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-400">
                        ${itemsSinAsignar.reduce((acc, i) => acc + i.subtotal, 0).toFixed(2)}
                      </span>
                    </button>

                    {expandidas['Sin asignar'] !== false && (
                      <div className="divide-y divide-slate-50 bg-slate-50/50">
                        {itemsSinAsignar.map(item => (
                          <div key={item.id} className="px-10 py-2.5 flex items-center justify-between">
                            <div>
                              <p className="text-sm text-slate-400">{item.descripcion}</p>
                              <p className="text-xs text-slate-300">{item.cantidad} {item.unidad}</p>
                            </div>
                            <span className="text-sm text-slate-400">${item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Resumen final */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                  Resumen por sección
                </p>
                <div className="space-y-2">
                  {seccionesUsadas.map(seccion => {
                    const subtotal = grupos[seccion].reduce((acc, i) => acc + i.subtotal, 0)
                    const totalGeneral = items.reduce((acc, i) => acc + i.subtotal, 0)
                    const porcentaje = totalGeneral > 0 ? (subtotal / totalGeneral) * 100 : 0
                    return (
                      <div key={seccion} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">{seccion}</span>
                            <span className="text-xs font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-slate-400 w-10 text-right">{porcentaje.toFixed(0)}%</span>
                      </div>
                    )
                  })}
                </div>

                {todosAsignados && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-md">
                    <span>✓</span>
                    <span>Todos los items están organizados por sección</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}