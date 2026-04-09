'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2 } from 'lucide-react'
import { calcularLosa, losaAItems } from '@/lib/formulas/losa'
import { calcularColumna, columnaAItems } from '@/lib/formulas/columna'
import { calcularPintura, pinturaAItems } from '@/lib/formulas/pintura'
import { calcularMamposteria, mamposteriaAItems } from '@/lib/formulas/mamposteria'
import { calcularCeramica, ceramicaAItems } from '@/lib/formulas/ceramica'
import { calcularContrapiso, contrapisoAItems } from '@/lib/formulas/contrapiso'
import TablaItems from '@/components/TablaItems'
import ComparadorProveedores from '@/components/ComparadorProveedores'
import SeccionesPresupuesto from '@/components/SeccionesPresupuesto'

type Elemento = 'losa' | 'columna' | 'pintura' | 'mamposteria' | 'ceramica' | 'contrapiso'

interface ItemCalculado {
  tempId: string
  etiqueta: string
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
}

const ETIQUETAS: Record<Elemento, string> = {
  losa: 'Losa maciza',
  columna: 'Columna',
  pintura: 'Pintura',
  mamposteria: 'Mampostería',
  ceramica: 'Cerámica',
  contrapiso: 'Contrapiso',
}

export default function CalculatorPage() {
  const router = useRouter()

  const [elemento, setElemento] = useState<Elemento>('losa')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [itemsAcumulados, setItemsAcumulados] = useState<ItemCalculado[]>([])

  // Losa
  const [losaLargo, setLosaLargo] = useState('')
  const [losaAncho, setLosaAncho] = useState('')
  const [losaEspesor, setLosaEspesor] = useState('0.20')

  // Columna
  const [colAncho, setColAncho] = useState('0.30')
  const [colProfundidad, setColProfundidad] = useState('0.30')
  const [colAltura, setColAltura] = useState('')

  // Pintura
  const [pintLargo, setPintLargo] = useState('')
  const [pintAlto, setPintAlto] = useState('')
  const [pintManos, setPintManos] = useState<1|2|3>(2)
  const [pintVanos, setPintVanos] = useState('0')

  // Mampostería
  const [mampLargo, setMampLargo] = useState('')
  const [mampAlto, setMampAlto] = useState('')
  const [mampVanos, setMampVanos] = useState('0')

  // Cerámica
  const [cerLargo, setCerLargo] = useState('')
  const [cerAncho, setCerAncho] = useState('')
  const [cerVanos, setCerVanos] = useState('0')
  const [cerTamano, setCerTamano] = useState<'20x20'|'30x30'|'40x40'|'60x60'>('30x30')

  // Contrapiso
  const [ctrLargo, setCtrLargo] = useState('')
  const [ctrAncho, setCtrAncho] = useState('')
  const [ctrEspesor, setCtrEspesor] = useState('0.08')
  const [ctrMalla, setCtrMalla] = useState(true)

  function handleCalcular() {
    let nuevosItems: { descripcion: string; unidad: string; cantidad: number }[] = []

    if (elemento === 'losa') {
      const r = calcularLosa({ largo: parseFloat(losaLargo), ancho: parseFloat(losaAncho), espesor: parseFloat(losaEspesor) })
      nuevosItems = losaAItems(r)
    } else if (elemento === 'columna') {
      const r = calcularColumna({ ancho: parseFloat(colAncho), profundidad: parseFloat(colProfundidad), altura: parseFloat(colAltura) })
      nuevosItems = columnaAItems(r)
    } else if (elemento === 'pintura') {
      const r = calcularPintura({ largo: parseFloat(pintLargo), alto: parseFloat(pintAlto), numero_manos: pintManos, area_vanos_m2: parseFloat(pintVanos) || 0 })
      nuevosItems = pinturaAItems(r, pintManos)
    } else if (elemento === 'mamposteria') {
      const r = calcularMamposteria({ largo: parseFloat(mampLargo), alto: parseFloat(mampAlto), area_vanos_m2: parseFloat(mampVanos) || 0 })
      nuevosItems = mamposteriaAItems(r)
    } else if (elemento === 'ceramica') {
      const r = calcularCeramica({ largo: parseFloat(cerLargo), ancho: parseFloat(cerAncho), area_vanos_m2: parseFloat(cerVanos) || 0, tamano_ceramica: cerTamano })
      nuevosItems = ceramicaAItems(r, cerTamano)
    } else if (elemento === 'contrapiso') {
      const r = calcularContrapiso({ largo: parseFloat(ctrLargo), ancho: parseFloat(ctrAncho), espesor: parseFloat(ctrEspesor), con_malla: ctrMalla })
      nuevosItems = contrapisoAItems(r)
    }

    const itemsConId = nuevosItems.map(i => ({
      tempId: crypto.randomUUID(),
      etiqueta: ETIQUETAS[elemento],
      descripcion: i.descripcion,
      unidad: i.unidad,
      cantidad: i.cantidad,
      precio_unitario: 0,
    }))

    setItemsAcumulados(prev => [...prev, ...itemsConId])
    toast.success(`${ETIQUETAS[elemento]} agregado — ${nuevosItems.length} materiales`)
  }

  function handlePrecioChange(tempId: string, valor: string) {
    const num = Math.max(0, parseFloat(valor) || 0)
    setItemsAcumulados(prev => prev.map(i => i.tempId === tempId ? { ...i, precio_unitario: num } : i))
  }

  function eliminarItem(tempId: string) {
    setItemsAcumulados(prev => prev.filter(i => i.tempId !== tempId))
  }

  const total = itemsAcumulados.reduce((acc, i) => acc + i.cantidad * i.precio_unitario, 0)

  const itemsParaComponentes = itemsAcumulados.map(i => ({
    id: i.tempId,
    descripcion: i.descripcion,
    unidad: i.unidad,
    cantidad: i.cantidad,
    precio_unitario: i.precio_unitario,
    subtotal: i.cantidad * i.precio_unitario,
  }))

  async function handleGuardar() {
    if (!nombre.trim()) { toast.error('Ingresa un nombre para el presupuesto.'); return }
    if (itemsAcumulados.length === 0) { toast.error('Agrega al menos un elemento calculado.'); return }

    setLoading(true)

    const res = await fetch('/api/auth/me')
    if (!res.ok) { router.push('/login'); return }
    const { userId } = await res.json()

    const supabase = createClient()

    const { data: presupuesto, error: errP } = await supabase
      .from('presupuestos')
      .insert({ user_id: userId, nombre: nombre.trim(), modo: 'calculadora', total })
      .select()
      .single()

    if (errP || !presupuesto) { toast.error('Error al guardar.'); setLoading(false); return }

    const { error: errI } = await supabase.from('items_presupuesto').insert(
      itemsAcumulados.map((item, i) => ({
        presupuesto_id: presupuesto.id,
        descripcion: item.descripcion,
        unidad: item.unidad,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        orden: i,
      }))
    )

    if (errI) { toast.error('Error al guardar los items.'); setLoading(false); return }

    toast.success('Presupuesto guardado.')
    router.push(`/dashboard/${presupuesto.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard/new" className="text-slate-400 hover:text-slate-600 text-sm">← Volver</Link>
        <h1 className="text-lg font-semibold text-slate-900">Modo Calculadora</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Nombre */}
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre del proyecto</Label>
          <Input
            id="nombre"
            placeholder="Ej: Casa Sr. Pérez — Obra completa"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        {/* Selector */}
        <div className="space-y-3">
          <Label>Elemento constructivo</Label>
          <Tabs value={elemento} onValueChange={v => setElemento(v as Elemento)}>
            <TabsList className="w-full flex-wrap h-auto">
              <TabsTrigger value="losa" className="flex-1">Losa</TabsTrigger>
              <TabsTrigger value="columna" className="flex-1">Columna</TabsTrigger>
              <TabsTrigger value="pintura" className="flex-1">Pintura</TabsTrigger>
              <TabsTrigger value="mamposteria" className="flex-1">Mampostería</TabsTrigger>
              <TabsTrigger value="ceramica" className="flex-1">Cerámica</TabsTrigger>
              <TabsTrigger value="contrapiso" className="flex-1">Contrapiso</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Formulario */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          {elemento === 'losa' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Largo (m)</Label><Input type="number" placeholder="5.00" value={losaLargo} onChange={e => setLosaLargo(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Ancho (m)</Label><Input type="number" placeholder="4.00" value={losaAncho} onChange={e => setLosaAncho(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Espesor (m)</Label><Input type="number" placeholder="0.20" value={losaEspesor} onChange={e => setLosaEspesor(e.target.value)} /></div>
            </div>
          )}
          {elemento === 'columna' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Ancho (m)</Label><Input type="number" placeholder="0.30" value={colAncho} onChange={e => setColAncho(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Profundidad (m)</Label><Input type="number" placeholder="0.30" value={colProfundidad} onChange={e => setColProfundidad(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Altura (m)</Label><Input type="number" placeholder="3.00" value={colAltura} onChange={e => setColAltura(e.target.value)} /></div>
            </div>
          )}
          {elemento === 'pintura' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Largo (m)</Label><Input type="number" placeholder="5.00" value={pintLargo} onChange={e => setPintLargo(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Alto (m)</Label><Input type="number" placeholder="2.80" value={pintAlto} onChange={e => setPintAlto(e.target.value)} /></div>
              <div className="space-y-1.5">
                <Label>Número de manos</Label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={pintManos} onChange={e => setPintManos(parseInt(e.target.value) as 1|2|3)}>
                  <option value={1}>1 mano</option>
                  <option value={2}>2 manos</option>
                  <option value={3}>3 manos</option>
                </select>
              </div>
              <div className="space-y-1.5"><Label>Vanos a descontar (m²)</Label><Input type="number" placeholder="0" value={pintVanos} onChange={e => setPintVanos(e.target.value)} /></div>
            </div>
          )}
          {elemento === 'mamposteria' && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5"><Label>Largo (m)</Label><Input type="number" placeholder="5.00" value={mampLargo} onChange={e => setMampLargo(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Alto (m)</Label><Input type="number" placeholder="2.80" value={mampAlto} onChange={e => setMampAlto(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Vanos a descontar (m²)</Label><Input type="number" placeholder="0" value={mampVanos} onChange={e => setMampVanos(e.target.value)} /></div>
            </div>
          )}
          {elemento === 'ceramica' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Largo (m)</Label><Input type="number" placeholder="5.00" value={cerLargo} onChange={e => setCerLargo(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Ancho (m)</Label><Input type="number" placeholder="4.00" value={cerAncho} onChange={e => setCerAncho(e.target.value)} /></div>
              <div className="space-y-1.5">
                <Label>Tamaño de cerámica</Label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={cerTamano} onChange={e => setCerTamano(e.target.value as '20x20'|'30x30'|'40x40'|'60x60')}>
                  <option value="20x20">20x20 cm</option>
                  <option value="30x30">30x30 cm</option>
                  <option value="40x40">40x40 cm</option>
                  <option value="60x60">60x60 cm</option>
                </select>
              </div>
              <div className="space-y-1.5"><Label>Vanos a descontar (m²)</Label><Input type="number" placeholder="0" value={cerVanos} onChange={e => setCerVanos(e.target.value)} /></div>
            </div>
          )}
          {elemento === 'contrapiso' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Largo (m)</Label><Input type="number" placeholder="5.00" value={ctrLargo} onChange={e => setCtrLargo(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Ancho (m)</Label><Input type="number" placeholder="4.00" value={ctrAncho} onChange={e => setCtrAncho(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Espesor (m)</Label><Input type="number" placeholder="0.08" value={ctrEspesor} onChange={e => setCtrEspesor(e.target.value)} /></div>
              <div className="space-y-1.5 flex items-end">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={ctrMalla} onChange={e => setCtrMalla(e.target.checked)} className="rounded" />
                  Incluir malla electrosoldada R-84
                </label>
              </div>
            </div>
          )}

          <Button onClick={handleCalcular} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Calcular y agregar al presupuesto
          </Button>
        </div>

        {/* Items acumulados agrupados por elemento */}
        {itemsAcumulados.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Materiales acumulados</h3>
              <span className="text-xs text-slate-400">{itemsAcumulados.length} items</span>
            </div>

            {Array.from(new Set(itemsAcumulados.map(i => i.etiqueta))).map(etiqueta => {
              const grupo = itemsAcumulados.filter(i => i.etiqueta === etiqueta)
              return (
                <div key={etiqueta}>
                  <div className="px-6 py-2 bg-blue-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">{etiqueta}</span>
                    <button
                      onClick={() => setItemsAcumulados(prev => prev.filter(i => i.etiqueta !== etiqueta))}
                      className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Quitar sección
                    </button>
                  </div>
                  <TablaItems
                    items={grupo.map(i => ({ id: i.tempId, descripcion: i.descripcion, unidad: i.unidad, cantidad: i.cantidad, precio_unitario: i.precio_unitario }))}
                    onPrecioChange={handlePrecioChange}
                    onEliminar={eliminarItem}
                    total={grupo.reduce((acc, i) => acc + i.cantidad * i.precio_unitario, 0)}
                  />
                </div>
              )
            })}

            <div className="px-6 py-4 bg-slate-50 border-t-2 border-blue-600 flex items-center justify-between">
              <span className="font-bold text-slate-900">TOTAL GENERAL</span>
              <span className="font-bold text-blue-600 text-xl">${total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Secciones */}
        {itemsParaComponentes.length > 0 && (
          <SeccionesPresupuesto items={itemsParaComponentes} />
        )}

        {/* Comparador */}
        {itemsParaComponentes.length > 0 && (
          <ComparadorProveedores
            items={itemsParaComponentes.map(i => ({
              id: i.id,
              descripcion: i.descripcion,
              unidad: i.unidad,
              cantidad: i.cantidad,
            }))}
          />
        )}

        {/* Guardar */}
        {itemsAcumulados.length > 0 && (
          <Button onClick={handleGuardar} disabled={loading} className="w-full" size="lg">
            {loading ? 'Guardando...' : 'Guardar presupuesto completo'}
          </Button>
        )}

      </main>
    </div>
  )
}