// Fórmulas — Pintura de Pared
// Fuentes:
// - Pinturas Cóndor Ecuador: rendimiento ~10-12 m²/galón (usar 10, conservador)
//   URL: https://www.pinturascondor.com > Fichas técnicas
//   Verificación pendiente: [ ]
// - Pinturas Pintuco Ecuador: rendimiento ~11-13 m²/galón
//   Verificación pendiente: [ ]
// - Empaste/masilla: ~0.40 kg/m² (ficha técnica Sika / Fester)
//   Verificación pendiente: [ ]
// Nota: pintura no tiene normativa NEC. Se basa en fichas técnicas comerciales.

export interface PinturaInputs {
  largo: number
  alto: number
  numero_manos: 1 | 2 | 3
  area_vanos_m2?: number  // ventanas + puertas a descontar (default 0)
}

export interface PinturaResultados {
  area_bruta_m2: number
  area_neta_m2: number
  pintura_galones: number
  empaste_kg: number
  lija_pliegos: number
}

export interface MaterialItem {
  descripcion: string
  cantidad: number
  unidad: string
}

// Rendimiento conservador entre Cóndor y Pintuco — pendiente verificar fichas [ ]
const RENDIMIENTO_M2_POR_GALON = 10
const FACTOR_DESPERDICIO = 1.10        // 10% — estándar mercado ecuatoriano [ ]
const EMPASTE_KG_POR_M2 = 0.40        // 1 mano empaste — pendiente ficha Sika [ ]
const RENDIMIENTO_LIJA_M2_POR_PLIEGO = 2

export function calcularPintura(inputs: PinturaInputs): PinturaResultados {
  const { largo, alto, numero_manos, area_vanos_m2 = 0 } = inputs

  const area_bruta_m2 = largo * alto
  const area_neta_m2 = Math.max(0, area_bruta_m2 - area_vanos_m2)

  const pintura_galones =
    (area_neta_m2 / RENDIMIENTO_M2_POR_GALON) * numero_manos * FACTOR_DESPERDICIO

  const empaste_kg = area_neta_m2 * EMPASTE_KG_POR_M2
  const lija_pliegos = area_neta_m2 / RENDIMIENTO_LIJA_M2_POR_PLIEGO

  return {
    area_bruta_m2: r2(area_bruta_m2),
    area_neta_m2: r2(area_neta_m2),
    pintura_galones: Math.ceil(pintura_galones * 10) / 10,  // redondear hacia arriba
    empaste_kg: r2(empaste_kg),
    lija_pliegos: Math.ceil(lija_pliegos),
  }
}

export function pinturaAItems(
  r: PinturaResultados,
  numero_manos: number
): MaterialItem[] {
  return [
    {
      descripcion: `Pintura látex (${numero_manos} ${numero_manos === 1 ? 'mano' : 'manos'})`,
      cantidad: r.pintura_galones,
      unidad: 'galón',
    },
    {
      descripcion: 'Empaste/masilla (1 mano)',
      cantidad: r.empaste_kg,
      unidad: 'kg',
    },
    {
      descripcion: 'Lija #120',
      cantidad: r.lija_pliegos,
      unidad: 'pliego',
    },
  ]
}

function r2(v: number) {
  return Math.round(v * 100) / 100
}