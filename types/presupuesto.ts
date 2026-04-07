export type ModoPresupuesto = 'calculadora' | 'libre'
export type ElementoNEC = 'losa' | 'columna' | 'pintura'

export interface Presupuesto {
  id: string
  user_id: string
  nombre: string
  modo: ModoPresupuesto
  fecha: string
  total: number
  created_at: string
  updated_at: string
}

export interface ItemPresupuesto {
  id: string
  presupuesto_id: string
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
  subtotal: number
  orden: number
  created_at: string
}

export interface CalculoNEC {
  id: string
  presupuesto_id: string
  elemento: ElementoNEC
  medidas_json: Record<string, number>
  materiales_json: Record<string, number>
  created_at: string
}

export type NuevoPresupuesto = Pick<Presupuesto, 'nombre' | 'modo'>

export type NuevoItem = Omit<ItemPresupuesto, 'id' | 'subtotal' | 'created_at'>

export interface PresupuestoDetalle extends Presupuesto {
  items: ItemPresupuesto[]
  calculo_nec?: CalculoNEC
}

export interface ItemEditable {
  tempId: string
  descripcion: string
  unidad: string
  cantidad: number | ''
  precio_unitario: number | ''
  subtotal: number
  orden: number
}