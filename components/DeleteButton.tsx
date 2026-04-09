'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('presupuestos')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Error al eliminar el presupuesto.')
      setLoading(false)
      return
    }

    toast.success('Presupuesto eliminado.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <button
      onClick={e => { e.preventDefault(); handleDelete() }}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-md transition-colors ${
        confirming
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'border border-slate-300 text-slate-500 hover:text-red-500 hover:border-red-300'
      }`}
    >
      <Trash2 className="w-4 h-4" />
      {confirming ? '¿Confirmar?' : 'Eliminar'}
    </button>
  )
}