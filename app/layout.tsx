import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://presupuesto-ec.vercel.app'
const APP_NAME = 'PresupuestoEC'
const APP_DESCRIPTION = 'Genera presupuestos de obra profesionales en minutos. Cálculos automáticos según la NEC, APU completo, comparador de proveedores, exportación PDF y Excel. Para ingenieros civiles, maestros de obra y técnicos independientes en Ecuador.'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: `${APP_NAME} — Presupuestos de obra para Ecuador`,
    template: `%s | ${APP_NAME}`,
  },

  description: APP_DESCRIPTION,

  keywords: [
    'presupuesto de obra Ecuador',
    'presupuesto construcción Ecuador',
    'calculadora NEC Ecuador',
    'presupuesto ingeniero civil Ecuador',
    'APU análisis precios unitarios Ecuador',
    'presupuesto obra Manabí',
    'presupuesto construcción Manta',
    'presupuesto construcción Portoviejo',
    'generador presupuestos construcción',
    'NEC norma ecuatoriana construcción',
    'cálculo materiales construcción Ecuador',
    'presupuesto losa columna pintura Ecuador',
    'software presupuestos ingeniería Ecuador',
    'maestro de obra presupuesto Ecuador',
    'presupuesto remodelación Ecuador',
    'costo construcción Ecuador',
    'precios materiales construcción Manabí',
    'análisis precios unitarios construcción',
    'presupuesto obra gratis Ecuador',
    'PDF presupuesto obra Ecuador',
  ],

  authors: [{ name: 'Axel Jhostin', url: APP_URL }],
  creator: 'Axel Jhostin',
  publisher: APP_NAME,

  alternates: {
    canonical: '/',
  },

  category: 'construction',

  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — Presupuestos de obra profesionales para Ecuador`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — Generador de presupuestos de obra para Ecuador`,
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@presupuestoec',
    creator: '@presupuestoec',
    title: `${APP_NAME} — Presupuestos de obra para Ecuador`,
    description: 'Cálculos NEC automáticos, APU, PDF y Excel. Para ingenieros y maestros de obra en Ecuador. Gratis.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: '',
  },

  appLinks: {
    web: {
      url: APP_URL,
      should_fallback: true,
    },
  },

  other: {
    'geo.region': 'EC-M',
    'geo.placename': 'Manabí, Ecuador',
    'geo.position': '-1.0;-80.0',
    'ICBM': '-1.0, -80.0',
    'language': 'Spanish',
    'revisit-after': '7 days',
    'rating': 'general',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1D4ED8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="application-name" content={APP_NAME} />
        <meta name="msapplication-TileColor" content="#1D4ED8" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href={APP_URL} />
      </head>
      <body className={`${ibmPlexSans.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}