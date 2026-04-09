import { Input } from '@/components/ui/input'

interface Item {
  id: string
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
}

interface Props {
  items: Item[]
  onPrecioChange: (id: string, valor: string) => void
  onEliminar?: (id: string) => void
  total: number
}

export default function TablaItems({ items, onPrecioChange, onEliminar, total }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Material</th>
            <th className="px-4 py-3 text-right">Cant.</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Unidad</th>
            <th className="px-4 py-3 text-right">Precio</th>
            <th className="px-4 py-3 text-right hidden sm:table-cell">Subtotal</th>
            {onEliminar && <th className="px-4 py-3 w-8"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map(item => (
            <tr key={item.id}>
              <td className="px-4 py-3 text-slate-700">{item.descripcion}</td>
              <td className="px-4 py-3 text-right text-slate-600">{item.cantidad}</td>
              <td className="px-4 py-3 text-center text-slate-500 hidden sm:table-cell">{item.unidad}</td>
              <td className="px-4 py-3 text-right">
                <Input
                  type="number"
                  min="0"
                  className="w-20 text-right h-8 text-sm"
                  placeholder="0.00"
                  value={item.precio_unitario === 0 ? '' : item.precio_unitario}
                  onChange={e => onPrecioChange(item.id, e.target.value)}
                />
              </td>
              <td className="px-4 py-3 text-right text-slate-700 font-medium hidden sm:table-cell">
                ${(item.cantidad * item.precio_unitario).toFixed(2)}
              </td>
              {onEliminar && (
                <td className="px-4 py-3">
                  <button
                    onClick={() => onEliminar(item.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-50 border-t border-slate-200">
          <tr>
            <td colSpan={onEliminar ? 4 : 3} className="px-4 py-3 text-right font-semibold text-slate-900">TOTAL</td>
            <td colSpan={2} className="px-4 py-3 text-right font-bold text-blue-600">${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}