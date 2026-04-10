import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1d4ed8',
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  logo: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1d4ed8',
  },
  logoSubtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  ingenieroBlock: {
    textAlign: 'right',
  },
  ingenieroNombre: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  ingenieroDetalle: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  clienteBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  clienteTitle: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  clienteRow: {
    flexDirection: 'row',
    gap: 24,
  },
  clienteItem: {
    flex: 1,
  },
  clienteLabel: {
    fontSize: 7,
    color: '#94a3b8',
    marginBottom: 1,
  },
  clienteValue: {
    fontSize: 9,
    color: '#1e293b',
    fontFamily: 'Helvetica-Bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  colDescripcion: { flex: 3 },
  colUnidad: { flex: 1, textAlign: 'center' },
  colCantidad: { flex: 1, textAlign: 'right' },
  colPrecio: { flex: 1, textAlign: 'right' },
  colSubtotal: { flex: 1, textAlign: 'right' },
  headerText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  cellText: {
    fontSize: 9,
    color: '#334155',
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#f8fafc',
    borderTopWidth: 2,
    borderTopColor: '#1d4ed8',
    marginTop: 2,
  },
  totalLabel: {
    flex: 6,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#1e293b',
  },
  totalValue: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#1d4ed8',
  },
  notasBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 10,
    marginTop: 12,
  },
  notasTitle: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  notasText: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.5,
  },
  resumenBox: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  resumenLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  resumenValue: {
    fontSize: 9,
    color: '#334155',
  },
  resumenTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#1d4ed8',
  },
  resumenTotalLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },
  resumenTotalValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1d4ed8',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
})

interface Item {
  descripcion: string
  unidad: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface Ingeniero {
  nombre: string
  email: string
  telefono: string
  empresa: string
}

interface Props {
  nombre: string
  modo: string
  fecha: string
  total: number
  items: Item[]
  ingeniero?: Ingeniero
  numero?: number
  cliente_nombre?: string
  cliente_telefono?: string
  cliente_ruc?: string
  notas?: string
  estado?: string
  imprevistos_pct?: number
  utilidad_pct?: number
}

export default function PresupuestoPDF({
  nombre,
  modo,
  fecha,
  total,
  items,
  ingeniero,
  numero,
  cliente_nombre,
  cliente_telefono,
  cliente_ruc,
  notas,
  imprevistos_pct = 5,
  utilidad_pct = 10,
}: Props) {
  const tieneCliente = cliente_nombre || cliente_telefono || cliente_ruc

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>PresupuestoEC</Text>
            <Text style={styles.logoSubtitle}>Generador de presupuestos de obra — Ecuador</Text>
          </View>
          {ingeniero && (ingeniero.nombre || ingeniero.empresa) && (
            <View style={styles.ingenieroBlock}>
              {ingeniero.nombre ? <Text style={styles.ingenieroNombre}>{ingeniero.nombre}</Text> : null}
              {ingeniero.empresa ? <Text style={styles.ingenieroDetalle}>{ingeniero.empresa}</Text> : null}
              {ingeniero.telefono ? <Text style={styles.ingenieroDetalle}>{ingeniero.telefono}</Text> : null}
              {ingeniero.email ? <Text style={styles.ingenieroDetalle}>{ingeniero.email}</Text> : null}
            </View>
          )}
        </View>

        {/* Info del presupuesto */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Proyecto</Text>
            <Text style={styles.infoValue}>{nombre}</Text>
          </View>
          {numero && (
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>N° Presupuesto</Text>
              <Text style={styles.infoValue}>P-{String(numero).padStart(3, '0')}</Text>
            </View>
          )}
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Modo</Text>
            <Text style={styles.infoValue}>{modo === 'calculadora' ? 'Calculadora NEC' : 'Modo Libre'}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Fecha</Text>
            <Text style={styles.infoValue}>{fecha}</Text>
          </View>
        </View>

        {/* Datos del cliente */}
        {tieneCliente && (
          <View style={styles.clienteBox}>
            <Text style={styles.clienteTitle}>Cliente</Text>
            <View style={styles.clienteRow}>
              {cliente_nombre ? (
                <View style={styles.clienteItem}>
                  <Text style={styles.clienteLabel}>Nombre</Text>
                  <Text style={styles.clienteValue}>{cliente_nombre}</Text>
                </View>
              ) : null}
              {cliente_ruc ? (
                <View style={styles.clienteItem}>
                  <Text style={styles.clienteLabel}>RUC / Cédula</Text>
                  <Text style={styles.clienteValue}>{cliente_ruc}</Text>
                </View>
              ) : null}
              {cliente_telefono ? (
                <View style={styles.clienteItem}>
                  <Text style={styles.clienteLabel}>Teléfono</Text>
                  <Text style={styles.clienteValue}>{cliente_telefono}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Tabla */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colDescripcion]}>Descripción</Text>
          <Text style={[styles.headerText, styles.colUnidad]}>Unidad</Text>
          <Text style={[styles.headerText, styles.colCantidad]}>Cantidad</Text>
          <Text style={[styles.headerText, styles.colPrecio]}>P. Unit.</Text>
          <Text style={[styles.headerText, styles.colSubtotal]}>Subtotal</Text>
        </View>

        {items.map((item, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.cellText, styles.colDescripcion]}>{item.descripcion}</Text>
            <Text style={[styles.cellText, styles.colUnidad]}>{item.unidad}</Text>
            <Text style={[styles.cellText, styles.colCantidad]}>{item.cantidad}</Text>
            <Text style={[styles.cellText, styles.colPrecio]}>${Number(item.precio_unitario).toFixed(2)}</Text>
            <Text style={[styles.cellText, styles.colSubtotal]}>${Number(item.subtotal).toFixed(2)}</Text>
          </View>
        ))}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalValue}>${Number(total).toFixed(2)}</Text>
        </View>

        {/* Resumen financiero */}
        {(imprevistos_pct > 0 || utilidad_pct > 0) && (
          <View style={styles.resumenBox}>
            <View style={styles.resumenRow}>
              <Text style={styles.resumenLabel}>Subtotal materiales</Text>
              <Text style={styles.resumenValue}>${Number(total).toFixed(2)}</Text>
            </View>
            {imprevistos_pct > 0 && (
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>Imprevistos ({imprevistos_pct}%)</Text>
                <Text style={styles.resumenValue}>+${(total * imprevistos_pct / 100).toFixed(2)}</Text>
              </View>
            )}
            {utilidad_pct > 0 && (
              <View style={styles.resumenRow}>
                <Text style={styles.resumenLabel}>Utilidad ({utilidad_pct}%)</Text>
                <Text style={styles.resumenValue}>+${(total * utilidad_pct / 100).toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.resumenTotal}>
              <Text style={styles.resumenTotalLabel}>TOTAL FINAL</Text>
              <Text style={styles.resumenTotalValue}>
                ${(total * (1 + imprevistos_pct / 100 + utilidad_pct / 100)).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Notas */}
        {notas && (
          <View style={styles.notasBox}>
            <Text style={styles.notasTitle}>Notas y observaciones</Text>
            <Text style={styles.notasText}>{notas}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Generado por PresupuestoEC · presupuestoec.com · {new Date().toLocaleDateString('es-EC')}
        </Text>

      </Page>
    </Document>
  )
}