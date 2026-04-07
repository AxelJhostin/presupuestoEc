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
import { calcularLosa, losaAItems } from '@/lib/formulas/losa'
import { calcularColumna, columnaAItems } from '@/lib/formulas/columna'
import { calcularPintura, pinturaAItems } from '@/lib/formulas/pintura'
import type { ElementoNEC } from '@/types/presupuesto'

export default function CalculatorPage() {
  const router = useRouter()
  const supabase = createClient()

  const [elemento, setElemento] = useState<ElementoNEC>('losa')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)

  // Inputs losa
  const [losaLargo, setLosaLargo] = useState('')
  const [losaAncho, setLosaAncho] = useState('')
  const [losaEspesor, setLosaEspesor] = useState('0.20')

  // Inputs columna
  const [colAncho, setColAncho] = useState('0.30')
  const [colProfundidad, setColProfundidad] = useState('0.30')
  const [colAltura, setColAltura] = useState('')

  // Inputs pintura
  const [pintLargo, setPintLargo] = useState('')
  const [pintAlto, setPintAlto] = useState('')
  const [pintManos, setPintManos] = useState<1|2|3>(2)
  const [pintVanos, setPintVanos] = useState('0')

  // Resultados
  const [items, setItems] = useState<{descripcion:string, cantidad:number, unidad:string, precio_unitario:number}[]>([])
  const [calculado, setCalculado] = useState(false)

  function handleCalcular() {
    if (elemento === 'losa') {
      const r = calcularLosa({
        largo: parseFloat(losaLargo),
        ancho: parseFloat(losaAncho),
        espesor: parseFloat(losaEspesor),
      })
      setItems(losaAItems(r).map(i => ({ ...i, precio_unitario: 0 })))
    } else if (elemento === 'columna') {
      const r = calcularColumna({
        ancho: parseFloat(colAncho),
        profundidad: parseFloat(colProfundidad),
        altura: parseFloat(colAltura),
      })
      setItems(columnaAItems(r).map(i => ({ ...i, precio_unitario: 0 })))
    } else {
      const r = calcularPintura({
        largo: parseFloat(pintLargo),
        alto: parseFloat(pintAlto),
        numero_manos: pintManos,
        area_vanos_m2: parseFloat(pintVanos) || 0,
      })
      setItems(pinturaAItems(r, pintManos).map(i => ({ ...i, precio_unitario: 0 })))
    }
    setCalculado(true)
  }

  function handlePrecioChange(index: number, valor: string) {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, precio_unitario: parseFloat(valor) || 0 } : item
    ))
  }

  const total = items.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0)

  async function handleGuardar() {
    if (!nombre.trim()) {
      toast.error('Ingresa un nombre para el presupuesto.')
      return
    }
    if (!calculado) {
      toast.error('Primero calcula los materiales.')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: presupuesto, error: errP } = await supabase
      .from('presupuestos')
      .insert({ user_id: user.id, nombre: nombre.trim(), modo: 'calculadora', total })
      .select()
      .single()

    if (errP || !presupuesto) {
      toast.error('Error al guardar el presupuesto.')
      setLoading(false)
      return
    }

    const itemsToInsert = items.map((item, i) => ({
      presupuesto_id: presupuesto.id,
      descripcion: item.descripcion,
      unidad: item.unidad,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      orden: i,
    }))

    const { error: errI } = await supabase.from('items_presupuesto').insert(itemsToInsert)

    if (errI) {
      toast.error('Error al guardar los items.')
      setLoading(false)
      return
    }

    toast.success('Presupuesto guardado.')
    router.push(`/dashboard/${presupuesto.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard/new" className="text-slate-400 hover:text-slate-600 text-sm">
          ← Volver
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">Modo Calculadora</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* Nombre del proyecto */}
        <div className="space-y-1.5">
          <Label htmlFor="nombre">Nombre del proyecto</Label>
          <Input
            id="nombre"
            placeholder="Ej: Casa Sr. Pérez — Losa planta baja"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        {/* Selector de elemento */}
        <div className="space-y-3">
          <Label>Elemento constructivo</Label>
          <Tabs value={elemento} onValueChange={v => { setElemento(v as ElementoNEC); setCalculado(false); setItems([]) }}>
            <TabsList className="w-full">
              <TabsTrigger value="losa" className="flex-1">Losa maciza</TabsTrigger>
              <TabsTrigger value="columna" className="flex-1">Columna</TabsTrigger>
              <TabsTrigger value="pintura" className="flex-1">Pintura</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Formulario dinámico */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
          {elemento === 'losa' && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Largo (m)</Label>
                  <Input type="number" placeholder="5.00" value={losaLargo} onChange={e => setLosaLargo(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Ancho (m)</Label>
                  <Input type="number" placeholder="4.00" value={losaAncho} onChange={e => setLosaAncho(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Espesor (m)</Label>
                  <Input type="number" placeholder="0.20" value={losaEspesor} onChange={e => setLosaEspesor(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {elemento === 'columna' && (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Ancho (m)</Label>
                  <Input type="number" placeholder="0.30" value={colAncho} onChange={e => setColAncho(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Profundidad (m)</Label>
                  <Input type="number" placeholder="0.30" value={colProfundidad} onChange={e => setColProfundidad(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Altura (m)</Label>
                  <Input type="number" placeholder="3.00" value={colAltura} onChange={e => setColAltura(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {elemento === 'pintura' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Largo (m)</Label>
                  <Input type="number" placeholder="5.00" value={pintLargo} onChange={e => setPintLargo(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Alto (m)</Label>
                  <Input type="number" placeholder="2.80" value={pintAlto} onChange={e => setPintAlto(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Número de manos</Label>
                  <select
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    value={pintManos}
                    onChange={e => setPintManos(parseInt(e.target.value) as 1|2|3)}
                  >
                    <option value={1}>1 mano</option>
                    <option value={2}>2 manos</option>
                    <option value={3}>3 manos</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Área de vanos a descontar (m²)</Label>
                  <Input type="number" placeholder="0" value={pintVanos} onChange={e => setPintVanos(e.target.value)} />
                </div>
              </div>
            </>
          )}

          <Button onClick={handleCalcular} className="w-full">
            Calcular materiales
          </Button>
        </div>

        {/* Tabla de resultados */}
        {calculado && items.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Materiales — ingresa precios unitarios</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Material</th>
                  <th className="px-4 py-3 text-right">Cantidad</th>
                  <th className="px-4 py-3 text-center">Unidad</th>
                  <th className="px-4 py-3 text-right">Precio unit.</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-slate-700">{item.descripcion}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{item.cantidad}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{item.unidad}</td>
                    <td className="px-4 py-3 text-right">
                      <Input
                        type="number"
                        className="w-24 text-right h-8 text-sm"
                        placeholder="0.00"
                        value={item.precio_unitario || ''}
                        onChange={e => handlePrecioChange(i, e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-slate-700 font-medium">
                      ${(item.cantidad * item.precio_unitario).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right font-semibold text-slate-900">TOTAL</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div className="px-6 py-4 border-t border-slate-100">
              <Button onClick={handleGuardar} disabled={loading} className="w-full">
                {loading ? 'Guardando...' : 'Guardar presupuesto'}
              </Button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}