'use client'

import { FileSpreadsheet } from 'lucide-react'
import { exportarExcel } from '@/lib/exportExcel'

interface Item {
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface Props {
  nombre: string
  modo: string
  fecha: string
  total: number
  items: Item[]
  ingeniero?: {
    nombre: string
    email: string
    telefono: string
    empresa: string
  }
}

export default function ExcelButton(props: Props) {
  function handleExport() {
    exportarExcel(props)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
    >
      <FileSpreadsheet className="w-3.5 h-3.5" />
      <span className="hidden sm:block">Excel</span>
    </button>
  )
}