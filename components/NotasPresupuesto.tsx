'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { FileText, Check } from 'lucide-react'

interface Props {
  presupuestoId: string
  notasIniciales: string
}

export default function NotasPresupuesto({ presupuestoId, notasIniciales }: Props) {
  const supabase = createClient()
  const [notas, setNotas] = useState(notasIniciales || '')
  const [guardando, setGuardando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  async function handleGuardar() {
    setGuardando(true)

    const { error } = await supabase
      .from('presupuestos')
      .update({ notas })
      .eq('id', presupuestoId)

    if (error) {
      toast.error('Error al guardar las notas.')
    } else {
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2000)
    }
    setGuardando(false)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-900">Notas y observaciones</h3>
        </div>
        <button
          onClick={handleGuardar}
          disabled={guardando}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          {guardado
            ? <><Check className="w-3.5 h-3.5 text-green-500" /> Guardado</>
            : guardando ? 'Guardando...' : 'Guardar notas'
          }
        </button>
      </div>
      <div className="px-6 py-4">
        <textarea
          value={notas}
          onChange={e => setNotas(e.target.value)}
          placeholder="Agrega observaciones, condiciones, exclusiones o cualquier nota relevante para este presupuesto..."
          rows={4}
          className="w-full text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none"
        />
      </div>
      {notas && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400">{notas.length} caracteres</p>
        </div>
      )}
    </div>
  )
}