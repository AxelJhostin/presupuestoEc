import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyToken } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const supabase = createClient()

    // Eliminar todos los datos del usuario en cascada
    // Las tablas con ON DELETE CASCADE se eliminan automáticamente
    // Solo necesitamos eliminar el usuario
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', user.userId)

    if (error) {
      return NextResponse.json({ error: 'Error al eliminar la cuenta' }, { status: 500 })
    }

    // Borrar cookie
    const response = NextResponse.json({ ok: true })
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}