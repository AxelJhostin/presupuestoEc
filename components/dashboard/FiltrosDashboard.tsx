'use client'

import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import PresupuestoCard from './PresupuestoCard'

interface Presupuesto {
  id: string
  nombre: string
  modo: string
  fecha: string
  total: number
  numero?: number
  estado?: string
  cliente_nombre?: string
}

interface Props {
  presupuestos: Presupuesto[]
}

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'aprobado', label: 'Aprobado' },
  { value: 'en_ejecucion', label: 'En ejecución' },
]

const MODOS = [
  { value: '', label: 'Todos' },
  { value: 'calculadora', label: 'Calculadora' },
  { value: 'libre', label: 'Libre' },
]

export default function FiltrosDashboard({ presupuestos }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroModo, setFiltroModo] = useState('')

  const filtrados = useMemo(() => {
    return presupuestos.filter(p => {
      const coincideBusqueda =
        busqueda === '' ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.cliente_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.numero && `P-${String(p.numero).padStart(3, '0')}`.includes(busqueda.toUpperCase()))

      const coincideEstado = filtroEstado === '' || (p.estado || 'borrador') === filtroEstado
      const coincideModo = filtroModo === '' || p.modo === filtroModo

      return coincideBusqueda && coincideEstado && coincideModo
    })
  }, [presupuestos, busqueda, filtroEstado, filtroModo])

  const hayFiltros = busqueda || filtroEstado || filtroModo

  return (
    <div className="space-y-4">
      {/* Controles de filtro */}
      <div className="flex flex-wrap gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, cliente o número..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Filtro estado */}
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white text-slate-600 focus:outline-none focus:border-blue-400"
        >
          {ESTADOS.map(e => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>

        {/* Filtro modo */}
        <select
          value={filtroModo}
          onChange={e => setFiltroModo(e.target.value)}
          className="text-sm border border-slate-200 rounded-md px-3 py-2 bg-white text-slate-600 focus:outline-none focus:border-blue-400"
        >
          {MODOS.map(m => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        {/* Limpiar filtros */}
        {hayFiltros && (
          <button
            onClick={() => { setBusqueda(''); setFiltroEstado(''); setFiltroModo('') }}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors px-2"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Resultados */}
      {filtrados.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No hay presupuestos que coincidan con los filtros.
        </div>
      ) : (
        <div className="space-y-2">
          {filtrados.map(p => (
            <PresupuestoCard key={p.id} p={p} />
          ))}
        </div>
      )}

      {/* Contador */}
      {hayFiltros && filtrados.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          {filtrados.length} de {presupuestos.length} presupuestos
        </p>
      )}
    </div>
  )
}