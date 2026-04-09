import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    const supabase = createClient()

    // Obtener presupuesto original
    const { data: original } = await supabase
      .from('presupuestos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.userId)
      .single()

    if (!original) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    // Obtener items originales
    const { data: itemsOriginales } = await supabase
      .from('items_presupuesto')
      .select('*')
      .eq('presupuesto_id', id)
      .order('orden')

    // Crear copia del presupuesto
    const { data: copia, error: errP } = await supabase
      .from('presupuestos')
      .insert({
        user_id: user.userId,
        nombre: `${original.nombre} (copia)`,
        modo: original.modo,
        total: original.total,
      })
      .select()
      .single()

    if (errP || !copia) return NextResponse.json({ error: 'Error al duplicar' }, { status: 500 })

    // Copiar items
    if (itemsOriginales && itemsOriginales.length > 0) {
      const { error: errI } = await supabase.from('items_presupuesto').insert(
        itemsOriginales.map(item => ({
          presupuesto_id: copia.id,
          descripcion: item.descripcion,
          unidad: item.unidad,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          orden: item.orden,
        }))
      )

      if (errI) return NextResponse.json({ error: 'Error al copiar items' }, { status: 500 })
    }

    return NextResponse.json({ id: copia.id })

  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}