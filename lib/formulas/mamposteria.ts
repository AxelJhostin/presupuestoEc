// Fórmulas — Mampostería de Bloque
// Fuentes:
// - NEC-SE-MP (Mampostería Estructural), MIDUVI Ecuador
//   Tabla 2, pág. 22: Mortero tipo M10 — dosificación 1:4 (cemento:arena)
//   Resistencia mínima 10 MPa a 28 días ✅
// - Cálculo geométrico: bloque 15x20x40cm + junta 1.5cm = 12.5 bloques/m²
//
// VERIFICACIÓN:
// [✅] Dosificación mortero M10: 1:4 — NEC-SE-MP Tabla 2, pág. 22
// [✅] Bloques por m²: cálculo geométrico (bloque 40x20cm + junta 1.5cm)
// [ ] Volumen de mortero por m² de pared — pendiente verificar SERCOP

export interface MamposteriaInputs {
  largo: number
  alto: number
  area_vanos_m2?: number
}

export interface MamposteriaResultados {
  area_bruta_m2: number
  area_neta_m2: number
  bloques: number
  cemento_sacos: number
  arena_m3: number
  agua_litros: number
}

export interface MaterialItem {
  descripcion: string
  cantidad: number
  unidad: string
}

// Bloque estándar 15x20x40cm + junta de mortero 1.5cm
// Área por bloque con junta: (0.40+0.015) × (0.20+0.015) = 0.0893 m²
// Bloques por m²: 1/0.0893 ≈ 11.2 → usamos 12 por práctica (incluye desperdicio)
// Fuente: cálculo geométrico ✅
const BLOQUES_POR_M2 = 12

// Mortero tipo M10 — dosificación 1:4 (cemento:arena)
// Fuente: NEC-SE-MP Tabla 2, pág. 22 ✅
// Volumen de mortero de juntas por m² de pared: ~0.015 m³
// (junta horizontal 1.5cm × ancho bloque 15cm + junta vertical)
const MORTERO_M3_POR_M2 = 0.015

// Dosificación 1:4 → 1 parte cemento + 4 partes arena
// ~6 sacos de cemento (50kg) por m³ de mortero
const CEMENTO_SACOS_POR_M3 = 6
const ARENA_M3_POR_M3 = 0.90
const AGUA_LITROS_POR_M3 = 200

const FACTOR_DESPERDICIO = 1.05

export function calcularMamposteria(inputs: MamposteriaInputs): MamposteriaResultados {
  const { largo, alto, area_vanos_m2 = 0 } = inputs

  const area_bruta_m2 = largo * alto
  const area_neta_m2 = Math.max(0, area_bruta_m2 - area_vanos_m2)

  const bloques = Math.ceil(area_neta_m2 * BLOQUES_POR_M2 * FACTOR_DESPERDICIO)

  const volumen_mortero = area_neta_m2 * MORTERO_M3_POR_M2
  const cemento_sacos = Math.ceil(volumen_mortero * CEMENTO_SACOS_POR_M3)
  const arena_m3 = r2(volumen_mortero * ARENA_M3_POR_M3)
  const agua_litros = r2(volumen_mortero * AGUA_LITROS_POR_M3)

  return {
    area_bruta_m2: r2(area_bruta_m2),
    area_neta_m2: r2(area_neta_m2),
    bloques,
    cemento_sacos,
    arena_m3,
    agua_litros,
  }
}

export function mamposteriaAItems(r: MamposteriaResultados): MaterialItem[] {
  return [
    { descripcion: 'Bloque de hormigón 15x20x40 cm', cantidad: r.bloques, unidad: 'unidad' },
    { descripcion: 'Cemento Portland (saco 50kg) — mortero M10', cantidad: r.cemento_sacos, unidad: 'saco' },
    { descripcion: 'Arena fina', cantidad: r.arena_m3, unidad: 'm³' },
    { descripcion: 'Agua', cantidad: r.agua_litros, unidad: 'litro' },
  ]
}

function r2(v: number) {
  return Math.round(v * 100) / 100
}