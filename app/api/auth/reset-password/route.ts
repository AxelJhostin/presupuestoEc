import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token y contraseña requeridos' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const supabase = createClient()

    // Verificar token
    const { data: resetToken } = await supabase
      .from('password_reset_tokens')
      .select('*, usuarios(id, email)')
      .eq('token', token)
      .eq('used', false)
      .single()

    if (!resetToken) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 })
    }

    // Verificar expiración
    if (new Date(resetToken.expires_at) < new Date()) {
      return NextResponse.json({ error: 'El link ha expirado. Solicita uno nuevo.' }, { status: 400 })
    }

    // Hashear nueva contraseña
    const password_hash = await hashPassword(password)

    // Actualizar contraseña
    const { error: errU } = await supabase
      .from('usuarios')
      .update({ password_hash })
      .eq('id', resetToken.user_id)

    if (errU) {
      return NextResponse.json({ error: 'Error al actualizar la contraseña' }, { status: 500 })
    }

    // Marcar token como usado
    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', resetToken.id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}