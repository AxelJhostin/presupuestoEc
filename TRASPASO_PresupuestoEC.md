# TRASPASO COMPLETO — PresupuestoEC
## Documento de contexto para nueva conversación con Claude

---

## 1. QUÉ ES EL PROYECTO

PresupuestoEC es una web app de presupuestos de obra para ingenieros civiles, maestros de obra y técnicos independientes en Ecuador. Combina cálculos automáticos basados en la NEC con un modo de entrada manual libre.

- URL de producción: https://presupuesto-ec.vercel.app
- Repositorio: https://github.com/AxelJhostin/presupuestoEc.git
- Autor: Axel Jhostin (Jipijapa, Manabí, Ecuador — estudiante de ingeniería de software)

---

## 2. STACK TECNOLÓGICO

Framework: Next.js 14 (App Router)
Lenguaje: TypeScript
Estilos: Tailwind CSS + shadcn/ui
Base de datos: Supabase (PostgreSQL)
Auth: JWT propio con bcryptjs + jose (NO Supabase Auth)
PDF: @react-pdf/renderer (server-side)
Excel: xlsx
Notificaciones: sonner
Deploy: Vercel
Iconos: lucide-react

---

## 3. VARIABLES DE ENTORNO (.env.local)

NEXT_PUBLIC_SUPABASE_URL=https://gumidewposxzysntvljc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_4d6rTkthWROyrGnZfnfN_Q_KpSgQ28-
JWT_SECRET=presupuestoec_jwt_secret_2024_axel

---

## 4. BASE DE DATOS — SUPABASE

Tablas actuales:

usuarios — Auth propio (NO usa auth.users de Supabase)
id uuid, email, password_hash, nombre, telefono, empresa, created_at

presupuestos
id uuid, user_id, nombre, modo (calculadora|libre), fecha, total,
numero integer, estado (borrador|enviado|aprobado|en_ejecucion),
cliente_nombre, cliente_telefono, cliente_ruc,
notas, imprevistos_pct, utilidad_pct,
es_plantilla boolean, nombre_plantilla,
created_at, updated_at

items_presupuesto
id uuid, presupuesto_id, descripcion, unidad, cantidad, precio_unitario,
subtotal (generated), orden, estado (pendiente|comprado|parcial), seccion,
created_at

calculos_nec
id uuid, presupuesto_id, elemento, medidas_json, materiales_json, created_at

proveedores
id uuid, user_id, nombre, telefono, direccion, notas, created_at

cotizaciones
id uuid, presupuesto_id, proveedor_id, item_descripcion, item_unidad,
item_cantidad, precio_unitario, created_at

apus
id uuid, user_id, codigo, descripcion, unidad, rendimiento,
indirectos_pct, utilidad_pct, costo_directo, precio_unitario,
created_at, updated_at

apu_componentes
id uuid, apu_id, tipo (material|mano_obra|equipo), descripcion,
unidad, cantidad, precio_unitario, subtotal (generated), orden

presupuesto_apus
id uuid, presupuesto_id, apu_id, codigo, descripcion, unidad,
rendimiento, indirectos_pct, utilidad_pct, costo_directo,
precio_unitario, cantidad_presupuesto, subtotal_presupuesto, created_at

presupuesto_apu_componentes
id uuid, presupuesto_apu_id, tipo, descripcion, unidad,
cantidad, precio_unitario, subtotal (generated), orden

RLS: DESACTIVADO en todas las tablas
Siempre filtrar por user_id manualmente en queries
Las plantillas se filtran con .eq('es_plantilla', false) en el dashboard

---

## 5. ARQUITECTURA AUTH

NO usamos Supabase Auth. Auth propio con JWT.

Flujo:
1. Registro → POST /api/auth/register → bcryptjs → tabla usuarios → cookie auth_token
2. Login → POST /api/auth/login → verifica password → cookie auth_token
3. Logout → POST /api/auth/logout → borra cookie
4. Middleware → lib/auth-edge.ts usa jose (Edge Runtime)
5. Server Components → lib/getUser.ts lee cookie y verifica JWT

Archivos clave:
- lib/auth.ts — bcryptjs + jsonwebtoken (API routes, Node runtime)
- lib/auth-edge.ts — jose (middleware, Edge runtime)
- lib/getUser.ts — helper Server Components
- app/api/auth/register/route.ts
- app/api/auth/login/route.ts
- app/api/auth/logout/route.ts
- app/api/auth/me/route.ts
- middleware.ts

Client Components → fetch('/api/auth/me') → { userId, email }
Server Components → getUser() → { userId, email } | null

---

## 6. ESTRUCTURA DE CARPETAS

app/(auth)/login/page.tsx — Login rediseñado
app/(auth)/register/page.tsx — Registro rediseñado
app/dashboard/page.tsx — Dashboard con max-w-7xl, banner gradiente, StatsBar 4 cards
app/dashboard/new/page.tsx — Selección de modo con PlantillasSelector
app/dashboard/new/calculator/page.tsx — Modo calculadora, layout 2 columnas
app/dashboard/new/free/page.tsx — Modo libre, layout 2 columnas
app/dashboard/[id]/page.tsx — Vista presupuesto, layout 2 columnas xl:grid-cols-3
app/dashboard/edit/[id]/page.tsx — Editar, layout 2 columnas con ClienteForm
app/dashboard/perfil/page.tsx — Perfil con preview PDF en tiempo real
app/dashboard/apus/page.tsx — Biblioteca APUs rediseñada
app/page.tsx — Landing page completa rediseñada

