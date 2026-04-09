import * as XLSX from 'xlsx'

interface Item {
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface ExportData {
  nombre: string
  modo: string
  fecha: string
  total: number
  items: Item[]
  ingeniero?: {
    nombre: string
    email: string
    telefono: string
    empresa: string
  }
}

export function exportarExcel(data: ExportData) {
  const wb = XLSX.utils.book_new()

  const filas: (string | number)[][] = []

  // Título principal
  filas.push(['PRESUPUESTO DE OBRA', '', '', '', ''])
  filas.push(['PresupuestoEC — presupuestoec.com', '', '', '', ''])
  filas.push(['', '', '', '', ''])

  // Datos del ingeniero y proyecto en dos columnas
  const nombreIng = data.ingeniero?.nombre || ''
  const empresa = data.ingeniero?.empresa || ''
  const telefono = data.ingeniero?.telefono || ''
  const email = data.ingeniero?.email || ''

  filas.push(['DATOS DEL PROYECTO', '', '', 'DATOS DEL PROFESIONAL', ''])
  filas.push(['Proyecto:', data.nombre, '', 'Ingeniero:', nombreIng])
  filas.push(['Fecha:', data.fecha, '', 'Empresa:', empresa])
  filas.push(['Modo:', data.modo === 'calculadora' ? 'Calculadora NEC' : 'Modo Libre', '', 'Teléfono:', telefono])
  filas.push(['', '', '', 'Email:', email])
  filas.push(['', '', '', '', ''])

  // Separador
  filas.push(['', '', '', '', ''])

  // Cabecera de tabla
  filas.push(['DESCRIPCIÓN', 'UNIDAD', 'CANTIDAD', 'PRECIO UNIT.', 'SUBTOTAL'])

  // Items
  data.items.forEach(item => {
    filas.push([
      item.descripcion,
      item.unidad,
      item.cantidad,
      item.precio_unitario,
      item.subtotal,
    ])
  })

  // Espacio antes del total
  filas.push(['', '', '', '', ''])
  filas.push(['', '', '', 'SUBTOTAL', data.total])

  // Imprevistos y utilidad (5% y 10% por defecto)
  const imprevistos = data.total * 0.05
  const utilidad = data.total * 0.10
  const totalFinal = data.total + imprevistos + utilidad

  filas.push(['', '', '', 'Imprevistos (5%)', imprevistos])
  filas.push(['', '', '', 'Utilidad (10%)', utilidad])
  filas.push(['', '', '', 'TOTAL FINAL', totalFinal])

  // Pie de página
  filas.push(['', '', '', '', ''])
  filas.push(['', '', '', '', ''])
  filas.push([`Generado por PresupuestoEC — ${new Date().toLocaleDateString('es-EC')}`, '', '', '', ''])

  const ws = XLSX.utils.aoa_to_sheet(filas)

  // Ancho de columnas
  ws['!cols'] = [
    { wch: 45 },
    { wch: 12 },
    { wch: 12 },
    { wch: 18 },
    { wch: 16 },
  ]

  // Fusionar celdas del título
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Título principal
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Subtítulo
    { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // Label datos proyecto
    { s: { r: 3, c: 3 }, e: { r: 3, c: 4 } }, // Label datos profesional
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Presupuesto')

  // ── Hoja 2: Resumen financiero ──
  const resumen: (string | number)[][] = [
    ['RESUMEN FINANCIERO'],
    [''],
    ['Proyecto', data.nombre],
    ['Fecha', data.fecha],
    ['Total items', data.items.length],
    [''],
    ['Subtotal materiales', data.total],
    ['Imprevistos (5%)', imprevistos],
    ['Utilidad (10%)', utilidad],
    ['TOTAL FINAL', totalFinal],
  ]

  const wsResumen = XLSX.utils.aoa_to_sheet(resumen)
  wsResumen['!cols'] = [{ wch: 25 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

  // Descargar
  const nombreArchivo = `presupuesto-${data.nombre.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, nombreArchivo)
}