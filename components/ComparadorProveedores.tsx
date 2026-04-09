'use client'

import { useState } from 'react'
import { Plus, Trash2, TrendingDown } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Proveedor {
  id: string
  nombre: string
}

interface Cotizacion {
  proveedorId: string
  precio: string
}

interface ItemComparador {
  id: string
  descripcion: string
  unidad: string
  cantidad: number
  cotizaciones: Record<string, string>
}

interface Props {
  items: {
    id: string
    descripcion: string
    unidad: string
    cantidad: number
  }[]
}

export default function ComparadorProveedores({ items }: Props) {
  const [proveedores, setProveedores] = useState<Proveedor[]>([
    { id: crypto.randomUUID(), nombre: 'Proveedor 1' },
    { id: crypto.randomUUID(), nombre: 'Proveedor 2' },
  ])
  const [cotizaciones, setCotizaciones] = useState<Record<string, Record<string, string>>>({})
  const [mostrar, setMostrar] = useState(false)

  function agregarProveedor() {
    if (proveedores.length >= 5) return
    setProveedores(prev => [...prev, { id: crypto.randomUUID(), nombre: `Proveedor ${prev.length + 1}` }])
  }

  function eliminarProveedor(id: string) {
    if (proveedores.length <= 1) return
    setProveedores(prev => prev.filter(p => p.id !== id))
    setCotizaciones(prev => {
      const nuevo = { ...prev }
      Object.keys(nuevo).forEach(itemId => {
        delete nuevo[itemId][id]
      })
      return nuevo
    })
  }

  function actualizarNombre(id: string, nombre: string) {
    setProveedores(prev => prev.map(p => p.id === id ? { ...p, nombre } : p))
  }

  function actualizarPrecio(itemId: string, proveedorId: string, precio: string) {
    setCotizaciones(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [proveedorId]: precio,
      }
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
    const menor = precios.reduce((a, b) => a.precio < b.precio ? a : b)
    return menor.id
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

          {/* Proveedores */}
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

              {/* Totales */}
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

        </div>
      )}
    </div>
  )
}