// Fórmulas — Cerámica / Porcelanato
// Fuentes:
// - Rendimiento bondex (pegante): ficha técnica Sika Bond / Pegacor Ecuador
//   ~4-5 kg/m² para cerámica estándar — usar 4.5 kg/m² (conservador)
//   Verificación pendiente: [ ]
// - Rendimiento fragua: ficha técnica Bostik / Sika Ecuador
//   ~0.30 kg/m² para junta de 3mm — verificación pendiente: [ ]
// - Factor desperdicio cerámica 10%: estándar mercado ecuatoriano
//
// NOTA: No existe normativa NEC específica para revestimientos.
// Se usan rendimientos comerciales de fabricantes ecuatorianos.

export interface CeramicaInputs {
  largo: number        // metros
  ancho: number        // metros
  area_vanos_m2?: number
  tamano_ceramica: '20x20' | '30x30' | '40x40' | '60x60'
}

export interface CeramicaResultados {
  area_bruta_m2: number
  area_neta_m2: number
  ceramica_m2: number      // incluye desperdicio
  bondex_kg: number
  fragua_kg: number
}

export interface MaterialItem {
  descripcion: string
  cantidad: number
  unidad: string
}

// Factor de desperdicio según tamaño
// Piezas pequeñas tienen más cortes = más desperdicio
const DESPERDICIO: Record<string, number> = {
  '20x20': 1.15,  // 15% desperdicio
  '30x30': 1.12,  // 12%
  '40x40': 1.10,  // 10%
  '60x60': 1.08,  // 8%
}

// Bondex / pegante cemento: 4.5 kg/m² — ficha técnica Sika [ ]
const BONDEX_KG_POR_M2 = 4.5

// Fragua: 0.30 kg/m² para junta 3mm — ficha técnica Bostik [ ]
const FRAGUA_KG_POR_M2 = 0.30

export function calcularCeramica(inputs: CeramicaInputs): CeramicaResultados {
  const { largo, ancho, area_vanos_m2 = 0, tamano_ceramica } = inputs

  const area_bruta_m2 = largo * ancho
  const area_neta_m2 = Math.max(0, area_bruta_m2 - area_vanos_m2)

  const factor = DESPERDICIO[tamano_ceramica] ?? 1.10
  const ceramica_m2 = r2(area_neta_m2 * factor)

  const bondex_kg = r2(area_neta_m2 * BONDEX_KG_POR_M2)
  const fragua_kg = r2(area_neta_m2 * FRAGUA_KG_POR_M2)

  return {
    area_bruta_m2: r2(area_bruta_m2),
    area_neta_m2: r2(area_neta_m2),
    ceramica_m2,
    bondex_kg,
    fragua_kg,
  }
}

export function ceramicaAItems(
  r: CeramicaResultados,
  tamano: string
): MaterialItem[] {
  return [
    {
      descripcion: `Cerámica / porcelanato ${tamano} cm`,
      cantidad: r.ceramica_m2,
      unidad: 'm²',
    },
    {
      descripcion: 'Bondex / pegante para cerámica',
      cantidad: r.bondex_kg,
      unidad: 'kg',
    },
    {
      descripcion: 'Fragua',
      cantidad: r.fragua_kg,
      unidad: 'kg',
    },
  ]
}

function r2(v: number) {
  return Math.round(v * 100) / 100
}