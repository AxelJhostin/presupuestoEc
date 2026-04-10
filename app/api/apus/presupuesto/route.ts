import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyToken } from '@/lib/auth'

// GET — obtener APUs de un presupuesto
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const presupuestoId = searchParams.get('presupuesto_id')
    if (!presupuestoId) return NextResponse.json({ error: 'presupuesto_id requerido' }, { status: 400 })

    const supabase = createClient()

    const { data } = await supabase
      .from('presupuesto_apus')
      .select('*, presupuesto_apu_componentes(*)')
      .eq('presupuesto_id', presupuestoId)
      .order('created_at')

    return NextResponse.json({ apus: data || [] })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// POST — agregar APU a presupuesto (copia)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value
    if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    const user = verifyToken(token)
    if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

    const body = await request.json()
    const { presupuesto_id, apu_id, cantidad_presupuesto, componentes, ...apuData } = body

    const supabase = createClient()

    // Verificar que el presupuesto pertenece al usuario
    const { data: presupuesto } = await supabase
      .from('presupuestos')
      .select('id')
      .eq('id', presupuesto_id)
      .eq('user_id', user.userId)
      .single()

    if (!presupuesto) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const subtotalPresupuesto = apuData.precio_unitario * (cantidad_presupuesto || 1)

    const { data: presupuestoApu, error: errA } = await supabase
      .from('presupuesto_apus')
      .insert({
        presupuesto_id,
        apu_id: apu_id || null,
        codigo: apuData.codigo || null,
        descripcion: apuData.descripcion,
        unidad: apuData.unidad,
        rendimiento: apuData.rendimiento || 1,
        indirectos_pct: apuData.indirectos_pct || 20,
        utilidad_pct: apuData.utilidad_pct || 10,
        costo_directo: apuData.costo_directo || 0,
        precio_unitario: apuData.precio_unitario || 0,
        cantidad_presupuesto: cantidad_presupuesto || 1,
        subtotal_presupuesto: Math.round(subtotalPresupuesto * 100) / 100,
      })
      .select()
      .single()

    if (errA || !presupuestoApu) return NextResponse.json({ error: 'Error al agregar APU' }, { status: 500 })

    if (componentes && componentes.length > 0) {
      await supabase.from('presupuesto_apu_componentes').insert(
        componentes.map((c: { tipo: string; descripcion: string; unidad: string; cantidad: number; precio_unitario: number }, i: number) => ({
          presupuesto_apu_id: presupuestoApu.id,
          tipo: c.tipo,
          descripcion: c.descripcion,
          unidad: c.unidad,
          cantidad: c.cantidad,
          precio_unitario: c.precio_unitario,
          orden: i,
        }))
      )
    }

    return NextResponse.json({ presupuestoApu })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// DELETE — quitar APU de presupuesto
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

    await supabase.from('presupuesto_apus').delete().eq('id', id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}