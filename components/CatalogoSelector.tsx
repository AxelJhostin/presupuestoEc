'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { CATALOGO, CATEGORIAS, type ItemCatalogo } from '@/lib/catalogo'
import { Plus } from 'lucide-react'

interface Props {
  onSelect: (item: ItemCatalogo) => void
}

export default function CatalogoSelector({ onSelect }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [categoriaActiva, setCategoriaActiva] = useState<string>('Todos')

  const categorias = ['Todos', ...CATEGORIAS]

  const filtrados = CATALOGO.filter(item => {
    const coincideCategoria = categoriaActiva === 'Todos' || item.categoria === categoriaActiva
    const coincideBusqueda = item.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <p className="text-sm font-medium text-slate-700 mb-2">Catálogo de materiales</p>
        <Input
          placeholder="Buscar material..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      {/* Categorías */}
      <div className="flex gap-1.5 px-4 py-2 border-b border-slate-100 overflow-x-auto">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaActiva(cat)}
            className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              categoriaActiva === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="max-h-48 overflow-y-auto">
        {filtrados.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Sin resultados</p>
        ) : (
          filtrados.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left"
            >
              <div>
                <p className="text-sm text-slate-700">{item.descripcion}</p>
                <p className="text-xs text-slate-400">{item.categoria} · {item.unidad}</p>
              </div>
              <Plus className="w-4 h-4 text-blue-500 shrink-0 ml-2" />
            </button>
          ))
        )}
      </div>
    </div>
  )
}