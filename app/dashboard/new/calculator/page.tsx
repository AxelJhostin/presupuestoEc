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
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react'
import { calcularLosa, losaAItems } from '@/lib/formulas/losa'
import { calcularColumna, columnaAItems } from '@/lib/formulas/columna'
import { calcularPintura, pinturaAItems } from '@/lib/formulas/pintura'
import { calcularMamposteria, mamposteriaAItems } from '@/lib/formulas/mamposteria'
import { calcularCeramica, ceramicaAItems } from '@/lib/formulas/ceramica'
import { calcularContrapiso, contrapisoAItems } from '@/lib/formulas/contrapiso'
import TablaItems from '@/components/TablaItems'
import ComparadorProveedores from '@/components/ComparadorProveedores'
import SeccionesPresupuesto from '@/components/SeccionesPresupuesto'
import ClienteForm, { type ClienteData } from '@/components/ClienteForm'

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

const ELEMENTO_INFO: Record<Elemento, { descripcion: string; color: string }> = {
  losa: { descripcion: 'Calcula cemento, acero, arena, ripio y encofrado para losa maciza', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  columna: { descripcion: 'Calcula materiales para columna rectangular de hormigón armado', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  pintura: { descripcion: 'Calcula galones de pintura, empaste y lija por área de pared', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  mamposteria: { descripcion: 'Calcula bloques, mortero y acero para mampostería de bloque', color: 'bg-green-50 text-green-700 border-green-200' },
  ceramica: { descripcion: 'Calcula cerámica, bondex y fragua según tamaño de pieza', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  contrapiso: { descripcion: 'Calcula materiales para contrapiso con malla electrosoldada', color: 'bg-slate-50 text-slate-700 border-slate-200' },
}

export default function CalculatorPage() {
  const router = useRouter()

  const [elemento, setElemento] = useState<Elemento>('losa')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [itemsAcumulados, setItemsAcumulados] = useState<ItemCalculado[]>([])
  const [cliente, setCliente] = useState<ClienteData>({
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_ruc: '',
  })

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

  async function obtenerNumero(userId: string): Promise<number> {
    const supabase = createClient()
    const { data } = await supabase.rpc('generar_numero_presupuesto', { p_user_id: userId })
    return data || 1
  }

  async function handleGuardar() {
    if (!nombre.trim()) { toast.error('Ingresa un nombre para el presupuesto.'); return }
    if (itemsAcumulados.length === 0) { toast.error('Agrega al menos un elemento calculado.'); return }

    setLoading(true)

    const res = await fetch('/api/auth/me')
    if (!res.ok) { router.push('/login'); return }
    const { userId } = await res.json()

    const supabase = createClient()
    const numeroPresupuesto = await obtenerNumero(userId)

    const { data: presupuesto, error: errP } = await supabase
      .from('presupuestos')
      .insert({
        user_id: userId,
        nombre: nombre.trim(),
        modo: 'calculadora',
        total,
        numero: numeroPresupuesto,
        ...cliente,
      })
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

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/new" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <div>
              <h1 className="text-base font-semibold text-slate-900">Modo Calculadora NEC</h1>
              <p className="text-xs text-slate-400">Cálculo automático de materiales según normativa ecuatoriana</p>
            </div>
          </div>
          {itemsAcumulados.length > 0 && (
            <Button onClick={handleGuardar} disabled={loading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Guardar presupuesto'}
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Columna izquierda — formulario */}
          <div className="xl:col-span-1 space-y-5">

            {/* Nombre del proyecto */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Datos del proyecto</h2>
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre del proyecto</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Casa Sr. Pérez — Obra completa"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </div>
            </div>

            {/* Cliente */}
            <ClienteForm value={cliente} onChange={setCliente} />

            {/* Selector de elemento */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Elemento constructivo</h2>
              <Tabs value={elemento} onValueChange={v => setElemento(v as Elemento)}>
                <TabsList className="w-full grid grid-cols-3 h-auto gap-1">
                  <TabsTrigger value="losa" className="text-xs py-2">Losa</TabsTrigger>
                  <TabsTrigger value="columna" className="text-xs py-2">Columna</TabsTrigger>
                  <TabsTrigger value="pintura" className="text-xs py-2">Pintura</TabsTrigger>
                  <TabsTrigger value="mamposteria" className="text-xs py-2">Mampostería</TabsTrigger>
                  <TabsTrigger value="ceramica" className="text-xs py-2">Cerámica</TabsTrigger>
                  <TabsTrigger value="contrapiso" className="text-xs py-2">Contrapiso</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Info del elemento */}
              <div className={`text-xs px-3 py-2 rounded-lg border ${ELEMENTO_INFO[elemento].color}`}>
                {ELEMENTO_INFO[elemento].descripcion}
              </div>

              {/* Formulario de medidas */}
              <div className="space-y-3">
                {elemento === 'losa' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Largo (m)</Label><Input type="number" placeholder="5.00" value={losaLargo} onChange={e => setLosaLargo(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Ancho (m)</Label><Input type="number" placeholder="4.00" value={losaAncho} onChange={e => setLosaAncho(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Espesor (m)</Label><Input type="number" placeholder="0.20" value={losaEspesor} onChange={e => setLosaEspesor(e.target.value)} /></div>
                  </div>
                )}
                {elemento === 'columna' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Ancho (m)</Label><Input type="number" placeholder="0.30" value={colAncho} onChange={e => setColAncho(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Profundidad (m)</Label><Input type="number" placeholder="0.30" value={colProfundidad} onChange={e => setColProfundidad(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Altura (m)</Label><Input type="number" placeholder="3.00" value={colAltura} onChange={e => setColAltura(e.target.value)} /></div>
                  </div>
                )}
                {elemento === 'pintura' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Largo (m)</Label><Input type="number" placeholder="5.00" value={pintLargo} onChange={e => setPintLargo(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Alto (m)</Label><Input type="number" placeholder="2.80" value={pintAlto} onChange={e => setPintAlto(e.target.value)} /></div>
                    <div className="space-y-1">
                      <Label className="text-xs">Manos</Label>
                      <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={pintManos} onChange={e => setPintManos(parseInt(e.target.value) as 1|2|3)}>
                        <option value={1}>1 mano</option>
                        <option value={2}>2 manos</option>
                        <option value={3}>3 manos</option>
                      </select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Vanos (m²)</Label><Input type="number" placeholder="0" value={pintVanos} onChange={e => setPintVanos(e.target.value)} /></div>
                  </div>
                )}
                {elemento === 'mamposteria' && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Largo (m)</Label><Input type="number" placeholder="5.00" value={mampLargo} onChange={e => setMampLargo(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Alto (m)</Label><Input type="number" placeholder="2.80" value={mampAlto} onChange={e => setMampAlto(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Vanos (m²)</Label><Input type="number" placeholder="0" value={mampVanos} onChange={e => setMampVanos(e.target.value)} /></div>
                  </div>
                )}
                {elemento === 'ceramica' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Largo (m)</Label><Input type="number" placeholder="5.00" value={cerLargo} onChange={e => setCerLargo(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Ancho (m)</Label><Input type="number" placeholder="4.00" value={cerAncho} onChange={e => setCerAncho(e.target.value)} /></div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tamaño</Label>
                      <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={cerTamano} onChange={e => setCerTamano(e.target.value as '20x20'|'30x30'|'40x40'|'60x60')}>
                        <option value="20x20">20x20 cm</option>
                        <option value="30x30">30x30 cm</option>
                        <option value="40x40">40x40 cm</option>
                        <option value="60x60">60x60 cm</option>
                      </select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Vanos (m²)</Label><Input type="number" placeholder="0" value={cerVanos} onChange={e => setCerVanos(e.target.value)} /></div>
                  </div>
                )}
                {elemento === 'contrapiso' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Largo (m)</Label><Input type="number" placeholder="5.00" value={ctrLargo} onChange={e => setCtrLargo(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Ancho (m)</Label><Input type="number" placeholder="4.00" value={ctrAncho} onChange={e => setCtrAncho(e.target.value)} /></div>
                    <div className="space-y-1"><Label className="text-xs">Espesor (m)</Label><Input type="number" placeholder="0.08" value={ctrEspesor} onChange={e => setCtrEspesor(e.target.value)} /></div>
                    <div className="flex items-end pb-1">
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={ctrMalla} onChange={e => setCtrMalla(e.target.checked)} className="rounded" />
                        Malla electrosoldada R-84
                      </label>
                    </div>
                  </div>
                )}

                <Button onClick={handleCalcular} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Calcular y agregar
                </Button>
              </div>
            </div>

            {/* Total flotante */}
            {itemsAcumulados.length > 0 && (
              <div className="bg-blue-600 text-white rounded-xl px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wide">Total acumulado</p>
                  <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-200">{itemsAcumulados.length} materiales</p>
                  <p className="text-xs text-blue-200 mt-0.5">
                    {Array.from(new Set(itemsAcumulados.map(i => i.etiqueta))).length} elementos
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha — resultados */}
          <div className="xl:col-span-2 space-y-6">

            {itemsAcumulados.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl px-6 py-16 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-blue-400" />
                </div>
                <p className="font-medium text-slate-700 mb-1">Aquí aparecerán los materiales calculados</p>
                <p className="text-sm text-slate-400">Selecciona un elemento, ingresa las medidas y presiona Calcular y agregar</p>
              </div>
            ) : (
              <>
                {/* Items acumulados */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Materiales acumulados</h3>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{itemsAcumulados.length} items</span>
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
                            Quitar
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
                </div>

                {/* Secciones */}
                <SeccionesPresupuesto items={itemsParaComponentes} />

                {/* Comparador */}
                <ComparadorProveedores
                  items={itemsParaComponentes.map(i => ({
                    id: i.id,
                    descripcion: i.descripcion,
                    unidad: i.unidad,
                    cantidad: i.cantidad,
                  }))}
                />

                {/* Botón guardar móvil */}
                <div className="xl:hidden">
                  <Button onClick={handleGuardar} disabled={loading} className="w-full" size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Guardando...' : 'Guardar presupuesto completo'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}