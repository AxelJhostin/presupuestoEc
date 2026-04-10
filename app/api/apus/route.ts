import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyToken } from '@/lib/auth'

// GET — listar APUs del usuario
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const supabase = createClient()

    const { data: apus } = await supabase
      .from('apus')
      .select('*, apu_componentes(*)')
      .eq('user_id', user.userId)
      .order('created_at', { ascending: false })

    return NextResponse.json({ apus: apus || [] })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST — crear APU
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const body = await request.json()
    const { codigo, descripcion, unidad, rendimiento, indirectos_pct, utilidad_pct, componentes } = body

    const supabase = createClient()

    // Calcular costo directo y precio unitario
    const costoDirecto = componentes.reduce((acc: number, c: { cantidad: number; precio_unitario: number }) =>
      acc + (c.cantidad * c.precio_unitario), 0)
    const precioUnitario = costoDirecto * (1 + indirectos_pct / 100 + utilidad_pct / 100)

    const { data: apu, error: errA } = await supabase
      .from('apus')
      .insert({
        user_id: user.userId,
        codigo: codigo || null,
        descripcion,
        unidad,
        rendimiento: rendimiento || 1,
        indirectos_pct: indirectos_pct || 20,
        utilidad_pct: utilidad_pct || 10,
        costo_directo: Math.round(costoDirecto * 100) / 100,
        precio_unitario: Math.round(precioUnitario * 100) / 100,
      })
      .select()
      .single()

    if (errA || !apu) return NextResponse.json({ error: 'Error al crear APU' }, { status: 500 })

    if (componentes && componentes.length > 0) {
      await supabase.from('apu_componentes').insert(
        componentes.map((c: { tipo: string; descripcion: string; unidad: string; cantidad: number; precio_unitario: number }, i: number) => ({
          apu_id: apu.id,
          tipo: c.tipo,
          descripcion: c.descripcion,
          unidad: c.unidad,
          cantidad: c.cantidad,
          precio_unitario: c.precio_unitario,
          orden: i,
        }))
      )
    }

    return NextResponse.json({ apu })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// PUT — actualizar APU
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const body = await request.json()
    const { id, codigo, descripcion, unidad, rendimiento, indirectos_pct, utilidad_pct, componentes } = body

    const supabase = createClient()

    const costoDirecto = componentes.reduce((acc: number, c: { cantidad: number; precio_unitario: number }) =>
      acc + (c.cantidad * c.precio_unitario), 0)
    const precioUnitario = costoDirecto * (1 + indirectos_pct / 100 + utilidad_pct / 100)

    const { error: errA } = await supabase
      .from('apus')
      .update({
        codigo: codigo || null,
        descripcion,
        unidad,
        rendimiento: rendimiento || 1,
        indirectos_pct,
        utilidad_pct,
        costo_directo: Math.round(costoDirecto * 100) / 100,
        precio_unitario: Math.round(precioUnitario * 100) / 100,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.userId)

    if (errA) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })

    // Reemplazar componentes
    await supabase.from('apu_componentes').delete().eq('apu_id', id)
    if (componentes && componentes.length > 0) {
      await supabase.from('apu_componentes').insert(
        componentes.map((c: { tipo: string; descripcion: string; unidad: string; cantidad: number; precio_unitario: number }, i: number) => ({
          apu_id: id,
          tipo: c.tipo,
          descripcion: c.descripcion,
          unidad: c.unidad,
          cantidad: c.cantidad,
          precio_unitario: c.precio_unitario,
          orden: i,
        }))
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE — eliminar APU
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    const supabase = createClient()

    await supabase.from('apus').delete().eq('id', id).eq('user_id', user.userId)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}