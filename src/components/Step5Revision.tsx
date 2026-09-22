import React, { useMemo } from 'react';
import { FunSolicitudPayload } from '../types/fun';
import { funSolicitudSchema } from '../utils/schemaValidation';
import {
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Database,
  Building,
  MapPin,
  Users,
  Leaf,
  Layers,
  Sparkles
} from 'lucide-react';

interface Step5Props {
  solicitud: FunSolicitudPayload;
  onDescargarPdf: () => void;
  onOpenSqlModal: () => void;
  onBack: () => void;
  isGeneratingPdf: boolean;
  onGoToStep: (step: number) => void;
}

export const Step5Revision: React.FC<Step5Props> = ({
  solicitud,
  onDescargarPdf,
  onOpenSqlModal,
  onBack,
  isGeneratingPdf,
  onGoToStep
}) => {
  // Validation with Zod
  const validationResult = useMemo(() => {
    return funSolicitudSchema.safeParse(solicitud);
  }, [solicitud]);

  const errors = useMemo(() => {
    if (validationResult.success) return [];
    return validationResult.error.errors.map((err) => ({
      path: err.path.join(' → '),
      message: err.message
    }));
  }, [validationResult]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
              Validación y Radicación
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Revisión Integral del Formulario Único Nacional (FUN)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Verifique la concordancia de la información antes de generar el documento oficial en formato PDF conforme a la Resolución 1051 de 2025.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenSqlModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Esquema SQL Supabase</span>
            </button>

            <button
              type="button"
              onClick={onDescargarPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generando PDF Oficial...' : 'Descargar PDF (4 Páginas)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation status badge */}
      {errors.length === 0 ? (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 flex items-start gap-3.5">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-emerald-900">
              Validación Exitosa: Todos los requisitos obligatorios están completos
            </h4>
            <p className="text-xs text-emerald-800 mt-1">
              La solicitud cumple con el esquema oficial de datos reglamentado por el Decreto 1077 de 2015 y la Resolución 1051 de 2025. El PDF generado tendrá validez legal para su radicación ante Curadurías Urbanas o Secretarías de Planeación Municipal.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Se detectaron campos obligatorios pendientes ({errors.length})
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Revise las siguientes observaciones para garantizar la completitud de la solicitud:
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-2 border-t border-amber-200/80 text-xs text-amber-900">
            {errors.map((err, i) => (
              <li key={i} className="flex items-center gap-2 bg-white/70 px-3 py-1.5 rounded-lg border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-slate-700">{err.path}:</span>
                <span className="text-slate-900">{err.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Datos Generales e Identificación */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              PÁGINA 1: GENERALIDADES & TRÁMITE
            </span>
            <button
              onClick={() => onGoToStep(1)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Autoridad:</span>
              <span className="font-semibold text-slate-900">{solicitud.general.autoridad || 'No indicada'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Ubicación:</span>
              <span className="font-semibold text-slate-900">{solicitud.general.municipio}, {solicitud.general.departamento}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Tipo de Trámite:</span>
              <span className="font-semibold text-blue-800">{solicitud.identificacion.tipoTramite}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Objeto:</span>
              <span className="font-semibold text-slate-900">{solicitud.identificacion.objetoTramite}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block">Modalidades:</span>
              <span className="font-semibold text-slate-900">
                {solicitud.identificacion.modalidadesConstruccion?.join(', ') || 'Ninguna'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Predio y Linderos */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              PÁGINAS 1-2: PREDIO & LINDEROS
            </span>
            <button
              onClick={() => onGoToStep(2)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="col-span-2">
              <span className="text-slate-500 block">Dirección Predio:</span>
              <span className="font-semibold text-slate-900">{solicitud.predio.direccionActual || 'No indicada'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Matrícula Inmobiliaria:</span>
              <span className="font-mono font-semibold text-slate-900">{solicitud.predio.matriculaInmobiliaria || '---'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Cédula Catastral:</span>
              <span className="font-mono font-semibold text-slate-900">{solicitud.predio.identificacionCatastral || '---'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Área Total:</span>
              <span className="font-semibold text-blue-900">{solicitud.linderos.areaTotalPredio} m²</span>
            </div>
            <div>
              <span className="text-slate-500 block">Vecinos Colindantes:</span>
              <span className="font-semibold text-slate-900">{solicitud.vecinosColindantes.length} registrados</span>
            </div>
          </div>
        </div>

        {/* Card 3: Titulares y Profesionales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              PÁGINAS 2-3: TITULARES & PROFESIONALES
            </span>
            <button
              onClick={() => onGoToStep(3)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Editar
            </button>
          </div>
          <div className="text-xs space-y-2">
            <div>
              <span className="text-slate-500 block">Titulares ({solicitud.titulares.length}):</span>
              <span className="font-semibold text-slate-900">
                {solicitud.titulares.map(t => t.nombre || 'Sin nombre').join(' • ')}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Responsable de Solicitud:</span>
              <span className="font-semibold text-slate-900">
                {solicitud.responsableSolicitud.nombre} (C.C. {solicitud.responsableSolicitud.cedula})
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Profesionales con datos:</span>
              <span className="font-semibold text-slate-800">
                {Object.keys(solicitud.profesionales).length} profesionales registrados
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Construcción Sostenible */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              PÁGINA 4: ANEXO SOSTENIBLE (RES. 0549)
            </span>
            <button
              onClick={() => onGoToStep(4)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
            >
              Editar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">Clima:</span>
              <span className="font-semibold text-slate-900">
                {solicitud.anexoConstruccionSostenible?.zonificacionClimatica}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Ahorro Agua Estimado:</span>
              <span className="font-bold text-blue-700">
                {solicitud.anexoConstruccionSostenible?.porcentajeAhorroAguaEsperado}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Ahorro Energía:</span>
              <span className="font-bold text-amber-700">
                {solicitud.anexoConstruccionSostenible?.porcentajeAhorroEnergiaEsperado}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Cumplimiento:</span>
              <span className="font-semibold text-emerald-700">Norma Res. 0549</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official PDF Document Structure Visualizer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Estructura del Formulario Único Nacional en PDF
              </h3>
              <p className="text-xs text-slate-400">
                Resolución 1051 de 2025 del Ministerio de Vivienda, Ciudad y Territorio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDescargarPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Descargar Ahora</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-xs font-bold text-blue-300 block">PÁGINA 1</span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>• Encabezado oficial y autoridad</li>
              <li>• Identificación y modalidad</li>
              <li>• Usos, escalas y patrimonio BIC</li>
              <li>• Datos catastrales del predio</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-xs font-bold text-blue-300 block">PÁGINA 2</span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>• Citación a 8 vecinos colindantes</li>
              <li>• Linderos Norte, Sur, Oriente, Occ.</li>
              <li>• Área total en m² del predio</li>
              <li>• Hasta 4 titulares y firmas</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-xs font-bold text-blue-300 block">PÁGINA 3</span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>• Profesionales (Constructor, Arq, etc.)</li>
              <li>• Validación supervisión Ley 1796</li>
              <li>• Apoderado / Mandatario</li>
              <li>• Notificación electrónica oficial</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-xs font-bold text-emerald-400 block">PÁGINA 4 (ANEXO)</span>
            <ul className="text-[11px] text-slate-300 space-y-1">
              <li>• Guía de Construcción Sostenible</li>
              <li>• Medidas pasivas y activas</li>
              <li>• Ahorros de agua y energía %</li>
              <li>• Certificación del diseñador</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          ← Regresar a Construcción Sostenible
        </button>
        <button
          type="button"
          onClick={onDescargarPdf}
          disabled={isGeneratingPdf}
          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          {isGeneratingPdf ? 'Generando PDF...' : 'Generar y Descargar FUN Oficial'}
        </button>
      </div>
    </div>
  );
};
