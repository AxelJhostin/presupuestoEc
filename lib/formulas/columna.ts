// Fórmulas NEC — Columna Rectangular
// Fuentes:
// - NEC-SE-HM, MIDUVI Ecuador — Cap. 4.3 (Flexo-compresión)
//   Verificado: f'c mínimo = 21 MPa (pág. 35), dim. mínima = 300mm (pág. 54)
//   Cuantía longitudinal: 1% ≤ ρg ≤ 4% (pág. 57) ✅
// - Dosificaciones de mezcla: ACI 318 / INEN 2380
//   (La NEC no define sacos/m³, remite a diseño de mezcla)
// - Referencia práctica 120 kg/m³: Tablas SERCOP / Cómputos Métricos
//   PENDIENTE verificar: [ ]

export interface ColumnaInputs {
  ancho: number        // mínimo 0.30 m según NEC-SE-HM pág. 54
  profundidad: number  // mínimo 0.30 m según NEC-SE-HM pág. 54
  altura: number
}

export interface ColumnaResultados {
  volumen_hormigon_m3: number
  cemento_sacos: number
  arena_m3: number
  ripio_m3: number
  agua_litros: number
  acero_kg: number
  encofrado_m2: number
  perimetro_seccion_m: number
  advertencia_dimension?: string
}

export interface MaterialItem {
  descripcion: string
  cantidad: number
  unidad: string
}

// Dosificación 1:2:2 — f'c=210 kg/cm² (≈21 MPa, mínimo NEC pág.35)
const CEMENTO_SACOS_POR_M3 = 8    // ≈400 kg/m³ — pendiente verificar ACI 318 / INEN 2380 [ ]
const ARENA_M3_POR_M3 = 0.48      // pendiente verificar [ ]
const RIPIO_M3_POR_M3 = 0.72      // pendiente verificar [ ]
const AGUA_LITROS_POR_M3 = 195    // pendiente verificar ACI 318 [ ]
const ACERO_KG_POR_M3 = 120       // referencia práctica mercado EC — pendiente SERCOP [ ]
const FACTOR_ENCOFRADO = 1.05     // 5% desperdicio

// Dimensión mínima de columna según NEC-SE-HM Cap. 4.3.1, pág. 54
const DIMENSION_MINIMA_M = 0.30

export function calcularColumna(inputs: ColumnaInputs): ColumnaResultados {
  const { ancho, profundidad, altura } = inputs

  // Advertencia si dimensión está bajo el mínimo NEC
  const advertencia_dimension =
    ancho < DIMENSION_MINIMA_M || profundidad < DIMENSION_MINIMA_M
      ? `Advertencia: la NEC-SE-HM exige dimensión mínima de ${DIMENSION_MINIMA_M * 100}cm en columnas estructurales (Cap. 4.3.1).`
      : undefined

  const volumen_hormigon_m3 = ancho * profundidad * altura
  const perimetro_seccion_m = 2 * (ancho + profundidad)
  const encofrado_m2 = perimetro_seccion_m * altura * FACTOR_ENCOFRADO

  return {
    volumen_hormigon_m3: r2(volumen_hormigon_m3),
    cemento_sacos: Math.ceil(volumen_hormigon_m3 * CEMENTO_SACOS_POR_M3),
    arena_m3: r2(volumen_hormigon_m3 * ARENA_M3_POR_M3),
    ripio_m3: r2(volumen_hormigon_m3 * RIPIO_M3_POR_M3),
    agua_litros: r2(volumen_hormigon_m3 * AGUA_LITROS_POR_M3),
    acero_kg: r2(volumen_hormigon_m3 * ACERO_KG_POR_M3),
    encofrado_m2: r2(encofrado_m2),
    perimetro_seccion_m: r2(perimetro_seccion_m),
    advertencia_dimension,
  }
}

export function columnaAItems(r: ColumnaResultados): MaterialItem[] {
  return [
    { descripcion: "Hormigón f'c=210 kg/cm²", cantidad: r.volumen_hormigon_m3, unidad: 'm³' },
    { descripcion: 'Cemento Portland (saco 50kg)', cantidad: r.cemento_sacos, unidad: 'saco' },
    { descripcion: 'Arena fina', cantidad: r.arena_m3, unidad: 'm³' },
    { descripcion: 'Ripio (piedra triturada)', cantidad: r.ripio_m3, unidad: 'm³' },
    { descripcion: 'Agua', cantidad: r.agua_litros, unidad: 'litro' },
    { descripcion: 'Acero de refuerzo (longitudinal + estribos)', cantidad: r.acero_kg, unidad: 'kg' },
    { descripcion: 'Encofrado columna (madera)', cantidad: r.encofrado_m2, unidad: 'm²' },
  ]
}

function r2(v: number) {
  return Math.round(v * 100) / 100
}