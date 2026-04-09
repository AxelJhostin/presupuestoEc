'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Sesión cerrada.')
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
    >
      Cerrar sesión
    </button>
  )
}