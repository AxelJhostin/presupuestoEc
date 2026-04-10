'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  subtotal: number
  presupuestoId: string
  imprevistosInicial?: number
  utilidadInicial?: number
}

export default function ResumenFinanciero({ subtotal, presupuestoId, imprevistosInicial = 5, utilidadInicial = 10 }: Props) {
  const supabase = createClient()
  const [imprevistos, setImprevistos] = useState(imprevistosInicial)
  const [utilidad, setUtilidad] = useState(utilidadInicial)

  const montoImprevistos = subtotal * (imprevistos / 100)
  const montoUtilidad = subtotal * (utilidad / 100)
  const total = subtotal + montoImprevistos + montoUtilidad

  async function guardar(campo: 'imprevistos_pct' | 'utilidad_pct', valor: number) {
    await supabase
      .from('presupuestos')
      .update({ [campo]: valor })
      .eq('id', presupuestoId)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">Resumen financiero</h3>
        <p className="text-xs text-slate-400 mt-0.5">Ajusta los porcentajes según tu criterio</p>
      </div>
      <div className="px-6 py-4 space-y-4">
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="text-sm text-slate-600">Subtotal materiales</span>
          <span className="text-sm font-medium text-slate-900">${subtotal.toFixed(2)}</span>
        </div>

        {/* Imprevistos */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm text-slate-600 w-28 shrink-0">Imprevistos</span>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={imprevistos}
                onChange={e => setImprevistos(Number(e.target.value))}
                onMouseUp={e => guardar('imprevistos_pct', Number((e.target as HTMLInputElement).value))}
                onTouchEnd={e => guardar('imprevistos_pct', Number((e.target as HTMLInputElement).value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-medium text-slate-700 w-10 text-right">{imprevistos}%</span>
            </div>
          </div>
          <span className="text-sm text-slate-500 w-24 text-right">+${montoImprevistos.toFixed(2)}</span>
        </div>

        {/* Utilidad */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-sm text-slate-600 w-28 shrink-0">Utilidad</span>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={utilidad}
                onChange={e => setUtilidad(Number(e.target.value))}
                onMouseUp={e => guardar('utilidad_pct', Number((e.target as HTMLInputElement).value))}
                onTouchEnd={e => guardar('utilidad_pct', Number((e.target as HTMLInputElement).value))}
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm font-medium text-slate-700 w-10 text-right">{utilidad}%</span>
            </div>
          </div>
          <span className="text-sm text-slate-500 w-24 text-right">+${montoUtilidad.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-blue-600">
          <span className="font-bold text-slate-900">Total con imprevistos y utilidad</span>
          <span className="text-xl font-bold text-blue-600">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}