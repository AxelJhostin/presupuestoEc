import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/getUser'
import { Plus } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import StatsBar from '@/components/dashboard/StatsBar'
import PresupuestoCard from '@/components/dashboard/PresupuestoCard'
import EmptyState from '@/components/dashboard/EmptyState'

export default async function DashboardPage() {
  const supabase = createClient()
  const user = getUser()
  if (!user) redirect('/login')

  const { data: presupuestos } = await supabase
    .from('presupuestos')
    .select('*')
    .eq('user_id', user.userId)
    .order('fecha', { ascending: false })

  const lista = presupuestos || []
  const calculadora = lista.filter(p => p.modo === 'calculadora').length
  const libre = lista.filter(p => p.modo === 'libre').length

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-base font-bold text-slate-900">PresupuestoEC</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/perfil"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors hidden sm:block"
            >
              {user.email}
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <StatsBar total={lista.length} calculadora={calculadora} libre={libre} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Mis presupuestos</h2>
          <Link
            href="/dashboard/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo
          </Link>
        </div>

        {lista.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {lista.map(p => (
              <PresupuestoCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}