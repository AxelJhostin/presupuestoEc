# PresupuestoEC — Contexto para Claude Code

## Qué es este proyecto
PresupuestoEC es una aplicación web de presupuestos de obra para ingenieros civiles, maestros de obra y técnicos independientes en Ecuador. Combina cálculos automáticos basados en la NEC con un modo de entrada manual libre.

- **URL producción**: https://presupuesto-ec.vercel.app
- **Repositorio**: https://github.com/AxelJhostin/presupuestoEc.git
- **Autor**: Axel Jhostin — Jipijapa, Manabí, Ecuador

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + shadcn/ui |
| Base de datos | Supabase (PostgreSQL) |
| Auth | JWT propio con bcryptjs + jose |
| PDF | @react-pdf/renderer (server-side) |
| Excel | xlsx |
| Notificaciones | sonner |
| Deploy | Vercel |
| Iconos | lucide-react |

---

## Variables de entorno (.env.local)

NEXT_PUBLIC_SUPABASE_URL=https://gumidewposxzysntvljc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_4d6rTkthWROyrGnZfnfN_Q_KpSgQ28-
JWT_SECRET=presupuestoec_jwt_secret_2024_axel

---

## Arquitectura de autenticación

NO usamos Supabase Auth. Usamos auth propio con JWT porque Supabase tenía rate limits agresivos en el plan gratuito.

Flujo:
1. Registro → POST /api/auth/register → hashea password con bcryptjs → guarda en tabla usuarios → setea cookie auth_token
2. Login → POST /api/auth/login → verifica password → setea cookie auth_token
3. Middleware → lib/auth-edge.ts usa jose para verificar JWT en Edge Runtime

Para obtener userId en Client Components:
- fetch('/api/auth/me') → { userId, email }

Para obtener user en Server Components:
- import { getUser } from '@/lib/getUser'
- const user = getUser() devuelve { userId, email } | null

---

## Base de datos — Supabase

Tablas principales:

- usuarios — Auth propio. Email, password_hash, nombre, telefono, empresa
- presupuestos — user_id, nombre, modo, total, numero, estado, cliente_nombre, cliente_telefono, cliente_ruc, notas, imprevistos_pct, utilidad_pct, es_plantilla, nombre_plantilla
- items_presupuesto — descripcion, unidad, cantidad, precio_unitario, subtotal (generated), orden, estado, seccion
- calculos_nec — Parámetros NEC guardados por presupuesto
- proveedores — Proveedores guardados por usuario
- cotizaciones — Precios por proveedor por item por presupuesto
- apus — Biblioteca de APUs del usuario
- apu_componentes — Materiales/mano de obra/equipo de cada APU
- presupuesto_apus — Copia del APU vinculada a un presupuesto
- presupuesto_apu_componentes — Componentes de la copia del APU

Reglas críticas:
- RLS desactivado en todas las tablas — seguridad a nivel de aplicación
- Siempre filtrar por user_id en queries: .eq('user_id', userId)
- La FK presupuestos.user_id referencia public.usuarios(id), NO auth.users
- Las plantillas se filtran con .eq('es_plantilla', false) en el dashboard

---

## Patrones de código importantes

Client Components que necesitan userId:
- fetch('/api/auth/me') → const { userId } = await res.json()

Supabase en Client Components:
- import { createClient } from '@/lib/supabase/client'

Supabase en Server Components:
- import { createClient } from '@/lib/supabase/server'

Middleware usa jose (NO jsonwebtoken):
- Edge Runtime no soporta jsonwebtoken
- lib/auth-edge.ts usa jose
- lib/auth.ts usa bcryptjs + jsonwebtoken (solo API routes Node runtime)

---

## Estructura de carpetas

app/(auth)/login/ — Login
app/(auth)/register/ — Registro
app/dashboard/ — Dashboard principal
app/dashboard/new/ — Selección de modo
app/dashboard/new/calculator/ — Modo calculadora NEC
app/dashboard/new/free/ — Modo libre
app/dashboard/[id]/ — Vista del presupuesto
app/dashboard/edit/[id]/ — Editar presupuesto
app/dashboard/perfil/ — Perfil del usuario
app/dashboard/apus/ — Biblioteca de APUs
app/api/ — API routes

components/dashboard/ — StatsBar, PresupuestoCard, FiltrosDashboard, EmptyState
components/pdf/ — PresupuestoPDF
components/ — APUEditor, APUSelector, ClienteForm, ComparadorProveedores, EstadoSelector, ExcelButton, ListaCompras, NotasPresupuesto, PlantillaButton, PlantillasSelector, PreciosReferencia, ResumenFinanciero, SeccionesPresupuesto, WhatsAppButton

lib/formulas/ — losa.ts, columna.ts, pintura.ts, mamposteria.ts, ceramica.ts, contrapiso.ts
lib/supabase/ — client.ts, server.ts
lib/auth.ts — bcryptjs + jsonwebtoken
lib/auth-edge.ts — jose (Edge Runtime)
lib/catalogo.ts — 50+ materiales predefinidos
lib/exportExcel.ts — Exportación Excel
lib/getUser.ts — Helper Server Components
lib/precios-referencia.ts — Precios de materiales Manabí 2025

---

## Errores comunes conocidos

- Vercel falla con no-unused-vars: eliminar imports o variables no usadas
- Set iteration error: usar Array.from(new Set(...)) en lugar de [...new Set(...)]
- useEffect warning de dependencias: agregar eslint-disable-next-line react-hooks/exhaustive-deps
- Middleware usa jose: NO usar jsonwebtoken en middleware

---

## Comandos

npm run dev — Servidor de desarrollo (puerto 3000)
npm run build — Build de producción
git push — Deploy automático en Vercel

---

## Diseño y paleta

- Paleta: Azul #1D4ED8 (brand) + Gris Slate
- Layout: max-w-7xl en todas las páginas principales
- Fondo: bg-slate-50
- Cards: bg-white border border-slate-200 rounded-xl
- Botón primario: bg-blue-600 hover:bg-blue-700 text-white
- Banner gradiente: bg-gradient-to-r from-blue-600 to-blue-700