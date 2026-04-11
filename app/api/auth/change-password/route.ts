import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyToken, hashPassword, verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const { passwordActual, passwordNueva } = await request.json()

    if (!passwordActual || !passwordNueva) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    if (passwordNueva.length < 6) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const supabase = createClient()

    // Obtener contraseña actual
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('password_hash')
      .eq('id', user.userId)
      .single()

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar contraseña actual
    const esValida = await verifyPassword(passwordActual, usuario.password_hash)
    if (!esValida) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 })
    }

    // Hashear y guardar nueva contraseña
    const password_hash = await hashPassword(passwordNueva)

    const { error } = await supabase
      .from('usuarios')
      .update({ password_hash })
      .eq('id', user.userId)

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar la contraseña' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}