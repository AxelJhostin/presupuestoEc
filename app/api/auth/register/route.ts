import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hashPassword, createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'El email no es válido.' }, { status: 400 })
    }

    const supabase = createClient()

    // Verificar si ya existe
    const { data: existing } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Ya existe una cuenta con ese email.' }, { status: 409 })
    }

    const password_hash = await hashPassword(password)

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .insert({ email: email.toLowerCase(), password_hash })
      .select()
      .single()

    if (error || !usuario) {
      return NextResponse.json({ error: 'Error al crear la cuenta.' }, { status: 500 })
    }

    const token = createToken(usuario.id, usuario.email)

    const response = NextResponse.json({ ok: true })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: '/',
    })

    return response

  } catch {
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 })
  }
}