app/api/auth/ — register, login, logout, me
app/api/pdf/route.ts — Genera PDF con todos los datos
app/api/presupuestos/duplicar/route.ts — Duplicar presupuesto
app/api/presupuestos/plantilla/route.ts — GET/POST plantillas
app/api/apus/route.ts — CRUD APUs biblioteca
app/api/apus/presupuesto/route.ts — GET/POST/DELETE APUs en presupuesto

components/dashboard/StatsBar.tsx — 4 cards: total, calculadora, aprobados, facturado
components/dashboard/PresupuestoCard.tsx — Con badge estado, número, cliente
components/dashboard/FiltrosDashboard.tsx — Búsqueda + filtro estado + filtro modo
components/dashboard/EmptyState.tsx — Rediseñado con mini features

components/pdf/PresupuestoPDF.tsx — Con cliente, número, notas, resumen financiero

components/APUEditor.tsx — Editor completo de APU
components/APUSelector.tsx — Selector de APUs en presupuesto
components/ClienteForm.tsx — Formulario cliente colapsable
components/ComparadorProveedores.tsx — Con proveedores guardados y cotizaciones persistentes
components/DeleteButton.tsx
components/DuplicarButton.tsx
components/EstadoSelector.tsx — Con router.refresh()
components/ExcelButton.tsx
components/ListaCompras.tsx
components/LogoutButton.tsx
components/NotasPresupuesto.tsx
components/PlantillaButton.tsx
components/PlantillasSelector.tsx
components/PreciosReferencia.tsx — Precios Manabí 2025 con filtros
components/ResumenFinanciero.tsx — Con persistencia en BD
components/SeccionesPresupuesto.tsx — Con persistencia en BD
components/TablaItems.tsx
components/WhatsAppButton.tsx

lib/auth.ts, lib/auth-edge.ts, lib/getUser.ts
lib/catalogo.ts — 50+ materiales
lib/exportExcel.ts
lib/formulas/losa.ts, columna.ts, pintura.ts, mamposteria.ts, ceramica.ts, contrapiso.ts
lib/precios-referencia.ts — Precios zona costera Manabí 2025
lib/supabase/client.ts, server.ts
middleware.ts

---

## 7. FUNCIONALIDADES IMPLEMENTADAS

Auth propio (registro, login, logout, JWT, middleware)
Dashboard con stats avanzadas (total, calculadora, aprobados, facturado)
Modo Calculadora con 6 elementos NEC acumulados
Modo Libre con catálogo 50+ materiales
Campo de cliente (nombre, teléfono, RUC) en PDF y Excel
Número correlativo P-001, P-002 (función SQL generar_numero_presupuesto)
Estado del presupuesto con badge y selector (borrador/enviado/aprobado/en_ejecucion)
Filtros en dashboard (estado, modo, búsqueda)
Comparador de proveedores con guardado persistente
APU completo con biblioteca reutilizable
Plantillas de presupuesto
PDF mejorado (notas, resumen financiero, cliente, número)
Excel con todos los datos
WhatsApp share con mensaje pre-armado
Secciones por item (persistente en BD)
Lista de compras con estados (persistente en BD)
Resumen financiero con imprevistos/utilidad (persistente en BD)
Notas por presupuesto (persistente en BD)
Precios de referencia Manabí 2025
Perfil con preview PDF en tiempo real
Todas las páginas rediseñadas con max-w-7xl y layouts de 2-3 columnas
Landing page completa con todas las features
CLAUDE.md y README.md creados

---

## 8. CÓMO TRABAJAMOS

- Paso a paso: un archivo a la vez, Axel confirma antes de continuar
- Código completo: cuando hay duda, dar el archivo completo para copiar/pegar
- No ZIP: Axel prefiere recibir código directo en el chat
- Commits descriptivos en inglés: una feature por commit
- Anti scope creep: nuevas ideas van al backlog

Comandos:
- npm run dev
- npm run build
- git push (Vercel auto-deploy)

Patrones importantes:
1. Client Components con userId: fetch('/api/auth/me')
2. Server Components: getUser() de lib/getUser.ts
3. Supabase Client: createClient() de lib/supabase/client.ts
4. Supabase Server: createClient() de lib/supabase/server.ts
5. RLS desactivado: siempre .eq('user_id', userId)
6. Middleware usa jose: NO jsonwebtoken en middleware
7. Set iteration: Array.from(new Set(...)) no [...new Set(...)]

---

## 9. DISEÑO Y PALETA

- Paleta: Azul #1D4ED8 (brand) + Gris Slate
- Layout: max-w-7xl en todas las páginas principales
- Fondo: bg-slate-50
- Cards: bg-white border border-slate-200 rounded-xl
- Botón primario: bg-blue-600 hover:bg-blue-700 text-white
- Banner gradiente: bg-gradient-to-r from-blue-600 to-blue-700
- Headers: dos filas — navegación + acciones agrupadas
- Vista presupuesto: xl:grid-cols-3 (2 columna principal + 1 lateral)
- Vista formularios: xl:grid-cols-4 (1 lateral + 3 principal)

---

## 10. BACKLOG (pendiente para futuras sesiones)

- Logo propio en PDF (requiere Supabase Storage)
- Probar flujo completo en móvil
- Tabla de precios de materiales actualizada en tiempo real
- Historial de versiones del presupuesto
- Pago por documento (PayPhone Ecuador o Stripe)

---

Documento generado al final de sesión de desarrollo — PresupuestoEC v1.0
Estado: producto completo, rediseñado y listo para mostrar a usuarios reales
Próximo paso: pruebas con usuarios reales → comprar dominio presupuestoec.com