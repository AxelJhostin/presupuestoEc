import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/getUser'
import { Calendar, Tag, ArrowLeft, Pencil, FileDown, Hash, User } from 'lucide-react'
import DeleteButton from '@/components/DeleteButton'
import DuplicarButton from '@/components/DuplicarButton'
import ListaCompras from '@/components/ListaCompras'
import NotasPresupuesto from '@/components/NotasPresupuesto'
import ResumenFinanciero from '@/components/ResumenFinanciero'
import ComparadorProveedores from '@/components/ComparadorProveedores'
import ExcelButton from '@/components/ExcelButton'
import SeccionesPresupuesto from '@/components/SeccionesPresupuesto'
import EstadoSelector from '@/components/EstadoSelector'
import WhatsAppButton from '@/components/WhatsAppButton'
import PlantillaButton from '@/components/PlantillaButton'
import APUSelector from '@/components/APUSelector'
import PreciosReferencia from '@/components/PreciosReferencia'

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

  const asignacionesIniciales = (items || []).reduce((acc, item) => {
    if (item.seccion) acc[item.id] = item.seccion
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">

          {/* Fila 1: navegación + título */}
          <div className="flex items-center gap-3 py-4 border-b border-slate-100">
            <Link href="/dashboard" className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-px h-4 bg-slate-200 shrink-0" />
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div>
                <div className="flex items-center gap-2">
                  {presupuesto.numero && (
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                      P-{String(presupuesto.numero).padStart(3, '0')}
                    </span>
                  )}
                  <h1 className="text-base font-semibold text-slate-900 truncate">
                    {presupuesto.nombre}
                  </h1>
                </div>
                {presupuesto.cliente_nombre && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cliente: {presupuesto.cliente_nombre}
                    {presupuesto.cliente_telefono && ` · ${presupuesto.cliente_telefono}`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                presupuesto.modo === 'calculadora'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {presupuesto.modo === 'calculadora' ? 'Calculadora NEC' : 'Modo libre'}
              </span>
            </div>
          </div>

          {/* Fila 2: acciones agrupadas */}
          <div className="flex items-center justify-between py-3">

            {/* Estado + Total */}
            <div className="flex items-center gap-4">
              <EstadoSelector
                presupuestoId={presupuesto.id}
                estadoInicial={presupuesto.estado || 'borrador'}
              />
              <div className="hidden sm:block w-px h-4 bg-slate-200" />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-sm text-slate-400">Total:</span>
                <span className="text-lg font-bold text-slate-900">${Number(presupuesto.total).toFixed(2)}</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">

              {/* Grupo exportar */}
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-1">
                <a
                  href={`/api/pdf?id=${presupuesto.id}`}
                  target="_blank"
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  PDF
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
                <WhatsAppButton
                  nombre={presupuesto.nombre}
                  numero={presupuesto.numero}
                  total={Number(presupuesto.total)}
                  imprevistos_pct={Number(presupuesto.imprevistos_pct ?? 5)}
                  utilidad_pct={Number(presupuesto.utilidad_pct ?? 10)}
                  cliente_nombre={presupuesto.cliente_nombre || undefined}
                  presupuestoId={presupuesto.id}
                />
              </div>

              {/* Separador */}
              <div className="w-px h-6 bg-slate-200" />

              {/* Grupo gestión */}
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/dashboard/edit/${presupuesto.id}`}
                  className="flex items-center gap-1.5 border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">Editar</span>
                </Link>
                <PlantillaButton
                  presupuestoId={presupuesto.id}
                  nombrePresupuesto={presupuesto.nombre}
                />
                <DuplicarButton id={presupuesto.id} />
                <DeleteButton id={presupuesto.id} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Layout de dos columnas en pantallas grandes */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Columna principal — 2/3 */}
          <div className="xl:col-span-2 space-y-6">

            {/* Info del presupuesto */}
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Fecha</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">{fecha}</span>
                  </div>
                </div>
                {presupuesto.numero && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">N° Presupuesto</p>
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">
                        P-{String(presupuesto.numero).padStart(3, '0')}
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Modo</p>
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      presupuesto.modo === 'calculadora'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {presupuesto.modo === 'calculadora' ? 'Calculadora NEC' : 'Modo libre'}
                    </span>
                  </div>
                </div>
                {presupuesto.cliente_nombre && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Cliente</p>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900 truncate">
                        {presupuesto.cliente_nombre}
                      </span>
                    </div>
                    {presupuesto.cliente_ruc && (
                      <p className="text-xs text-slate-400 mt-0.5">RUC: {presupuesto.cliente_ruc}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tabla de materiales */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Detalle de materiales</h3>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                  {items?.length || 0} items
                </span>
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

            <SeccionesPresupuesto
              items={(items || []).map(item => ({
                id: item.id,
                descripcion: item.descripcion,
                unidad: item.unidad,
                cantidad: Number(item.cantidad),
                precio_unitario: Number(item.precio_unitario),
                subtotal: Number(item.subtotal),
              }))}
              asignacionesIniciales={asignacionesIniciales}
            />

            <APUSelector presupuestoId={presupuesto.id} />

            <ComparadorProveedores
              items={(items || []).map(item => ({
                id: item.id,
                descripcion: item.descripcion,
                unidad: item.unidad,
                cantidad: Number(item.cantidad),
              }))}
              presupuestoId={presupuesto.id}
            />

          </div>

          {/* Columna lateral — 1/3 */}
          <div className="space-y-6">

            <ResumenFinanciero
              subtotal={Number(presupuesto.total)}
              presupuestoId={presupuesto.id}
              imprevistosInicial={Number(presupuesto.imprevistos_pct ?? 5)}
              utilidadInicial={Number(presupuesto.utilidad_pct ?? 10)}
            />

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

            <PreciosReferencia />

            <NotasPresupuesto
              presupuestoId={presupuesto.id}
              notasIniciales={presupuesto.notas || ''}
            />

          </div>
        </div>

        {/* Acciones móvil */}
        <div className="flex flex-wrap gap-3 sm:hidden mt-6">
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