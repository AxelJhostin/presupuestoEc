'use client'

import { useState } from 'react'
import { User, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface ClienteData {
  cliente_nombre: string
  cliente_telefono: string
  cliente_ruc: string
}

interface Props {
  value: ClienteData
  onChange: (data: ClienteData) => void
}

export default function ClienteForm({ value, onChange }: Props) {
  const [expandido, setExpandido] = useState(false)

  const tieneData = value.cliente_nombre || value.cliente_telefono || value.cliente_ruc

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-900 text-sm">Datos del cliente</span>
          {tieneData && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              {value.cliente_nombre || 'Completado'}
            </span>
          )}
        </div>
        {expandido
          ? <ChevronUp className="w-4 h-4 text-slate-400" />
          : <ChevronDown className="w-4 h-4 text-slate-400" />
        }
      </button>

      {expandido && (
        <div className="px-6 py-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Nombre del cliente</Label>
            <Input
              placeholder="Ej: Juan Pérez"
              value={value.cliente_nombre}
              onChange={e => onChange({ ...value, cliente_nombre: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input
              placeholder="Ej: 0991234567"
              value={value.cliente_telefono}
              onChange={e => onChange({ ...value, cliente_telefono: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>RUC / Cédula</Label>
            <Input
              placeholder="Ej: 1234567890001"
              value={value.cliente_ruc}
              onChange={e => onChange({ ...value, cliente_ruc: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}