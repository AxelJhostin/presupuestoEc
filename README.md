# PresupuestoEC

Generador de presupuestos de obra para Ecuador

PresupuestoEC es una aplicación web para ingenieros civiles, maestros de obra y técnicos independientes en Ecuador. Combina cálculos automáticos basados en la NEC con un modo de entrada manual libre.

Demo: https://presupuesto-ec.vercel.app

---

## Características principales

- Modo Calculadora NEC — Losa, columna, pintura, mampostería, cerámica, contrapiso
- Modo Libre — Presupuesto fila por fila con catálogo de 50+ materiales
- APU profesional — Biblioteca de Análisis de Precios Unitarios reutilizable
- PDF + Excel — Exportación profesional con datos del ingeniero y cliente
- WhatsApp — Mensaje pre-armado con resumen y link al PDF
- Comparador de proveedores — Hasta 5 proveedores, persistente por presupuesto
- Precios de referencia — Materiales y mano de obra zona costera Manabí 2025
- Plantillas — Guarda presupuestos como plantillas reutilizables
- Estado del presupuesto — Borrador / Enviado / Aprobado / En ejecución
- Número correlativo — P-001, P-002 por usuario
- Datos del cliente — Nombre, teléfono, RUC en PDF y Excel
- Resumen financiero — Imprevistos y utilidad con sliders persistentes
- Lista de compras — Estados por material: pendiente / parcial / comprado
- Filtros en dashboard — Por estado, modo y búsqueda

---

## Stack tecnológico

Framework: Next.js 14 (App Router)
Lenguaje: TypeScript
Estilos: Tailwind CSS + shadcn/ui
Base de datos: Supabase (PostgreSQL)
Auth: JWT propio con bcryptjs + jose
PDF: @react-pdf/renderer
Excel: xlsx
Deploy: Vercel

---

## Instalación local

git clone https://github.com/AxelJhostin/presupuestoEc.git
cd presupuestoec
npm install

Crea el archivo .env.local con:

NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
JWT_SECRET=tu_jwt_secret

Ejecuta el servidor:

npm run dev

---

## Estructura del proyecto

app/ — Páginas y API routes
app/(auth)/ — Login y registro
app/dashboard/ — Dashboard y páginas privadas
app/api/ — API routes
components/ — Componentes reutilizables
lib/formulas/ — Fórmulas NEC
lib/supabase/ — Clientes Supabase
lib/precios-referencia.ts — Precios Manabí 2025
middleware.ts — Protección de rutas

---

## Fórmulas NEC implementadas

Losa maciza — NEC-SE-HM — f'c 180 kg/cm²
Columna rectangular — NEC-SE-HM — f'c 210 kg/cm²
Pintura de pared — Rendimiento Cóndor/Pintuco
Mampostería de bloque — NEC-SE-MP — Mortero M10
Cerámica/porcelanato — Bondex + fragua
Contrapiso — Malla electrosoldada R-84

---

## Licencia

MIT — Axel Jhostin, 2025

---
---

# PresupuestoEC (English)

Construction Budget Generator for Ecuador

PresupuestoEC is a web application for civil engineers, master builders and independent technicians in Ecuador. It combines automatic calculations based on the NEC with a free manual entry mode.

Demo: https://presupuesto-ec.vercel.app

---

## Key Features

- NEC Calculator Mode — Slab, column, painting, masonry, ceramic, floor slab
- Free Mode — Row by row budgets with 50+ materials catalog
- Professional APU — Reusable Unit Price Analysis library
- PDF + Excel — Professional export with engineer and client data
- WhatsApp — Pre-built message with budget summary and PDF link
- Provider Comparison — Up to 5 providers, persistent per budget
- Reference Prices — Materials and labor for Manabí coastal zone 2025
- Templates — Save budgets as reusable templates
- Budget Status — Draft / Sent / Approved / In progress
- Correlative Number — P-001, P-002 per user
- Client Data — Name, phone, RUC in PDF and Excel
- Financial Summary — Contingencies and profit with persistent sliders
- Shopping List — Per-material status: pending / partial / purchased
- Dashboard Filters — By status, mode and search

---

## Tech Stack

Framework: Next.js 14 (App Router)
Language: TypeScript
Styles: Tailwind CSS + shadcn/ui
Database: Supabase (PostgreSQL)
Auth: Custom JWT with bcryptjs + jose
PDF: @react-pdf/renderer
Excel: xlsx
Deploy: Vercel

---

## Local Setup

git clone https://github.com/AxelJhostin/presupuestoEc.git
cd presupuestoec
npm install

Create .env.local with:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret

Run the development server:

npm run dev

---

## NEC Formulas

Solid slab — NEC-SE-HM — f'c 180 kg/cm²
Rectangular column — NEC-SE-HM — f'c 210 kg/cm²
Wall painting — Cóndor/Pintuco rendimiento
Block masonry — NEC-SE-MP — Mortar M10
Ceramic/porcelain — Bondex + grout
Floor slab — Mesh R-84

---

## License

MIT — Axel Jhostin, 2025