import Link from 'next/link'
import { Plus, Calculator, FileText, Download } from 'lucide-react'

export default function EmptyState() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

      {/* Área principal */}
      <div className="py-16 px-6 text-center border-b border-slate-100">
        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Crea tu primer presupuesto</h3>
        <p className="text-slate-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
          Calcula materiales automáticamente con la NEC o construye tu presupuesto fila por fila. Exporta un PDF profesional en minutos.
        </p>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo presupuesto
        </Link>
        <p className="text-xs text-slate-400 mt-4">Gratis · Sin límites · Listo en minutos</p>
      </div>

      {/* Mini features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {[
          {
            icon: <Calculator className="w-5 h-5 text-blue-600" />,
            titulo: 'Modo Calculadora NEC',
            descripcion: 'Ingresa medidas y obtén materiales automáticamente',
          },
          {
            icon: <FileText className="w-5 h-5 text-slate-600" />,
            titulo: 'Modo Libre',
            descripcion: 'Construye tu presupuesto fila por fila',
          },
          {
            icon: <Download className="w-5 h-5 text-green-600" />,
            titulo: 'Exporta PDF y Excel',
            descripcion: 'Documento profesional listo para el cliente',
          },
        ].map(f => (
          <div key={f.titulo} className="px-6 py-5 flex items-start gap-3">
            <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              {f.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{f.titulo}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{f.descripcion}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}