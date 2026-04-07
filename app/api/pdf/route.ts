import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import PresupuestoPDF from '@/components/pdf/PresupuestoPDF'
import React from 'react'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: presupuesto } = await supabase
    .from('presupuestos')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!presupuesto) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const { data: items } = await supabase
    .from('items_presupuesto')
    .select('*')
    .eq('presupuesto_id', id)
    .order('orden')

  const fecha = new Date(presupuesto.fecha).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const element = React.createElement(PresupuestoPDF, {
    nombre: presupuesto.nombre,
    modo: presupuesto.modo,
    fecha,
    total: presupuesto.total,
    items: items || [],
  }) as unknown as React.ReactElement<{ children?: React.ReactNode }>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(element as any)

  const uint8Array = new Uint8Array(buffer)

  return new NextResponse(uint8Array, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="presupuesto-${id}.pdf"`,
    },
  })
}