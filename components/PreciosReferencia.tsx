'use client'

import { useState, useMemo } from 'react'
import { Search, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { PRECIOS_REFERENCIA, CATEGORIAS_PRECIOS } from '@/lib/precios-referencia'

export default function PreciosReferencia() {
  const [mostrar, setMostrar] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState('')
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Record<string, boolean>>({})

  const filtrados = useMemo(() => {
    return PRECIOS_REFERENCIA.filter(p => {
      const coincideBusqueda = busqueda === '' ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase())
      const coincideCategoria = categoriaActiva === '' || p.categoria === categoriaActiva
      return coincideBusqueda && coincideCategoria
    })
  }, [busqueda, categoriaActiva])

  const agrupadosPorCategoria = useMemo(() => {
    const grupos: Record<string, typeof filtrados> = {}
    filtrados.forEach(p => {
      if (!grupos[p.categoria]) grupos[p.categoria] = []
      grupos[p.categoria].push(p)
    })
    return grupos
  }, [filtrados])

  function toggleCategoria(cat: string) {
    setCategoriasExpandidas(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  function isCategoriaExpandida(cat: string) {
    return categoriasExpandidas[cat] !== false
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="font-semibold text-slate-900">Precios de referencia</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Materiales y mano de obra — zona costera Manabí · 2025
            </p>
          </div>
        </div>
        <button
          onClick={() => setMostrar(!mostrar)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {mostrar ? 'Ocultar' : 'Consultar'}
        </button>
      </div>

      {mostrar && (
        <div>
          {/* Filtros */}
          <div className="px-6 py-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar material..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoriaActiva('')}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  categoriaActiva === ''
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 text-slate-500 hover:border-blue-300'
                }`}
              >
                Todos
              </button>
              {CATEGORIAS_PRECIOS.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat === categoriaActiva ? '' : cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    categoriaActiva === cat
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-200 text-slate-500 hover:border-blue-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Resultados */}
          <div className="divide-y divide-slate-100">
            {Object.keys(agrupadosPorCategoria).length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                No se encontraron materiales.
              </div>
            ) : (
              Object.entries(agrupadosPorCategoria).map(([categoria, items]) => (
                <div key={categoria}>
                  <button
                    onClick={() => toggleCategoria(categoria)}
                    className="w-full px-6 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      {categoria}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{items.length} items</span>
                      {isCategoriaExpandida(categoria)
                        ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      }
                    </div>
                  </button>

                  {isCategoriaExpandida(categoria) && (
                    <table className="w-full text-sm">
                      <thead className="bg-white">
                        <tr className="text-xs text-slate-400 uppercase">
                          <th className="px-6 py-2 text-left">Material</th>
                          <th className="px-4 py-2 text-center w-16">Unidad</th>
                          <th className="px-4 py-2 text-right w-24">Mín</th>
                          <th className="px-4 py-2 text-right w-24">Máx</th>
                          <th className="px-4 py-2 text-right w-28">Referencia</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {items.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3">
                              <p className="text-slate-700">{item.descripcion}</p>
                              {item.notas && (
                                <p className="text-xs text-slate-400 mt-0.5">{item.notas}</p>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-500 text-xs">{item.unidad}</td>
                            <td className="px-4 py-3 text-right text-slate-400 text-xs">${item.precio_min.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-slate-400 text-xs">${item.precio_max.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-bold text-blue-600">${item.precio_referencia.toFixed(2)}</span>
                              <span className="text-xs text-slate-400">/{item.unidad}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Aviso */}
          <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
            <p className="text-xs text-amber-700">
              ⚠️ Precios de referencia orientativos para zona costera de Manabí (2025). Pueden variar según proveedor, cantidad y localidad. Siempre cotiza con tus proveedores locales antes de presupuestar.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}