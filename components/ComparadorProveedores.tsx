'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, TrendingDown, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Proveedor {
  id: string
  nombre: string
  telefono?: string
  esGuardado?: boolean
}

interface Props {
  items: {
    id: string
    descripcion: string
    unidad: string
    cantidad: number
  }[]
  presupuestoId?: string
}

export default function ComparadorProveedores({ items, presupuestoId }: Props) {
  const supabase = createClient()
  const [proveedores, setProveedores] = useState<Proveedor[]>([
    { id: crypto.randomUUID(), nombre: 'Proveedor 1' },
    { id: crypto.randomUUID(), nombre: 'Proveedor 2' },
  ])
  const [cotizaciones, setCotizaciones] = useState<Record<string, Record<string, string>>>({})
  const [mostrar, setMostrar] = useState(false)
  const [proveedoresGuardados, setProveedoresGuardados] = useState<Proveedor[]>([])
  const [guardando, setGuardando] = useState(false)

  // Cargar proveedores guardados del usuario
  useEffect(() => {
    async function cargarProveedores() {
      const res = await fetch('/api/auth/me')
      if (!res.ok) return
      const { userId } = await res.json()

      const { data } = await supabase
        .from('proveedores')
        .select('id, nombre, telefono')
        .eq('user_id', userId)
        .order('nombre')

      if (data) setProveedoresGuardados(data)
    }
    if (mostrar) cargarProveedores()
  }, [mostrar])

  // Cargar cotizaciones guardadas si hay presupuestoId
 // Cargar cotizaciones guardadas si hay presupuestoId
  useEffect(() => {
    async function cargarCotizaciones() {
      if (!presupuestoId) return

      const { data } = await supabase
        .from('cotizaciones')
        .select('*, proveedores(id, nombre, telefono)')
        .eq('presupuesto_id', presupuestoId)

      console.log('cotizaciones cargadas:', data)

      if (!data || data.length === 0) return

      // Reconstruir proveedores únicos
      const proveedoresUnicos = Array.from(
        new Map(data.map(c => [c.proveedor_id, c.proveedores])).entries()
      ).map(([id, p]: [string, { nombre: string; telefono?: string }]) => ({ id, nombre: p.nombre, telefono: p.telefono, esGuardado: true }))

      if (proveedoresUnicos.length > 0) setProveedores(proveedoresUnicos)

      // Reconstruir cotizaciones usando descripcion como clave
      const nuevasCotizaciones: Record<string, Record<string, string>> = {}
      data.forEach(c => {
        const item = items.find(i => i.descripcion === c.item_descripcion)
        if (item) {
          if (!nuevasCotizaciones[item.id]) nuevasCotizaciones[item.id] = {}
          nuevasCotizaciones[item.id][c.proveedor_id] = String(c.precio_unitario)
        }
      })
      setCotizaciones(nuevasCotizaciones)
    }
    if (mostrar) cargarCotizaciones()
  }, [mostrar, presupuestoId])

  function agregarProveedor() {
    if (proveedores.length >= 5) return
    setProveedores(prev => [...prev, { id: crypto.randomUUID(), nombre: `Proveedor ${prev.length + 1}` }])
  }

  function agregarProveedorGuardado(proveedor: Proveedor) {
    if (proveedores.length >= 5) { toast.error('Máximo 5 proveedores.'); return }
    const yaEsta = proveedores.find(p => p.id === proveedor.id)
    if (yaEsta) { toast.info('Este proveedor ya está agregado.'); return }
    setProveedores(prev => [...prev, { ...proveedor, esGuardado: true }])
  }

  function eliminarProveedor(id: string) {
    if (proveedores.length <= 1) return
    setProveedores(prev => prev.filter(p => p.id !== id))
    setCotizaciones(prev => {
      const nuevo = { ...prev }
      Object.keys(nuevo).forEach(itemId => { delete nuevo[itemId][id] })
      return nuevo
    })
  }

  function actualizarNombre(id: string, nombre: string) {
    setProveedores(prev => prev.map(p => p.id === id ? { ...p, nombre } : p))
  }

  function actualizarPrecio(itemId: string, proveedorId: string, precio: string) {
    setCotizaciones(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], [proveedorId]: precio }
    }))
  }

  function getPrecio(itemId: string, proveedorId: string): string {
    return cotizaciones[itemId]?.[proveedorId] || ''
  }

  function getMenorPrecio(itemId: string): string | null {
    const precios = proveedores
      .map(p => ({ id: p.id, precio: parseFloat(cotizaciones[itemId]?.[p.id] || '') }))
      .filter(p => !isNaN(p.precio) && p.precio > 0)
    if (precios.length < 2) return null
    return precios.reduce((a, b) => a.precio < b.precio ? a : b).id
  }

  function getTotalProveedor(proveedorId: string): number {
    return items.reduce((acc, item) => {
      const precio = parseFloat(cotizaciones[item.id]?.[proveedorId] || '0') || 0
      return acc + precio * item.cantidad
    }, 0)
  }

  function getMejorProveedor(): string | null {
    const totales = proveedores
      .map(p => ({ id: p.id, total: getTotalProveedor(p.id) }))
      .filter(p => p.total > 0)
    if (totales.length < 2) return null
    return totales.reduce((a, b) => a.total < b.total ? a : b).id
  }

  async function guardarCotizacion() {
    if (!presupuestoId) { toast.error('Guarda el presupuesto primero.'); return }
    setGuardando(true)

    const res = await fetch('/api/auth/me')
    if (!res.ok) { setGuardando(false); return }
    const { userId } = await res.json()

    // Guardar proveedores nuevos que no estén guardados
    for (const p of proveedores) {
      if (!p.esGuardado) {
        const { data } = await supabase
          .from('proveedores')
          .insert({ user_id: userId, nombre: p.nombre, telefono: p.telefono || null })
          .select()
          .single()

        if (data) {
          // Actualizar el id local con el id real de BD
          setCotizaciones(prev => {
            const nuevo = { ...prev }
            Object.keys(nuevo).forEach(itemId => {
              if (nuevo[itemId][p.id] !== undefined) {
                nuevo[itemId][data.id] = nuevo[itemId][p.id]
                delete nuevo[itemId][p.id]
              }
            })
            return nuevo
          })
          setProveedores(prev => prev.map(prov =>
            prov.id === p.id ? { ...prov, id: data.id, esGuardado: true } : prov
          ))
          p.id = data.id
          p.esGuardado = true
        }
      }
    }

    // Eliminar cotizaciones anteriores de este presupuesto
    await supabase.from('cotizaciones').delete().eq('presupuesto_id', presupuestoId)

    // Insertar cotizaciones nuevas
    const filas = []
    for (const item of items) {
      for (const p of proveedores) {
        const precio = parseFloat(cotizaciones[item.id]?.[p.id] || '0') || 0
        if (precio > 0) {
          filas.push({
            presupuesto_id: presupuestoId,
            proveedor_id: p.id,
            item_descripcion: item.descripcion,
            item_unidad: item.unidad,
            item_cantidad: item.cantidad,
            precio_unitario: precio,
          })
        }
      }
    }

    if (filas.length > 0) {
      const { error } = await supabase.from('cotizaciones').insert(filas)
      if (error) {
        toast.error('Error al guardar cotizaciones.')
        setGuardando(false)
        return
      }
    }

    toast.success('Cotizaciones guardadas.')
    setGuardando(false)
  }

  const mejorProveedor = getMejorProveedor()

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Comparador de proveedores</h3>
          <p className="text-xs text-slate-400 mt-0.5">Ingresa los precios de cada proveedor para encontrar la mejor opción</p>
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

          {/* Proveedores guardados */}
          {proveedoresGuardados.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Tus proveedores guardados
              </p>
              <div className="flex flex-wrap gap-2">
                {proveedoresGuardados.map(p => (
                  <button
                    key={p.id}
                    onClick={() => agregarProveedorGuardado(p)}
                    className="text-xs border border-slate-200 rounded-md px-3 py-1.5 text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    + {p.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Proveedores activos */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Proveedores</p>
            <div className="flex flex-wrap gap-3">
              {proveedores.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <Input
                    value={p.nombre}
                    onChange={e => actualizarNombre(p.id, e.target.value)}
                    className="h-8 text-sm w-36"
                  />
                  <button
                    onClick={() => eliminarProveedor(p.id)}
                    disabled={proveedores.length <= 1}
                    className="text-slate-300 hover:text-red-400 transition-colors disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {proveedores.length < 5 && (
                <button
                  onClick={agregarProveedor}
                  className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium border border-dashed border-blue-300 px-3 py-1.5 rounded-md transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              )}
            </div>
          </div>

          {/* Tabla de cotizaciones */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Material</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Cant.</th>
                  {proveedores.map(p => (
                    <th key={p.id} className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">
                      {p.nombre}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => {
                  const menorId = getMenorPrecio(item.id)
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-2.5 text-slate-700 text-sm">{item.descripcion}</td>
                      <td className="px-4 py-2.5 text-center text-slate-500 text-xs">{item.cantidad} {item.unidad}</td>
                      {proveedores.map(p => {
                        const esMenor = menorId === p.id
                        return (
                          <td key={p.id} className="px-4 py-2.5">
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                placeholder="0.00"
                                value={getPrecio(item.id, p.id)}
                                onChange={e => actualizarPrecio(item.id, p.id, e.target.value)}
                                className={`h-8 text-sm text-right ${esMenor ? 'border-green-400 bg-green-50 text-green-700 font-medium' : ''}`}
                              />
                              {esMenor && (
                                <TrendingDown className="w-3 h-3 text-green-500 absolute right-2 top-2.5" />
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="border-t-2 border-slate-200 bg-slate-50">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-slate-900">
                    Total por proveedor
                  </td>
                  {proveedores.map(p => {
                    const total = getTotalProveedor(p.id)
                    const esMejor = mejorProveedor === p.id
                    return (
                      <td key={p.id} className="px-4 py-3 text-center">
                        <div className={`inline-flex flex-col items-center ${esMejor ? 'text-green-600' : 'text-slate-700'}`}>
                          <span className="font-bold text-sm">${total.toFixed(2)}</span>
                          {esMejor && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-0.5 font-medium">
                              Mejor precio
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Resumen de ahorro */}
          {mejorProveedor && (() => {
            const totales = proveedores.map(p => getTotalProveedor(p.id)).filter(t => t > 0)
            if (totales.length < 2) return null
            const mejor = Math.min(...totales)
            const peor = Math.max(...totales)
            const ahorro = peor - mejor
            const nombreMejor = proveedores.find(p => p.id === mejorProveedor)?.nombre
            return (
              <div className="bg-green-50 border border-green-200 rounded-lg px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Mejor opción: {nombreMejor}</span>
                </div>
                <p className="text-sm text-green-700">
                  Comprando con <strong>{nombreMejor}</strong> ahorras <strong>${ahorro.toFixed(2)}</strong> respecto al proveedor más caro.
                </p>
              </div>
            )
          })()}

          {/* Botón guardar */}
          {presupuestoId && (
            <button
              onClick={guardarCotizacion}
              disabled={guardando}
              className="flex items-center gap-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {guardando ? 'Guardando...' : 'Guardar cotizaciones'}
            </button>
          )}

        </div>
      )}
    </div>
  )
}