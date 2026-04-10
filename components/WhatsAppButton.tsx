'use client'

import { MessageCircle } from 'lucide-react'

interface Props {
  nombre: string
  numero?: number
  total: number
  imprevistos_pct?: number
  utilidad_pct?: number
  cliente_nombre?: string
  presupuestoId: string
  ingeniero?: {
    nombre: string
    telefono: string
    empresa: string
  }
}

export default function WhatsAppButton({
  nombre,
  numero,
  total,
  imprevistos_pct = 5,
  utilidad_pct = 10,
  cliente_nombre,
  presupuestoId,
  ingeniero,
}: Props) {
  function handleCompartir() {
    const totalFinal = total * (1 + imprevistos_pct / 100 + utilidad_pct / 100)
    const numeroStr = numero ? `P-${String(numero).padStart(3, '0')}` : ''
    const pdfUrl = `${window.location.origin}/api/pdf?id=${presupuestoId}`

    const lineas = [
      `*Presupuesto de Obra*${numeroStr ? ` — ${numeroStr}` : ''}`,
      ``,
      `*Proyecto:* ${nombre}`,
      cliente_nombre ? `*Cliente:* ${cliente_nombre}` : null,
      ``,
      `*Subtotal materiales:* $${total.toFixed(2)}`,
      imprevistos_pct > 0 ? `*Imprevistos (${imprevistos_pct}%):* +$${(total * imprevistos_pct / 100).toFixed(2)}` : null,
      utilidad_pct > 0 ? `*Utilidad (${utilidad_pct}%):* +$${(total * utilidad_pct / 100).toFixed(2)}` : null,
      `*Total final:* $${totalFinal.toFixed(2)}`,
      ``,
      ingeniero?.nombre ? `*Ing.* ${ingeniero.nombre}` : null,
      ingeniero?.empresa ? ingeniero.empresa : null,
      ingeniero?.telefono ? ingeniero.telefono : null,
      ``,
      `Para ver el detalle completo:`,
      pdfUrl,
    ]

    const mensaje = lineas.filter(l => l !== null).join('\n')
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleCompartir}
      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
    >
      <MessageCircle className="w-3.5 h-3.5" />
      <span className="hidden sm:block">WhatsApp</span>
    </button>
  )
}