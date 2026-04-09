import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/getUser'
import { Calendar, Tag, ArrowLeft, Pencil, FileDown } from 'lucide-react'
import DeleteButton from '@/components/DeleteButton'
import DuplicarButton from '@/components/DuplicarButton'
import ListaCompras from '@/components/ListaCompras'
import NotasPresupuesto from '@/components/NotasPresupuesto'
import ResumenFinanciero from '@/components/ResumenFinanciero'
import ComparadorProveedores from '@/components/ComparadorProveedores'
import ExcelButton from '@/components/ExcelButton'

export default async function PresupuestoPage({ params }: { params: { id: string } }) {
  const user = getUser()
  if (!user) redirect('/login')

  const supabase = createClient()

  const { data: presupuesto } = await supabase
    .from('presupuestos')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.userId)
    .single()

  if (!presupuesto) notFound()

  const { data: items } = await supabase
    .from('items_presupuesto')
    .select('*')
    .eq('presupuesto_id', params.id)
    .order('orden')

  const fecha = new Date(presupuesto.fecha).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <h1 className="text-base font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
              {presupuesto.nombre}
            </h1>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/edit/${presupuesto.id}`}
              className="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Editar</span>
            </Link>
            <a
              href={`/api/pdf?id=${presupuesto.id}`}
              target="_blank"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:block">PDF</span>
            </a>
            <ExcelButton
              nombre={presupuesto.nombre}
              modo={presupuesto.modo}
              fecha={fecha}
              total={Number(presupuesto.total)}
              items={(items || []).map(item => ({
                descripcion: item.descripcion,
                unidad: item.unidad,
                cantidad: Number(item.cantidad),
                precio_unitario: Number(item.precio_unitario),
                subtotal: Number(item.subtotal),
              }))}
            />
            <DuplicarButton id={presupuesto.id} />
            <DeleteButton id={presupuesto.id} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Info */}
        <div className="bg-white border border-slate-200 rounded-lg px-6 py-5 flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">Fecha:</span>
            <span className="font-medium text-slate-900">{fecha}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">Modo:</span>
            <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${
              presupuesto.modo === 'calculadora'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {presupuesto.modo === 'calculadora' ? 'Calculadora NEC' : 'Modo libre'}
            </span>
          </div>
          <div className="ml-auto">
            <span className="text-slate-500 text-sm">Total: </span>
            <span className="text-xl font-bold text-slate-900">${Number(presupuesto.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Detalle de materiales</h3>
            <span className="text-xs text-slate-400">{items?.length || 0} items</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Descripción</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">Unidad</th>
                  <th className="px-4 py-3 text-right">Cantidad</th>
                  <th className="px-4 py-3 text-right hidden sm:table-cell">Precio unit.</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items?.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{item.descripcion}</td>
                    <td className="px-4 py-3 text-center text-slate-500 hidden sm:table-cell">{item.unidad}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{item.cantidad}</td>
                    <td className="px-4 py-3 text-right text-slate-600 hidden sm:table-cell">${Number(item.precio_unitario).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">${Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right font-semibold text-slate-900">TOTAL</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600 text-base">${Number(presupuesto.total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        

        {/* Lista de compras */}
        <ListaCompras
          items={(items || []).map(item => ({
            id: item.id,
            descripcion: item.descripcion,
            unidad: item.unidad,
            cantidad: Number(item.cantidad),
            precio_unitario: Number(item.precio_unitario),
            subtotal: Number(item.subtotal),
            estado: (item.estado || 'pendiente') as 'pendiente' | 'comprado' | 'parcial',
          }))}
          presupuestoId={presupuesto.id}
        />

        <ResumenFinanciero subtotal={Number(presupuesto.total)} />

        <ComparadorProveedores
          items={(items || []).map(item => ({
            id: item.id,
            descripcion: item.descripcion,
            unidad: item.unidad,
            cantidad: Number(item.cantidad),
          }))}
        />

        <NotasPresupuesto
          presupuestoId={presupuesto.id}
          notasIniciales={presupuesto.notas || ''}
        />

        {/* Acciones móvil */}
        <div className="flex flex-wrap gap-3 sm:hidden">
          <Link
            href={`/dashboard/edit/${presupuesto.id}`}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Link>
          <a
            href={`/api/pdf?id=${presupuesto.id}`}
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Descargar PDF
          </a>
        </div>
        

      </main>
    </div>
  )
}