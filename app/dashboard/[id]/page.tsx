import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/getUser'
import DeleteButton from '@/components/DeleteButton'
import DuplicarButton from '@/components/DuplicarButton'


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
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 text-sm">
          ← Dashboard
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">{presupuesto.nombre}</h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <div className="bg-white border border-slate-200 rounded-lg px-6 py-4 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-slate-500">Fecha</span>
            <p className="font-medium text-slate-900 mt-0.5">{fecha}</p>
          </div>
          <div>
            <span className="text-slate-500">Modo</span>
            <p className="font-medium text-slate-900 mt-0.5 capitalize">{presupuesto.modo}</p>
          </div>
          <div>
            <span className="text-slate-500">Total</span>
            <p className="font-bold text-slate-900 mt-0.5 text-lg">${Number(presupuesto.total).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Detalle de materiales</h3>
          </div>
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
                <tr key={item.id}>
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
                <td className="px-4 py-3 text-right font-bold text-slate-900">${Number(presupuesto.total).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
          >
            Volver al dashboard
          </Link>
          <Link
            href={`/dashboard/edit/${presupuesto.id}`}
            className="border border-slate-300 text-slate-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            Editar
          </Link>
          <a
            href={`/api/pdf?id=${presupuesto.id}`}
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Descargar PDF
          </a>
          <DuplicarButton id={presupuesto.id} />
          <DeleteButton id={presupuesto.id} />
        </div>

      </main>
    </div>
  )
}