import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">PresupuestoEC</h1>
        <span className="text-sm text-slate-500">{user.email}</span>
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
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg font-medium">Aún no tienes presupuestos</p>
          <p className="text-sm mt-1">Crea tu primer presupuesto para comenzar</p>
        </div>
      </main>
    </div>
  )
}