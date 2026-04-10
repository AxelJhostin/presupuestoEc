export interface PrecioReferencia {
  descripcion: string
  unidad: string
  precio_min: number
  precio_max: number
  precio_referencia: number
  categoria: string
  notas?: string
}

// Precios de referencia para la costa ecuatoriana (Manabí)
// Última actualización: 2025 — fuentes: Disensa, Metalhierro Manta, IPCO INEC
// Los precios varían según proveedor, cantidad y zona. Usar como referencia.

export const PRECIOS_REFERENCIA: PrecioReferencia[] = [
  // CEMENTO Y HORMIGÓN
  { categoria: 'Cemento y hormigón', descripcion: 'Cemento Holcim/Selva Alegre (saco 50kg)', unidad: 'saco', precio_min: 8.00, precio_max: 9.50, precio_referencia: 8.80, notas: 'Precio en ferretería. Compra por volumen puede bajar.' },
  { categoria: 'Cemento y hormigón', descripcion: 'Cemento Campeón (saco 50kg)', unidad: 'saco', precio_min: 7.80, precio_max: 9.00, precio_referencia: 8.50 },
  { categoria: 'Cemento y hormigón', descripcion: 'Hormigón premezclado f\'c=180 kg/cm²', unidad: 'm³', precio_min: 95.00, precio_max: 115.00, precio_referencia: 105.00, notas: 'Precio puesto en obra, incluye transporte.' },
  { categoria: 'Cemento y hormigón', descripcion: 'Hormigón premezclado f\'c=210 kg/cm²', unidad: 'm³', precio_min: 105.00, precio_max: 125.00, precio_referencia: 115.00, notas: 'Precio puesto en obra, incluye transporte.' },
  { categoria: 'Cemento y hormigón', descripcion: 'Hormigón premezclado f\'c=240 kg/cm²', unidad: 'm³', precio_min: 115.00, precio_max: 135.00, precio_referencia: 125.00 },

  // ÁRIDOS
  { categoria: 'Áridos', descripcion: 'Arena fina lavada de río', unidad: 'm³', precio_min: 18.00, precio_max: 25.00, precio_referencia: 20.00, notas: 'Costa/Manabí. Precio puesto en obra.' },
  { categoria: 'Áridos', descripcion: 'Arena gruesa para hormigón', unidad: 'm³', precio_min: 18.00, precio_max: 25.00, precio_referencia: 21.00 },
  { categoria: 'Áridos', descripcion: 'Ripio triturado 3/4"', unidad: 'm³', precio_min: 20.00, precio_max: 28.00, precio_referencia: 23.00, notas: 'Piedra basáltica, zona costera.' },
  { categoria: 'Áridos', descripcion: 'Ripio triturado 1/2"', unidad: 'm³', precio_min: 20.00, precio_max: 28.00, precio_referencia: 23.00 },
  { categoria: 'Áridos', descripcion: 'Cascajo / material de relleno', unidad: 'm³', precio_min: 8.00, precio_max: 15.00, precio_referencia: 10.00 },

  // ACERO Y HIERRO
  { categoria: 'Acero y hierro', descripcion: 'Varilla corrugada 8mm (Adelca/Andec)', unidad: 'kg', precio_min: 0.85, precio_max: 1.05, precio_referencia: 0.95, notas: 'Precio por kg. Compra por quintal puede bajar.' },
  { categoria: 'Acero y hierro', descripcion: 'Varilla corrugada 10mm', unidad: 'kg', precio_min: 0.85, precio_max: 1.05, precio_referencia: 0.95 },
  { categoria: 'Acero y hierro', descripcion: 'Varilla corrugada 12mm', unidad: 'kg', precio_min: 0.85, precio_max: 1.05, precio_referencia: 0.95 },
  { categoria: 'Acero y hierro', descripcion: 'Varilla corrugada 16mm', unidad: 'kg', precio_min: 0.87, precio_max: 1.08, precio_referencia: 0.97 },
  { categoria: 'Acero y hierro', descripcion: 'Malla electrosoldada R-84 (2.4x6m)', unidad: 'u', precio_min: 28.00, precio_max: 38.00, precio_referencia: 32.00 },
  { categoria: 'Acero y hierro', descripcion: 'Alambre de amarre #18', unidad: 'kg', precio_min: 1.20, precio_max: 1.60, precio_referencia: 1.40 },

  // MAMPOSTERÍA
  { categoria: 'Mampostería', descripcion: 'Bloque de hormigón 15x20x40 cm', unidad: 'u', precio_min: 0.38, precio_max: 0.55, precio_referencia: 0.45, notas: 'Precio en planta. Flete adicional.' },
  { categoria: 'Mampostería', descripcion: 'Bloque de hormigón 10x20x40 cm', unidad: 'u', precio_min: 0.32, precio_max: 0.48, precio_referencia: 0.38 },
  { categoria: 'Mampostería', descripcion: 'Bloque de hormigón 20x20x40 cm', unidad: 'u', precio_min: 0.50, precio_max: 0.70, precio_referencia: 0.58 },
  { categoria: 'Mampostería', descripcion: 'Ladrillo panelón artesanal', unidad: 'u', precio_min: 0.18, precio_max: 0.28, precio_referencia: 0.22 },
  { categoria: 'Mampostería', descripcion: 'Mortero adhesivo (saco 25kg)', unidad: 'saco', precio_min: 5.50, precio_max: 8.00, precio_referencia: 6.50 },

  // ENCOFRADO Y MADERA
  { categoria: 'Encofrado y madera', descripcion: 'Tabla de encofrado (0.30x3m)', unidad: 'u', precio_min: 4.50, precio_max: 7.00, precio_referencia: 5.50 },
  { categoria: 'Encofrado y madera', descripcion: 'Puntal de eucalipto 3m', unidad: 'u', precio_min: 2.00, precio_max: 3.50, precio_referencia: 2.50 },
  { categoria: 'Encofrado y madera', descripcion: 'Pingos de eucalipto (ml)', unidad: 'ml', precio_min: 1.50, precio_max: 2.50, precio_referencia: 1.94 },
  { categoria: 'Encofrado y madera', descripcion: 'Rieles de eucalipto', unidad: 'u', precio_min: 2.50, precio_max: 3.50, precio_referencia: 2.80 },
  { categoria: 'Encofrado y madera', descripcion: 'Madera contrachapada (plywood 4x8) 9mm', unidad: 'u', precio_min: 18.00, precio_max: 28.00, precio_referencia: 22.00 },
  { categoria: 'Encofrado y madera', descripcion: 'Clavos de 2" (caja 1kg)', unidad: 'kg', precio_min: 1.50, precio_max: 2.50, precio_referencia: 1.80 },

  // CERÁMICA Y PISOS
  { categoria: 'Cerámica y pisos', descripcion: 'Cerámica piso económica 30x30 cm', unidad: 'm²', precio_min: 5.50, precio_max: 9.00, precio_referencia: 7.00, notas: 'Precio en almacén. Varía mucho por marca.' },
  { categoria: 'Cerámica y pisos', descripcion: 'Cerámica piso media gama 40x40 cm', unidad: 'm²', precio_min: 9.00, precio_max: 16.00, precio_referencia: 12.00 },
  { categoria: 'Cerámica y pisos', descripcion: 'Porcelanato 60x60 cm', unidad: 'm²', precio_min: 14.00, precio_max: 30.00, precio_referencia: 20.00 },
  { categoria: 'Cerámica y pisos', descripcion: 'Bondex / adhesivo para cerámica (saco 25kg)', unidad: 'saco', precio_min: 6.50, precio_max: 9.00, precio_referencia: 7.50 },
  { categoria: 'Cerámica y pisos', descripcion: 'Fragua / junta para cerámica (funda 1kg)', unidad: 'funda', precio_min: 1.50, precio_max: 3.00, precio_referencia: 2.00 },

  // PINTURA
  { categoria: 'Pintura', descripcion: 'Pintura látex interior económica (galón)', unidad: 'galón', precio_min: 7.00, precio_max: 12.00, precio_referencia: 9.00, notas: 'Rendimiento: 8-10 m²/galón por mano.' },
  { categoria: 'Pintura', descripcion: 'Pintura látex Cóndor/Pintuco (galón)', unidad: 'galón', precio_min: 12.00, precio_max: 18.00, precio_referencia: 15.00, notas: 'Mejor rendimiento: 10-12 m²/galón.' },
  { categoria: 'Pintura', descripcion: 'Pintura caucho exterior (galón)', unidad: 'galón', precio_min: 14.00, precio_max: 22.00, precio_referencia: 17.00 },
  { categoria: 'Pintura', descripcion: 'Empaste/masilla para pared (saco 25kg)', unidad: 'saco', precio_min: 8.00, precio_max: 13.00, precio_referencia: 10.00 },
  { categoria: 'Pintura', descripcion: 'Sellador de paredes (galón)', unidad: 'galón', precio_min: 8.00, precio_max: 14.00, precio_referencia: 11.00 },
  { categoria: 'Pintura', descripcion: 'Lija de pared (pliego)', unidad: 'pliego', precio_min: 0.50, precio_max: 1.20, precio_referencia: 0.75 },

  // INSTALACIONES HIDROSANITARIAS
  { categoria: 'Hidrosanitaria', descripcion: 'Tubo PVC presión 1/2" (6m)', unidad: 'u', precio_min: 4.50, precio_max: 7.00, precio_referencia: 5.50 },
  { categoria: 'Hidrosanitaria', descripcion: 'Tubo PVC presión 3/4" (6m)', unidad: 'u', precio_min: 6.00, precio_max: 9.00, precio_referencia: 7.50 },
  { categoria: 'Hidrosanitaria', descripcion: 'Tubo PVC desagüe 110mm (6m)', unidad: 'u', precio_min: 12.00, precio_max: 18.00, precio_referencia: 15.00 },
  { categoria: 'Hidrosanitaria', descripcion: 'Tubo PVC desagüe 75mm (6m)', unidad: 'u', precio_min: 8.00, precio_max: 13.00, precio_referencia: 10.00 },
  { categoria: 'Hidrosanitaria', descripcion: 'Codo PVC 50mm x 90°', unidad: 'u', precio_min: 1.20, precio_max: 2.20, precio_referencia: 1.78 },
  { categoria: 'Hidrosanitaria', descripcion: 'Caja de revisión prefabricada', unidad: 'u', precio_min: 18.00, precio_max: 30.00, precio_referencia: 22.00 },

  // INSTALACIONES ELÉCTRICAS
  { categoria: 'Eléctrica', descripcion: 'Conductor eléctrico #12 AWG (ml)', unidad: 'ml', precio_min: 0.45, precio_max: 0.80, precio_referencia: 0.60 },
  { categoria: 'Eléctrica', descripcion: 'Conductor eléctrico #10 AWG (ml)', unidad: 'ml', precio_min: 0.70, precio_max: 1.20, precio_referencia: 0.90 },
  { categoria: 'Eléctrica', descripcion: 'Tubo conduit PVC 3/4" (3m)', unidad: 'u', precio_min: 1.50, precio_max: 2.50, precio_referencia: 2.00 },
  { categoria: 'Eléctrica', descripcion: 'Caja octogonal plástica', unidad: 'u', precio_min: 0.35, precio_max: 0.70, precio_referencia: 0.50 },
  { categoria: 'Eléctrica', descripcion: 'Boquilla colgante sencilla', unidad: 'u', precio_min: 0.90, precio_max: 1.80, precio_referencia: 1.28 },
  { categoria: 'Eléctrica', descripcion: 'Tomacorriente doble polarizado', unidad: 'u', precio_min: 2.50, precio_max: 5.00, precio_referencia: 3.50 },
  { categoria: 'Eléctrica', descripcion: 'Interruptor simple', unidad: 'u', precio_min: 2.00, precio_max: 4.50, precio_referencia: 3.00 },

  // CUBIERTA
  { categoria: 'Cubierta', descripcion: 'Zinc ondulado galvanizado (lámina 2.44m)', unidad: 'u', precio_min: 12.00, precio_max: 20.00, precio_referencia: 15.00 },
  { categoria: 'Cubierta', descripcion: 'Zinc liso galvanizado (lámina 2.44m)', unidad: 'u', precio_min: 14.00, precio_max: 22.00, precio_referencia: 17.00 },
  { categoria: 'Cubierta', descripcion: 'Teja colonial cemento (u)', unidad: 'u', precio_min: 1.30, precio_max: 1.80, precio_referencia: 1.56 },
  { categoria: 'Cubierta', descripcion: 'Perfil metálico correa 2"x4" (6m)', unidad: 'u', precio_min: 28.00, precio_max: 40.00, precio_referencia: 33.00 },

  // MANO DE OBRA (referencia zona costera)
  { categoria: 'Mano de obra', descripcion: 'Maestro de obra (jornal 8h)', unidad: 'día', precio_min: 25.00, precio_max: 40.00, precio_referencia: 30.00, notas: 'Zona costera Manabí. Varía por experiencia.' },
  { categoria: 'Mano de obra', descripcion: 'Albañil (jornal 8h)', unidad: 'día', precio_min: 18.00, precio_max: 28.00, precio_referencia: 22.00 },
  { categoria: 'Mano de obra', descripcion: 'Peón de construcción (jornal 8h)', unidad: 'día', precio_min: 15.00, precio_max: 22.00, precio_referencia: 18.00 },
  { categoria: 'Mano de obra', descripcion: 'Fierrero / enfierrador (jornal 8h)', unidad: 'día', precio_min: 20.00, precio_max: 30.00, precio_referencia: 25.00 },
  { categoria: 'Mano de obra', descripcion: 'Electricista (jornal 8h)', unidad: 'día', precio_min: 22.00, precio_max: 35.00, precio_referencia: 28.00 },
  { categoria: 'Mano de obra', descripcion: 'Plomero / gasfitero (jornal 8h)', unidad: 'día', precio_min: 22.00, precio_max: 35.00, precio_referencia: 28.00 },
]

export const CATEGORIAS_PRECIOS = [...new Set(PRECIOS_REFERENCIA.map(p => p.categoria))]