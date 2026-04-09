import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Calculator, FileText } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: presupuestos } = await supabase
    .from('presupuestos')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">PresupuestoEC</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{user.email}</span>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Mis presupuestos</h2>
          <Link
            href="/dashboard/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            + Nuevo presupuesto
          </Link>
        </div>

        {!presupuestos || presupuestos.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium">Aún no tienes presupuestos</p>
            <p className="text-sm mt-1">Crea tu primer presupuesto para comenzar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {presupuestos.map(p => (
              <Link
                key={p.id}
                href={`/dashboard/${p.id}`}
                className="bg-white border border-slate-200 rounded-lg px-6 py-4 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-100">
                    {p.modo === 'calculadora'
                      ? <Calculator className="w-4 h-4 text-blue-600" />
                      : <FileText className="w-4 h-4 text-slate-500" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{p.nombre}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(p.fecha).toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' })}
                      {' · '}
                      <span className="capitalize">{p.modo}</span>
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-slate-900">${Number(p.total).toFixed(2)}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}