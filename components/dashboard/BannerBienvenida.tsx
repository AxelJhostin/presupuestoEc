'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, CheckCircle2, User, Calculator, FileDown, BookOpen, TrendingUp, MessageCircle, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
}

const PASOS = [
  {
    numero: '01',
    icon: <User className="w-5 h-5 text-blue-600" />,
    titulo: 'Completa tu perfil',
    descripcion: 'Agrega tu nombre, empresa y teléfono. Estos datos aparecerán en el encabezado de todos tus PDFs de forma profesional.',
    accion: '/dashboard/perfil',
    boton: 'Ir al perfil →',
    completable: true,
  },
  {
    numero: '02',
    icon: <Calculator className="w-5 h-5 text-blue-600" />,
    titulo: 'Crea tu primer presupuesto',
    descripcion: 'Usa el Modo Calculadora NEC para calcular materiales automáticamente, o el Modo Libre para construir fila por fila.',
    accion: '/dashboard/new',
    boton: 'Crear presupuesto →',
    completable: true,
  },
  {
    numero: '03',
    icon: <FileDown className="w-5 h-5 text-blue-600" />,
    titulo: 'Exporta tu PDF o Excel',
    descripcion: 'Descarga un documento profesional con tu nombre, empresa y datos del cliente. Listo para entregar.',
    accion: null,
    boton: null,
    completable: false,
  },
]

const FEATURES = [
  {
    icon: <BookOpen className="w-4 h-4 text-blue-400" />,
    texto: 'Biblioteca de APUs reutilizables',
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
    texto: 'Precios de referencia Manabí 2025',
  },
  {
    icon: <Users className="w-4 h-4 text-blue-400" />,
    texto: 'Comparador de hasta 5 proveedores',
  },
  {
    icon: <MessageCircle className="w-4 h-4 text-blue-400" />,
    texto: 'Compartir por WhatsApp con un clic',
  },
  {
    icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
    texto: 'Lista de compras con estados',
  },
  {
    icon: <FileDown className="w-4 h-4 text-blue-400" />,
    texto: 'Plantillas reutilizables de presupuesto',
  },
]

export default function BannerBienvenida({ userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [visible, setVisible] = useState(true)

  async function cerrar() {
    setVisible(false)
    await supabase
      .from('usuarios')
      .update({ onboarding_completado: true })
      .eq('id', userId)
  }

  if (!visible) return null

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl overflow-hidden mb-6 relative">

      {/* Botón cerrar */}
      <button
        onClick={cerrar}
        className="absolute top-4 right-4 text-blue-300 hover:text-white transition-colors z-10"
        title="Cerrar guía"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <span className="text-blue-600 text-sm font-bold">P</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">
              ¡Bienvenido a PresupuestoEC! 🎉
            </h2>
            <p className="text-blue-200 text-sm">
              Tu herramienta de presupuestos de obra para Ecuador — gratis, sin límites.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* Pasos de inicio */}
        <div>
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-4">
            3 pasos para empezar
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PASOS.map((paso, i) => (
              <div key={i} className="bg-white/10 hover:bg-white/15 transition-colors rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0">
                    {paso.icon}
                  </div>
                  <span className="text-2xl font-bold text-white/20">{paso.numero}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm mb-1.5">{paso.titulo}</p>
                  <p className="text-blue-200 text-xs leading-relaxed">{paso.descripcion}</p>
                </div>
                {paso.accion ? (
                  <button
                    onClick={() => router.push(paso.accion!)}
                    className="text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors w-full text-center"
                  >
                    {paso.boton}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-blue-300 bg-white/5 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Disponible en cada presupuesto
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features disponibles */}
        <div className="border-t border-white/10 pt-5">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-3">
            Todo lo que tienes disponible
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                {f.icon}
                <span className="text-xs text-blue-100">{f.texto}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tip y cerrar */}
        <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-4">
          <p className="text-xs text-blue-300">
            💡 <span className="font-medium">Tip:</span> Completa tu perfil primero — tus datos aparecerán en todos los PDFs automáticamente.
          </p>
          <button
            onClick={cerrar}
            className="shrink-0 text-xs text-blue-300 hover:text-white transition-colors whitespace-nowrap"
          >
            Ya entendí →
          </button>
        </div>

      </div>
    </div>
  )
}