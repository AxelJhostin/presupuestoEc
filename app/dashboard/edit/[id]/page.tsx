'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, BookOpen, ArrowLeft, Save } from 'lucide-react'
import CatalogoSelector from '@/components/CatalogoSelector'
import ClienteForm, { type ClienteData } from '@/components/ClienteForm'
import type { ItemCatalogo } from '@/lib/catalogo'

interface FilaItem {
  tempId: string
  id?: string
  descripcion: string
  unidad: string
  cantidad: string
  precio_unitario: string
}

function nuevaFila(item?: ItemCatalogo): FilaItem {
  return {
    tempId: crypto.randomUUID(),
    descripcion: item?.descripcion || '',
    unidad: item?.unidad || 'und',
    cantidad: '',
    precio_unitario: '',
  }
}

export default function EditarPresupuestoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()

  const [nombre, setNombre] = useState('')
  const [filas, setFilas] = useState<FilaItem[]>([nuevaFila()])
  const [loading, setLoading] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false)
  const [cliente, setCliente] = useState<ClienteData>({
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_ruc: '',
  })

  useEffect(() => {
    async function cargar() {
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.push('/login'); return }

      const { data: presupuesto } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!presupuesto) { router.push('/dashboard'); return }

      const { data: items } = await supabase
        .from('items_presupuesto')
        .select('*')
        .eq('presupuesto_id', params.id)
        .order('orden')

      setNombre(presupuesto.nombre)
      setCliente({
        cliente_nombre: presupuesto.cliente_nombre || '',
        cliente_telefono: presupuesto.cliente_telefono || '',
        cliente_ruc: presupuesto.cliente_ruc || '',
      })
      setFilas(
        items?.map(item => ({
          tempId: crypto.randomUUID(),
          id: item.id,
          descripcion: item.descripcion,
          unidad: item.unidad,
          cantidad: String(item.cantidad),
          precio_unitario: String(item.precio_unitario),
        })) || [nuevaFila()]
      )
      setCargando(false)
    }
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(tempId: string, campo: keyof FilaItem, valor: string) {
    setFilas(prev => prev.map(f => f.tempId === tempId ? { ...f, [campo]: valor } : f))
  }

  function agregarFila() {
    setFilas(prev => [...prev, nuevaFila()])
  }

  function eliminarFila(tempId: string) {
    if (filas.length === 1) return
    setFilas(prev => prev.filter(f => f.tempId !== tempId))
  }

  function agregarDesdeCatalogo(item: ItemCatalogo) {
    const existe = filas.find(f => f.descripcion === item.descripcion)
    if (existe) { toast.info(`"${item.descripcion}" ya está en la lista.`); return }
    setFilas(prev => [...prev.filter(f => f.descripcion.trim() !== ''), nuevaFila(item)])
  }

  const total = filas.reduce((acc, f) => {
    return acc + (parseFloat(f.cantidad) || 0) * (parseFloat(f.precio_unitario) || 0)
  }, 0)

  async function handleGuardar() {
    if (!nombre.trim()) { toast.error('Ingresa un nombre para el presupuesto.'); return }
    const filasValidas = filas.filter(f => f.descripcion.trim())
    if (filasValidas.length === 0) { toast.error('Agrega al menos un item.'); return }

    setLoading(true)

    const { error: errP } = await supabase
      .from('presupuestos')
      .update({
        nombre: nombre.trim(),
        total,
        ...cliente,
      })
      .eq('id', params.id)

    if (errP) { toast.error('Error al actualizar.'); setLoading(false); return }

    await supabase.from('items_presupuesto').delete().eq('presupuesto_id', params.id)

    const { error: errI } = await supabase.from('items_presupuesto').insert(
      filasValidas.map((f, i) => ({
        presupuesto_id: params.id,
        descripcion: f.descripcion.trim(),
        unidad: f.unidad || 'und',
        cantidad: parseFloat(f.cantidad) || 0,
        precio_unitario: parseFloat(f.precio_unitario) || 0,
        orden: i,
      }))
    )

    if (errI) { toast.error('Error al guardar los items.'); setLoading(false); return }

    toast.success('Presupuesto actualizado.')
    router.push(`/dashboard/${params.id}`)
    router.refresh()
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/${params.id}`} className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <div>
              <h1 className="text-base font-semibold text-slate-900">Editar presupuesto</h1>
              <p className="text-xs text-slate-400">{nombre || 'Sin nombre'}</p>
            </div>
          </div>
          <Button onClick={handleGuardar} disabled={loading} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* Columna lateral */}
          <div className="xl:col-span-1 space-y-5">

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">Datos del proyecto</h2>
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre del proyecto</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre del proyecto"
                />
              </div>
            </div>

            <ClienteForm value={cliente} onChange={setCliente} />

            {/* Total flotante */}
            {total > 0 && (
              <div className="bg-blue-600 text-white rounded-xl px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-200">
                    {filas.filter(f => f.descripcion.trim()).length} items
                  </p>
                </div>
              </div>
            )}

            {/* Catálogo */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <button
                onClick={() => setMostrarCatalogo(!mostrarCatalogo)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors w-full"
              >
                <BookOpen className="w-4 h-4" />
                {mostrarCatalogo ? 'Ocultar catálogo' : 'Agregar desde catálogo'}
              </button>
              {mostrarCatalogo && (
                <div className="mt-4">
                  <CatalogoSelector onSelect={agregarDesdeCatalogo} />
                </div>
              )}
            </div>

          </div>

          {/* Tabla principal */}
          <div className="xl:col-span-3">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Items del presupuesto</h3>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  {filas.filter(f => f.descripcion.trim()).length} items
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Descripción</th>
                      <th className="px-4 py-3 text-center w-24">Unidad</th>
                      <th className="px-4 py-3 text-right w-28">Cantidad</th>
                      <th className="px-4 py-3 text-right w-32">Precio unit.</th>
                      <th className="px-4 py-3 text-right w-28">Subtotal</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filas.map(fila => {
                      const subtotal = (parseFloat(fila.cantidad) || 0) * (parseFloat(fila.precio_unitario) || 0)
                      return (
                        <tr key={fila.tempId}>
                          <td className="px-4 py-2">
                            <Input placeholder="Descripción" value={fila.descripcion} onChange={e => handleChange(fila.tempId, 'descripcion', e.target.value)} className="h-8 text-sm" />
                          </td>
                          <td className="px-4 py-2">
                            <Input placeholder="und" value={fila.unidad} onChange={e => handleChange(fila.tempId, 'unidad', e.target.value)} className="h-8 text-sm text-center" />
                          </td>
                          <td className="px-4 py-2">
                            <Input type="number" min="0" placeholder="0" value={fila.cantidad} onChange={e => handleChange(fila.tempId, 'cantidad', e.target.value)} className="h-8 text-sm text-right" />
                          </td>
                          <td className="px-4 py-2">
                            <Input type="number" min="0" placeholder="0.00" value={fila.precio_unitario} onChange={e => handleChange(fila.tempId, 'precio_unitario', e.target.value)} className="h-8 text-sm text-right" />
                          </td>
                          <td className="px-4 py-2 text-right text-slate-700 font-medium">
                            ${subtotal.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <button onClick={() => eliminarFila(fila.tempId)} className="text-slate-300 hover:text-red-400 transition-colors" disabled={filas.length === 1}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-right font-semibold text-slate-900">TOTAL</td>
                      <td className="px-4 py-3 text-right font-bold text-blue-600 text-base">${total.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={agregarFila}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar fila manualmente
                </button>
                <div className="xl:hidden">
                  <Button onClick={handleGuardar} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}