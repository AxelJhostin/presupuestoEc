'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { CheckCircle2, Circle, MinusCircle } from 'lucide-react'

type Estado = 'pendiente' | 'comprado' | 'parcial'

interface Item {
  id: string
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
  subtotal: number
  estado: Estado
}

interface Props {
  items: Item[]
  presupuestoId: string
}

const ESTADOS: { value: Estado; label: string; icon: React.ReactNode; color: string }[] = [
  {
    value: 'pendiente',
    label: 'Pendiente',
    icon: <Circle className="w-4 h-4" />,
    color: 'text-slate-400',
  },
  {
    value: 'parcial',
    label: 'Parcial',
    icon: <MinusCircle className="w-4 h-4" />,
    color: 'text-amber-500',
  },
  {
    value: 'comprado',
    label: 'Comprado',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-green-500',
  },
]

export default function ListaCompras({ items: itemsIniciales }: Props) {
  const supabase = createClient()
  const [items, setItems] = useState<Item[]>(itemsIniciales)

  async function cambiarEstado(id: string, estado: Estado) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, estado } : i))

    const { error } = await supabase
      .from('items_presupuesto')
      .update({ estado })
      .eq('id', id)

    if (error) {
      toast.error('Error al actualizar el estado.')
      setItems(prev => prev.map(i => i.id === id ? { ...i, estado: i.estado } : i))
    }
  }

  const pendientes = items.filter(i => i.estado === 'pendiente')
  const parciales = items.filter(i => i.estado === 'parcial')
  const comprados = items.filter(i => i.estado === 'comprado')

  const totalPendiente = pendientes.reduce((acc, i) => acc + i.subtotal, 0)
  const totalParcial = parciales.reduce((acc, i) => acc + i.subtotal, 0)
  const totalComprado = comprados.reduce((acc, i) => acc + i.subtotal, 0)

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Lista de compras</h3>
        <p className="text-xs text-slate-400 mt-0.5">Marca el estado de cada material</p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        <div className="px-4 py-3 text-center">
          <p className="text-xs text-slate-400 mb-0.5">Pendiente</p>
          <p className="text-sm font-semibold text-slate-700">{pendientes.length} items</p>
          <p className="text-xs text-slate-500">${totalPendiente.toFixed(2)}</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-xs text-amber-500 mb-0.5">Parcial</p>
          <p className="text-sm font-semibold text-slate-700">{parciales.length} items</p>
          <p className="text-xs text-slate-500">${totalParcial.toFixed(2)}</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-xs text-green-500 mb-0.5">Comprado</p>
          <p className="text-sm font-semibold text-slate-700">{comprados.length} items</p>
          <p className="text-xs text-slate-500">${totalComprado.toFixed(2)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-slate-50">
        {items.map(item => {
          
          return (
            <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${item.estado === 'comprado' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {item.descripcion}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.cantidad} {item.unidad} · ${Number(item.subtotal).toFixed(2)}
                </p>
              </div>

              {/* Selector de estado */}
              <div className="flex items-center gap-1">
                {ESTADOS.map(e => (
                  <button
                    key={e.value}
                    onClick={() => cambiarEstado(item.id, e.value)}
                    className={`p-1.5 rounded-md transition-colors ${
                      item.estado === e.value
                        ? `${e.color} bg-slate-100`
                        : 'text-slate-300 hover:text-slate-400'
                    }`}
                    title={e.label}
                  >
                    {e.icon}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}