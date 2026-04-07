// Fórmulas NEC — Losa Maciza
// Fuente: NEC-SE-HM (Hormigón Armado), MIDUVI Ecuador
// URL: https://www.miduvi.gob.ec/norma-ecuatoriana-de-la-construccion/
//
// VERIFICACIÓN PENDIENTE:
// [ ] Dosificación 1:2:3 f'c=180 kg/cm² — NEC-SE-HM Cap. 3
// [ ] Cuantía mínima acero 8 kg/m² — NEC-SE-HM Cap. 4
// [ ] Consumo agua 205 L/m³ — ACI 318 / INEN 2380
// [ ] Factor desperdicio encofrado 5% — Cómputos Métricos

export interface LosaInputs {
  largo: number
  ancho: number
  espesor: number // típico: 0.20 m
}

export interface LosaResultados {
  volumen_hormigon_m3: number
  cemento_sacos: number
  arena_m3: number
  ripio_m3: number
  agua_litros: number
  acero_kg: number
  encofrado_m2: number
  area_planta_m2: number
}

export interface MaterialItem {
  descripcion: string
  cantidad: number
  unidad: string
}

// Dosificación 1:2:3 — f'c=180 kg/cm²
const CEMENTO_SACOS_POR_M3 = 7    // sacos 50kg/m³ — pendiente verificar NEC Cap.3
const ARENA_M3_POR_M3 = 0.56      // pendiente verificar NEC Cap.3
const RIPIO_M3_POR_M3 = 0.84      // pendiente verificar NEC Cap.3
const AGUA_LITROS_POR_M3 = 205    // pendiente verificar ACI 318 / INEN 2380
const ACERO_KG_POR_M2 = 8         // cuantía mínima NEC — pendiente verificar Cap.4
const FACTOR_ENCOFRADO = 1.05     // 5% desperdicio

export function calcularLosa(inputs: LosaInputs): LosaResultados {
  const { largo, ancho, espesor } = inputs
  const area_planta_m2 = largo * ancho
  const volumen_hormigon_m3 = area_planta_m2 * espesor

  return {
    area_planta_m2: r2(area_planta_m2),
    volumen_hormigon_m3: r2(volumen_hormigon_m3),
    cemento_sacos: Math.ceil(volumen_hormigon_m3 * CEMENTO_SACOS_POR_M3),
    arena_m3: r2(volumen_hormigon_m3 * ARENA_M3_POR_M3),
    ripio_m3: r2(volumen_hormigon_m3 * RIPIO_M3_POR_M3),
    agua_litros: r2(volumen_hormigon_m3 * AGUA_LITROS_POR_M3),
    acero_kg: r2(area_planta_m2 * ACERO_KG_POR_M2),
    encofrado_m2: r2(area_planta_m2 * FACTOR_ENCOFRADO),
  }
}

export function losaAItems(r: LosaResultados): MaterialItem[] {
  return [
    { descripcion: "Hormigón f'c=180 kg/cm²", cantidad: r.volumen_hormigon_m3, unidad: 'm³' },
    { descripcion: 'Cemento Portland (saco 50kg)', cantidad: r.cemento_sacos, unidad: 'saco' },
    { descripcion: 'Arena fina', cantidad: r.arena_m3, unidad: 'm³' },
    { descripcion: 'Ripio (piedra triturada)', cantidad: r.ripio_m3, unidad: 'm³' },
    { descripcion: 'Agua', cantidad: r.agua_litros, unidad: 'litro' },
    { descripcion: 'Acero de refuerzo varilla 12mm', cantidad: r.acero_kg, unidad: 'kg' },
    { descripcion: 'Encofrado (madera)', cantidad: r.encofrado_m2, unidad: 'm²' },
  ]
}

function r2(v: number) {
  return Math.round(v * 100) / 100
}