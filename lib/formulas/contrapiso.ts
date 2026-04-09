// Fórmulas — Contrapiso
// Fuentes:
// - NEC-SE-HM (Hormigón Armado), MIDUVI Ecuador
//   Dosificación hormigón simple f'c=180 kg/cm²: Cap. 3
// - Práctica estándar Ecuador:
//   Espesor típico contrapiso: 0.08 m (8 cm)
//   Malla electrosoldada R-84: 1 m² por m² de área
//
// VERIFICACIÓN:
// [✅] Dosificación 1:2:3 f'c=180 kg/cm² — NEC-SE-HM Cap. 3
// [ ] Espesor mínimo contrapiso — práctica estándar — pendiente
// [ ] Malla electrosoldada R-84 — pendiente verificar SERCOP

export interface ContrapisoInputs {
  largo: number
  ancho: number
  espesor?: number    // metros — default 0.08 (8cm)
  con_malla?: boolean // default true
}

export interface ContrapisoResultados {
  area_m2: number
  volumen_hormigon_m3: number
  cemento_sacos: number
  arena_m3: number
  ripio_m3: number
  agua_litros: number
  plastico_m2: number     // barrera de humedad
  malla_m2: number        // malla electrosoldada R-84
}

export interface MaterialItem {
  descripcion: string
  cantidad: number
  unidad: string
}

// Dosificación 1:2:3 f'c=180 kg/cm² — igual que losa
// Fuente: NEC-SE-HM Cap. 3 ✅
const CEMENTO_SACOS_POR_M3 = 7
const ARENA_M3_POR_M3 = 0.56
const RIPIO_M3_POR_M3 = 0.84
const AGUA_LITROS_POR_M3 = 205

// Plástico negro barrera de humedad — 10% desperdicio
const FACTOR_PLASTICO = 1.10

// Malla electrosoldada R-84 — 5% desperdicio
const FACTOR_MALLA = 1.05

// Espesor estándar contrapiso en Ecuador: 8 cm
const ESPESOR_DEFAULT = 0.08

export function calcularContrapiso(inputs: ContrapisoInputs): ContrapisoResultados {
  const {
    largo,
    ancho,
    espesor = ESPESOR_DEFAULT,
    con_malla = true,
  } = inputs

  const area_m2 = largo * ancho
  const volumen_hormigon_m3 = area_m2 * espesor

  const cemento_sacos = Math.ceil(volumen_hormigon_m3 * CEMENTO_SACOS_POR_M3)
  const arena_m3 = r2(volumen_hormigon_m3 * ARENA_M3_POR_M3)
  const ripio_m3 = r2(volumen_hormigon_m3 * RIPIO_M3_POR_M3)
  const agua_litros = r2(volumen_hormigon_m3 * AGUA_LITROS_POR_M3)
  const plastico_m2 = r2(area_m2 * FACTOR_PLASTICO)
  const malla_m2 = con_malla ? r2(area_m2 * FACTOR_MALLA) : 0

  return {
    area_m2: r2(area_m2),
    volumen_hormigon_m3: r2(volumen_hormigon_m3),
    cemento_sacos,
    arena_m3,
    ripio_m3,
    agua_litros,
    plastico_m2,
    malla_m2,
  }
}

export function contrapisoAItems(r: ContrapisoResultados): MaterialItem[] {
  const items: MaterialItem[] = [
    { descripcion: "Hormigón simple f'c=180 kg/cm²", cantidad: r.volumen_hormigon_m3, unidad: 'm³' },
    { descripcion: 'Cemento Portland (saco 50kg)', cantidad: r.cemento_sacos, unidad: 'saco' },
    { descripcion: 'Arena fina', cantidad: r.arena_m3, unidad: 'm³' },
    { descripcion: 'Ripio (piedra triturada)', cantidad: r.ripio_m3, unidad: 'm³' },
    { descripcion: 'Agua', cantidad: r.agua_litros, unidad: 'litro' },
    { descripcion: 'Plástico negro (barrera de humedad)', cantidad: r.plastico_m2, unidad: 'm²' },
  ]

  if (r.malla_m2 > 0) {
    items.push({
      descripcion: 'Malla electrosoldada R-84',
      cantidad: r.malla_m2,
      unidad: 'm²',
    })
  }

  return items
}

function r2(v: number) {
  return Math.round(v * 100) / 100
}