'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export interface Componente {
  id?: string
  tipo: 'material' | 'mano_obra' | 'equipo'
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
}

export interface APUData {
  id?: string
  codigo: string
  descripcion: string
  unidad: string
  rendimiento: number
  indirectos_pct: number
  utilidad_pct: number
  costo_directo: number
  precio_unitario: number
  componentes: Componente[]
}

interface Props {
  apu?: APUData
  onGuardar: (apu: APUData) => Promise<void>
  onCancelar: () => void
  guardando: boolean
}

const TIPOS = [
  { value: 'material', label: 'Materiales', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'mano_obra', label: 'Mano de obra', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'equipo', label: 'Equipo', color: 'bg-green-50 text-green-700 border-green-200' },
] as const

function nuevaFila(tipo: 'material' | 'mano_obra' | 'equipo'): Componente {
  return { tipo, descripcion: '', unidad: tipo === 'mano_obra' ? 'hora' : 'und', cantidad: 0, precio_unitario: 0 }
}

export default function APUEditor({ apu, onGuardar, onCancelar, guardando }: Props) {
  const [codigo, setCodigo] = useState(apu?.codigo || '')
  const [descripcion, setDescripcion] = useState(apu?.descripcion || '')
  const [unidad, setUnidad] = useState(apu?.unidad || 'm²')
  const [rendimiento, setRendimiento] = useState(apu?.rendimiento || 1)
  const [indirectos, setIndirectos] = useState(apu?.indirectos_pct || 20)
  const [utilidad, setUtilidad] = useState(apu?.utilidad_pct || 10)
  const [componentes, setComponentes] = useState<Componente[]>(
    apu?.componentes || [
      nuevaFila('material'),
      nuevaFila('mano_obra'),
    ]
  )
  const [seccionesExpandidas, setSeccionesExpandidas] = useState({
    material: true,
    mano_obra: true,
    equipo: false,
  })

  function toggleSeccion(tipo: 'material' | 'mano_obra' | 'equipo') {
    setSeccionesExpandidas(prev => ({ ...prev, [tipo]: !prev[tipo] }))
  }

  function agregarFila(tipo: 'material' | 'mano_obra' | 'equipo') {
    setComponentes(prev => [...prev, nuevaFila(tipo)])
    setSeccionesExpandidas(prev => ({ ...prev, [tipo]: true }))
  }

  function eliminarFila(index: number) {
    setComponentes(prev => prev.filter((_, i) => i !== index))
  }

  function actualizarFila(index: number, campo: keyof Componente, valor: string | number) {
    setComponentes(prev => prev.map((c, i) => i === index ? { ...c, [campo]: valor } : c))
  }

  // Cálculos
  const componentesPorTipo = (tipo: 'material' | 'mano_obra' | 'equipo') =>
    componentes.map((c, i) => ({ ...c, index: i })).filter(c => c.tipo === tipo)

  const subtotalTipo = (tipo: 'material' | 'mano_obra' | 'equipo') =>
    componentes.filter(c => c.tipo === tipo).reduce((acc, c) => acc + c.cantidad * c.precio_unitario, 0)

  const costoDirecto = componentes.reduce((acc, c) => acc + c.cantidad * c.precio_unitario, 0)
  const montoIndirectos = costoDirecto * (indirectos / 100)
  const montoUtilidad = costoDirecto * (utilidad / 100)
  const precioUnitario = costoDirecto + montoIndirectos + montoUtilidad

  async function handleGuardar() {
    if (!descripcion.trim()) { toast.error('Ingresa una descripción para el APU.'); return }
    if (!unidad.trim()) { toast.error('Ingresa una unidad.'); return }
    if (componentes.filter(c => c.descripcion.trim()).length === 0) {
      toast.error('Agrega al menos un componente.')
      return
    }

    await onGuardar({
      id: apu?.id,
      codigo,
      descripcion,
      unidad,
      rendimiento,
      indirectos_pct: indirectos,
      utilidad_pct: utilidad,
      costo_directo: Math.round(costoDirecto * 100) / 100,
      precio_unitario: Math.round(precioUnitario * 100) / 100,
      componentes: componentes.filter(c => c.descripcion.trim()),
    })
  }

  return (
    <div className="space-y-6">

      {/* Cabecera del rubro */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Identificación del rubro</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label>Código</Label>
            <Input placeholder="Ej: 001" value={codigo} onChange={e => setCodigo(e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Descripción del rubro *</Label>
            <Input placeholder="Ej: Hormigón en losa f'c=210 kg/cm²" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Unidad *</Label>
            <Input placeholder="m³, m², kg..." value={unidad} onChange={e => setUnidad(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Rendimiento (unidades/hora)</Label>
            <Input type="number" min="0" step="0.01" value={rendimiento} onChange={e => setRendimiento(parseFloat(e.target.value) || 1)} />
          </div>
          <div className="space-y-1.5">
            <Label>Costos indirectos (%)</Label>
            <Input type="number" min="0" max="100" value={indirectos} onChange={e => setIndirectos(parseFloat(e.target.value) || 0)} />
          </div>
          <div className="space-y-1.5">
            <Label>Utilidad (%)</Label>
            <Input type="number" min="0" max="100" value={utilidad} onChange={e => setUtilidad(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      </div>

      {/* Componentes por tipo */}
      {TIPOS.map(({ value: tipo, label, color }) => {
        const filas = componentesPorTipo(tipo)
        const subtotal = subtotalTipo(tipo)
        const expandida = seccionesExpandidas[tipo]

        return (
          <div key={tipo} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSeccion(tipo)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}>
                  {label}
                </span>
                <span className="text-xs text-slate-400">{filas.length} items</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-700">${subtotal.toFixed(2)}</span>
                {expandida ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>
            </button>

            {expandida && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-2 text-left">Descripción</th>
                        <th className="px-4 py-2 text-center w-20">Unidad</th>
                        <th className="px-4 py-2 text-right w-24">Cantidad</th>
                        <th className="px-4 py-2 text-right w-28">Precio unit.</th>
                        <th className="px-4 py-2 text-right w-24">Subtotal</th>
                        <th className="px-4 py-2 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filas.map(({ index, ...c }) => (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            <Input
                              placeholder={tipo === 'mano_obra' ? 'Ej: Albañil' : tipo === 'equipo' ? 'Ej: Mezcladora' : 'Ej: Cemento Portland'}
                              value={c.descripcion}
                              onChange={e => actualizarFila(index, 'descripcion', e.target.value)}
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              placeholder={tipo === 'mano_obra' ? 'hora' : 'und'}
                              value={c.unidad}
                              onChange={e => actualizarFila(index, 'unidad', e.target.value)}
                              className="h-8 text-sm text-center"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number" min="0" step="0.01"
                              placeholder="0.00"
                              value={c.cantidad || ''}
                              onChange={e => actualizarFila(index, 'cantidad', parseFloat(e.target.value) || 0)}
                              className="h-8 text-sm text-right"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Input
                              type="number" min="0" step="0.01"
                              placeholder="0.00"
                              value={c.precio_unitario || ''}
                              onChange={e => actualizarFila(index, 'precio_unitario', parseFloat(e.target.value) || 0)}
                              className="h-8 text-sm text-right"
                            />
                          </td>
                          <td className="px-4 py-2 text-right text-slate-700 font-medium">
                            ${(c.cantidad * c.precio_unitario).toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <button onClick={() => eliminarFila(index)} className="text-slate-300 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 border-t border-slate-100">
                  <button
                    onClick={() => agregarFila(tipo)}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar {label.toLowerCase()}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Resumen de costos */}
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wide mb-4">Resumen de costos</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Materiales</span>
            <span className="text-slate-700">${subtotalTipo('material').toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Mano de obra</span>
            <span className="text-slate-700">${subtotalTipo('mano_obra').toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Equipo</span>
            <span className="text-slate-700">${subtotalTipo('equipo').toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
            <span className="font-medium text-slate-700">Costo directo</span>
            <span className="font-medium text-slate-900">${costoDirecto.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Indirectos ({indirectos}%)</span>
            <span className="text-slate-500">+${montoIndirectos.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Utilidad ({utilidad}%)</span>
            <span className="text-slate-500">+${montoUtilidad.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t-2 border-blue-600">
            <span className="font-bold text-slate-900">Precio unitario</span>
            <span className="font-bold text-blue-600 text-xl">${precioUnitario.toFixed(2)}</span>
          </div>
          <p className="text-xs text-slate-400 text-right">por {unidad || 'unidad'}</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancelar}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors px-4 py-2"
        >
          Cancelar
        </button>
        <Button onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : apu?.id ? 'Actualizar APU' : 'Guardar APU'}
        </Button>
      </div>
    </div>
  )
}