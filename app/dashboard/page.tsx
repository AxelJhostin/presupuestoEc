import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/getUser'
import { Plus, Calculator, LayoutDashboard, User } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import StatsBar from '@/components/dashboard/StatsBar'
import FiltrosDashboard from '@/components/dashboard/FiltrosDashboard'
import EmptyState from '@/components/dashboard/EmptyState'
import BannerBienvenida from '@/components/dashboard/BannerBienvenida'


export default async function DashboardPage() {
  const supabase = createClient()
  const user = getUser()
  if (!user) redirect('/login')

  const { data: presupuestos } = await supabase
    .from('presupuestos')
    .select('*')
    .eq('user_id', user.userId)
    .eq('es_plantilla', false)
    .order('fecha', { ascending: false })

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('onboarding_completado')
    .eq('id', user.userId)
    .single()

  const lista = presupuestos || []
  const calculadora = lista.filter(p => p.modo === 'calculadora').length
  const libre = lista.filter(p => p.modo === 'libre').length
  const aprobados = lista.filter(p => p.estado === 'aprobado').length
  const totalFacturado = lista
    .filter(p => p.estado === 'aprobado' || p.estado === 'en_ejecucion')
    .reduce((acc, p) => acc + Number(p.total), 0)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <div>
                <span className="text-base font-bold text-slate-900">PresupuestoEC</span>
                <span className="hidden sm:inline text-xs text-slate-400 ml-2">Generador de presupuestos de obra</span>
              </div>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-md"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/apus"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-md transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Biblioteca APU
              </Link>
            </nav>

            {/* Usuario */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/perfil"
                className="hidden sm:flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-md transition-colors"
              >
                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <span className="max-w-[140px] truncate">{user.email}</span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Mis presupuestos</h1>
            <p className="text-blue-200 text-sm">Gestiona y organiza todos tus proyectos de obra</p>
          </div>
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo presupuesto
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Banner bienvenida */}
        {!perfil?.onboarding_completado && (
          <BannerBienvenida userId={user.userId} />
        )}

        {/* Stats */}
        <StatsBar
          total={lista.length}
          calculadora={calculadora}
          libre={libre}
          aprobados={aprobados}
          totalFacturado={totalFacturado}
        />

        {/* Lista */}
        <div className="mt-8">
          {lista.length === 0 ? (
            <EmptyState />
          ) : (
            <FiltrosDashboard presupuestos={lista} />
          )}
        </div>

      </main>
    </div>
  )
}