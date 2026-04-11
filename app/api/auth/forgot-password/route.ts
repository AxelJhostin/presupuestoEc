import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 })

    const supabase = createClient()

    // Verificar si el usuario existe
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id, email')
      .eq('email', email.toLowerCase().trim())
      .single()

    // Siempre responder igual para no revelar si el email existe
    if (!usuario) {
      return NextResponse.json({ ok: true })
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hora

    // Invalidar tokens anteriores del usuario
    await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('user_id', usuario.id)
      .eq('used', false)

    // Guardar nuevo token
    await supabase.from('password_reset_tokens').insert({
      user_id: usuario.id,
      token,
      expires_at: expiresAt.toISOString(),
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://presupuesto-ec.vercel.app'}/reset-password?token=${token}`

    // Enviar email
    await resend.emails.send({
      from: 'PresupuestoEC <onboarding@resend.dev>',
      to: usuario.email,
      subject: 'Recuperar contraseña — PresupuestoEC',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <div style="margin-bottom: 24px;">
            <span style="background: #1D4ED8; color: white; font-weight: bold; font-size: 18px; padding: 8px 16px; border-radius: 8px;">P</span>
            <strong style="margin-left: 8px; font-size: 18px;">PresupuestoEC</strong>
          </div>
          <h2 style="color: #1e293b; margin-bottom: 8px;">Recuperar contraseña</h2>
          <p style="color: #64748b; margin-bottom: 24px;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón para continuar.
          </p>
          <a href="${resetUrl}"
            style="display: inline-block; background: #1D4ED8; color: white; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
            Restablecer contraseña
          </a>
          <p style="color: #94a3b8; font-size: 13px;">
            Este link expira en 1 hora. Si no solicitaste este cambio, ignora este email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">PresupuestoEC · Generador de presupuestos de obra para Ecuador</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}