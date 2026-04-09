'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

export default function DuplicarButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDuplicar() {
    setLoading(true)

    const res = await fetch('/api/presupuestos/duplicar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    const data = await res.json()

    if (!res.ok) {
      toast.error('Error al duplicar el presupuesto.')
      setLoading(false)
      return
    }

    toast.success('Presupuesto duplicado.')
    router.push(`/dashboard/${data.id}`)
    router.refresh()
  }

  return (
    <button
      onClick={handleDuplicar}
      disabled={loading}
      className="flex items-center gap-1.5 border border-slate-300 text-slate-700 text-sm font-medium px-3 py-2 rounded-md hover:bg-slate-50 transition-colors"
    >
      <Copy className="w-4 h-4" />
      {loading ? 'Duplicando...' : 'Duplicar'}
    </button>
  )
}