import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'PresupuestoEC',
  description: 'Generador de presupuestos de obra para ingenieros en Ecuador',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${ibmPlexSans.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}