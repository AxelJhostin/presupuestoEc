import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyToken } from '@/lib/auth'

// POST /api/presupuestos/plantilla — guarda un presupuesto como plantilla
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const { id, nombre_plantilla } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    const supabase = createClient()

    const { data: original } = await supabase
      .from('presupuestos')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.userId)
      .single()

    if (!original) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

    const { data: itemsOriginales } = await supabase
      .from('items_presupuesto')
      .select('*')
      .eq('presupuesto_id', id)
      .order('orden')

    // Crear plantilla como copia del presupuesto
    const { data: plantilla, error: errP } = await supabase
      .from('presupuestos')
      .insert({
        user_id: user.userId,
        nombre: nombre_plantilla || `Plantilla — ${original.nombre}`,
        nombre_plantilla: nombre_plantilla || `Plantilla — ${original.nombre}`,
        modo: original.modo,
        total: original.total,
        es_plantilla: true,
      })
      .select()
      .single()

    if (errP || !plantilla) return NextResponse.json({ error: 'Error al crear plantilla' }, { status: 500 })

    if (itemsOriginales && itemsOriginales.length > 0) {
      await supabase.from('items_presupuesto').insert(
        itemsOriginales.map(item => ({
          presupuesto_id: plantilla.id,
          descripcion: item.descripcion,
          unidad: item.unidad,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          orden: item.orden,
        }))
      )
    }

    return NextResponse.json({ id: plantilla.id })

  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// GET /api/presupuestos/plantilla — obtiene las plantillas del usuario
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const supabase = createClient()

    const { data: plantillas } = await supabase
      .from('presupuestos')
      .select('id, nombre, nombre_plantilla, modo, total')
      .eq('user_id', user.userId)
      .eq('es_plantilla', true)
      .order('created_at', { ascending: false })

    return NextResponse.json({ plantillas: plantillas || [] })

  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}