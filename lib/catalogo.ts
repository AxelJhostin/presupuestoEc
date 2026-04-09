// Catálogo de items predefinidos para modo libre
// Agrupados por categoría para facilitar la búsqueda

export interface ItemCatalogo {
  descripcion: string
  unidad: string
  categoria: string
}

export const CATALOGO: ItemCatalogo[] = [
  // Hormigón y cemento
  { descripcion: "Cemento Portland (saco 50kg)", unidad: "saco", categoria: "Hormigón" },
  { descripcion: "Hormigón f'c=180 kg/cm²", unidad: "m³", categoria: "Hormigón" },
  { descripcion: "Hormigón f'c=210 kg/cm²", unidad: "m³", categoria: "Hormigón" },
  { descripcion: "Hormigón f'c=240 kg/cm²", unidad: "m³", categoria: "Hormigón" },
  { descripcion: "Arena fina", unidad: "m³", categoria: "Hormigón" },
  { descripcion: "Ripio (piedra triturada)", unidad: "m³", categoria: "Hormigón" },
  { descripcion: "Agua", unidad: "litro", categoria: "Hormigón" },

  // Acero
  { descripcion: "Acero de refuerzo varilla 8mm", unidad: "kg", categoria: "Acero" },
  { descripcion: "Acero de refuerzo varilla 10mm", unidad: "kg", categoria: "Acero" },
  { descripcion: "Acero de refuerzo varilla 12mm", unidad: "kg", categoria: "Acero" },
  { descripcion: "Acero de refuerzo varilla 14mm", unidad: "kg", categoria: "Acero" },
  { descripcion: "Acero de refuerzo varilla 16mm", unidad: "kg", categoria: "Acero" },
  { descripcion: "Malla electrosoldada R-84", unidad: "m²", categoria: "Acero" },
  { descripcion: "Alambre de amarre", unidad: "kg", categoria: "Acero" },

  // Mampostería
  { descripcion: "Bloque de hormigón 15x20x40 cm", unidad: "unidad", categoria: "Mampostería" },
  { descripcion: "Bloque de hormigón 10x20x40 cm", unidad: "unidad", categoria: "Mampostería" },
  { descripcion: "Ladrillo macizo", unidad: "unidad", categoria: "Mampostería" },
  { descripcion: "Mortero de pega M10 (1:4)", unidad: "m³", categoria: "Mampostería" },

  // Encofrado
  { descripcion: "Encofrado (madera)", unidad: "m²", categoria: "Encofrado" },
  { descripcion: "Tabla de encofrado 1x10", unidad: "unidad", categoria: "Encofrado" },
  { descripcion: "Pingos (eucalipto)", unidad: "unidad", categoria: "Encofrado" },
  { descripcion: "Puntales metálicos", unidad: "unidad", categoria: "Encofrado" },
  { descripcion: "Desencofrado y limpieza", unidad: "m²", categoria: "Encofrado" },

  // Pisos y revestimientos
  { descripcion: "Cerámica 30x30 cm", unidad: "m²", categoria: "Pisos" },
  { descripcion: "Cerámica 40x40 cm", unidad: "m²", categoria: "Pisos" },
  { descripcion: "Porcelanato 60x60 cm", unidad: "m²", categoria: "Pisos" },
  { descripcion: "Bondex / pegante para cerámica", unidad: "kg", categoria: "Pisos" },
  { descripcion: "Fragua", unidad: "kg", categoria: "Pisos" },
  { descripcion: "Contrapiso e=8cm", unidad: "m²", categoria: "Pisos" },
  { descripcion: "Plástico negro (barrera humedad)", unidad: "m²", categoria: "Pisos" },

  // Pintura
  { descripcion: "Pintura látex interior", unidad: "galón", categoria: "Pintura" },
  { descripcion: "Pintura látex exterior", unidad: "galón", categoria: "Pintura" },
  { descripcion: "Empaste / masilla", unidad: "kg", categoria: "Pintura" },
  { descripcion: "Lija #120", unidad: "pliego", categoria: "Pintura" },
  { descripcion: "Sellador de paredes", unidad: "galón", categoria: "Pintura" },

  // Instalaciones
  { descripcion: "Tubería PVC 1/2\"", unidad: "m", categoria: "Instalaciones" },
  { descripcion: "Tubería PVC 3/4\"", unidad: "m", categoria: "Instalaciones" },
  { descripcion: "Tubería PVC 4\" (desagüe)", unidad: "m", categoria: "Instalaciones" },
  { descripcion: "Tubería conduit 1/2\"", unidad: "m", categoria: "Instalaciones" },
  { descripcion: "Cable eléctrico #12", unidad: "m", categoria: "Instalaciones" },
  { descripcion: "Cable eléctrico #10", unidad: "m", categoria: "Instalaciones" },
  { descripcion: "Caja térmica 4 breakers", unidad: "unidad", categoria: "Instalaciones" },

  // Cubierta
  { descripcion: "Teja de hormigón", unidad: "unidad", categoria: "Cubierta" },
  { descripcion: "Zinc (plancha)", unidad: "m²", categoria: "Cubierta" },
  { descripcion: "Impermeabilizante", unidad: "galón", categoria: "Cubierta" },
  { descripcion: "Manto asfáltico", unidad: "m²", categoria: "Cubierta" },

  // Mano de obra
  { descripcion: "Mano de obra hormigonado", unidad: "m³", categoria: "Mano de obra" },
  { descripcion: "Mano de obra mampostería", unidad: "m²", categoria: "Mano de obra" },
  { descripcion: "Mano de obra pintura", unidad: "m²", categoria: "Mano de obra" },
  { descripcion: "Mano de obra cerámica", unidad: "m²", categoria: "Mano de obra" },
  { descripcion: "Peón (jornal)", unidad: "día", categoria: "Mano de obra" },
  { descripcion: "Maestro de obra (jornal)", unidad: "día", categoria: "Mano de obra" },
]

export const CATEGORIAS = [...new Set(CATALOGO.map(i => i.categoria))]