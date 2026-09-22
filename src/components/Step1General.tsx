import React from 'react';
import { FunSolicitudPayload, TramiteTipo, ObjetoTramite, ModalidadConstruccion, UsoTipo, AreaUnidadesConstruidas, TipoVivienda } from '../types/fun';
import { DEPARTAMENTOS_COLOMBIA } from '../utils/colombiaData';
import { Building2, Info, Calendar, MapPin, CheckSquare, Layers } from 'lucide-react';

interface Step1Props {
  solicitud: FunSolicitudPayload;
  onChange: (updated: FunSolicitudPayload) => void;
  onNext: () => void;
}

export const Step1General: React.FC<Step1Props> = ({ solicitud, onChange, onNext }) => {
  const municipiosDisponibles = DEPARTAMENTOS_COLOMBIA[solicitud.general.departamento] || ['Bogotá D.C.'];

  const handleGeneralChange = (field: keyof FunSolicitudPayload['general'], value: string) => {
    onChange({
      ...solicitud,
      general: {
        ...solicitud.general,
        [field]: value
      }
    });
  };

  const handleDeptoChange = (depto: string) => {
    const munis = DEPARTAMENTOS_COLOMBIA[depto] || [depto];
    onChange({
      ...solicitud,
      general: {
        ...solicitud.general,
        departamento: depto,
        municipio: munis[0] || depto
      }
    });
  };

  const handleIdentificacionChange = (field: keyof FunSolicitudPayload['identificacion'], value: any) => {
    onChange({
      ...solicitud,
      identificacion: {
        ...solicitud.identificacion,
        [field]: value
      }
    });
  };

  const toggleModalidadConstruccion = (mod: ModalidadConstruccion) => {
    const current = [...(solicitud.identificacion.modalidadesConstruccion || [])];
    const index = current.indexOf(mod);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(mod);
    }
    handleIdentificacionChange('modalidadesConstruccion', current);
  };

  const toggleUso = (uso: UsoTipo) => {
    const current = [...(solicitud.identificacion.usos || [])];
    const index = current.indexOf(uso);
    if (index > -1) {
      if (current.length > 1) { // al menos 1
        current.splice(index, 1);
      }
    } else {
      current.push(uso);
    }
    handleIdentificacionChange('usos', current);
  };

  const tramitesList: Array<{ key: TramiteTipo; label: string; desc: string }> = [
    { key: 'CONSTRUCCION', label: 'Construcción', desc: 'Obra nueva, ampliación, adecuación, etc.' },
    { key: 'URBANIZACION', label: 'Urbanización', desc: 'Desarrollo, saneamiento o reurbanización de predios' },
    { key: 'PARCELACION', label: 'Parcelación', desc: 'Creación de lotes en suelo rural o suburbano' },
    { key: 'SUBDIVISION', label: 'Subdivisión', desc: 'Rural, urbana o reloteo' },
    { key: 'ESPACIO_PUBLICO', label: 'Espacio Público', desc: 'Ocupación o intervención de espacio público' },
    { key: 'RECONOCIMIENTO', label: 'Reconocimiento', desc: 'Existencia de edificaciones' },
    { key: 'OTRAS', label: 'Otras Actuaciones', desc: 'Ajuste de cotas, prórrogas, etc.' }
  ];

  const modalidadesConstruccionList: Array<{ key: ModalidadConstruccion; label: string }> = [
    { key: 'OBRA_NUEVA', label: 'Obra Nueva' },
    { key: 'AMPLIACION', label: 'Ampliación' },
    { key: 'ADECUACION', label: 'Adecuación' },
    { key: 'MODIFICACION', label: 'Modificación' },
    { key: 'RESTAURACION', label: 'Restauración' },
    { key: 'REFORZAMIENTO_ESTRUCTURAL', label: 'Reforzamiento Estructural' },
    { key: 'DEMOLICION_TOTAL', label: 'Demolición Total' },
    { key: 'DEMOLICION_PARCIAL', label: 'Demolición Parcial' },
    { key: 'RECONSTRUCCION', label: 'Reconstrucción' },
    { key: 'CERRAMIENTO', label: 'Cerramiento' }
  ];

  const usosList: Array<{ key: UsoTipo; label: string }> = [
    { key: 'VIVIENDA', label: 'Vivienda' },
    { key: 'COMERCIO_SERVICIOS', label: 'Comercio y Servicios' },
    { key: 'DOTACIONAL', label: 'Dotacional / Institucional' },
    { key: 'INDUSTRIAL', label: 'Industrial' },
    { key: 'OTRO', label: 'Otro Uso' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
              Página 1 del FUN (Resolución 1051 de 2025)
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              0. Datos Generales & 1. Identificación de la Solicitud
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Diligencie los datos de la autoridad competente (Curaduría o Planeación), radicación y el tipo de trámite urbanístico solicitado.
            </p>
          </div>
          <Building2 className="w-10 h-10 text-blue-600 shrink-0 hidden sm:block" />
        </div>
      </div>

      {/* SECCIÓN 0: DATOS GENERALES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">0</span>
          Datos Generales de la Autoridad y Radicación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Autoridad Competente (Curaduría Urbana o Secretaría de Planeación) *
            </label>
            <input
              type="text"
              value={solicitud.general.autoridad}
              onChange={(e) => handleGeneralChange('autoridad', e.target.value)}
              placeholder="Ej. Curaduría Urbana No. 1 de Bogotá D.C."
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              No. de Radicación (si ya fue asignado)
            </label>
            <input
              type="text"
              value={solicitud.general.radicacionNo || ''}
              onChange={(e) => handleGeneralChange('radicacionNo', e.target.value)}
              placeholder="Ej. 11001-1-26-0042"
              className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Fecha de Diligenciamiento *
            </label>
            <input
              type="date"
              value={solicitud.general.fecha}
              onChange={(e) => handleGeneralChange('fecha', e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Departamento *
            </label>
            <select
              value={solicitud.general.departamento}
              onChange={(e) => handleDeptoChange(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
            >
              {Object.keys(DEPARTAMENTOS_COLOMBIA).map((dep) => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Municipio / Distrito *
            </label>
            <select
              value={solicitud.general.municipio}
              onChange={(e) => handleGeneralChange('municipio', e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
            >
              {municipiosDisponibles.map((muni) => (
                <option key={muni} value={muni}>{muni}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: IDENTIFICACIÓN DE LA SOLICITUD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
          1. Identificación de la Solicitud
        </h3>

        {/* 1.1 Tipo de trámite */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            1.1 Tipo de Trámite Principal *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {tramitesList.map((item) => {
              const isSelected = solicitud.identificacion.tipoTramite === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleIdentificacionChange('tipoTramite', item.key)}
                  className={`p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                    <input
                      type="radio"
                      checked={isSelected}
                      readOnly
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1.2 Objeto del trámite */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            1.2 Objeto del Trámite *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['INICIAL', 'MODIFICACION', 'REVALIDACION', 'OTRAS'] as ObjetoTramite[]).map((obj) => {
              const isSelected = solicitud.identificacion.objetoTramite === obj;
              const labels: Record<ObjetoTramite, string> = {
                INICIAL: 'Inicial',
                MODIFICACION: 'Modificación de Licencia Vigente',
                REVALIDACION: 'Revalidación',
                OTRAS: 'Otras'
              };
              return (
                <button
                  key={obj}
                  type="button"
                  onClick={() => handleIdentificacionChange('objetoTramite', obj)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                      {labels[obj]}
                    </span>
                    <input type="radio" checked={isSelected} readOnly className="text-indigo-600" />
                  </div>
                </button>
              );
            })}
          </div>
          {solicitud.identificacion.objetoTramite === 'OTRAS' && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-slate-700 mb-1">Especifique qué otro objeto:</label>
              <input
                type="text"
                value={solicitud.identificacion.objetoTramiteCual || ''}
                onChange={(e) => handleIdentificacionChange('objetoTramiteCual', e.target.value)}
                placeholder="Indique la actuación..."
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          )}
        </div>

        {/* 1.3 Modalidades de Construcción */}
        {solicitud.identificacion.tipoTramite === 'CONSTRUCCION' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1.3 Modalidades de Construcción (Selección Múltiple)
              </label>
              <span className="text-xs text-slate-500">
                Seleccionadas: {solicitud.identificacion.modalidadesConstruccion?.length || 0}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {modalidadesConstruccionList.map((mod) => {
                const isChecked = solicitud.identificacion.modalidadesConstruccion?.includes(mod.key);
                return (
                  <button
                    key={mod.key}
                    type="button"
                    onClick={() => toggleModalidadConstruccion(mod.key)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                      isChecked
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckSquare className={`w-3.5 h-3.5 ${isChecked ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{mod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modalidades Urbanización o Subdivisión si aplica */}
        {solicitud.identificacion.tipoTramite === 'URBANIZACION' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Modalidad de Urbanización
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['DESARROLLO', 'SANEAMIENTO', 'REURBANIZACION'] as const).map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => handleIdentificacionChange('modalidadUrbanizacion', mod)}
                  className={`p-2.5 rounded-lg text-xs font-semibold border ${
                    solicitud.identificacion.modalidadUrbanizacion === mod
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>
        )}

        {solicitud.identificacion.tipoTramite === 'SUBDIVISION' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Modalidad de Subdivisión
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['RURAL', 'URBANA', 'RELOTEO'] as const).map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => handleIdentificacionChange('modalidadSubdivision', mod)}
                  className={`p-2.5 rounded-lg text-xs font-semibold border ${
                    solicitud.identificacion.modalidadSubdivision === mod
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1.4 Usos */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
            1.4 Usos Predominantes de la Edificación / Urbanización *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {usosList.map((uso) => {
              const isChecked = solicitud.identificacion.usos?.includes(uso.key);
              return (
                <button
                  key={uso.key}
                  type="button"
                  onClick={() => toggleUso(uso.key)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-400'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{uso.label}</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isChecked && <span className="text-[10px]">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1.5 Escala y Regulaciones Especiales (Ley 1796 / BIC) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Área / Unidades construidas */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Escala de Construcción *
            </label>
            <select
              value={solicitud.identificacion.areaUnidadesConstruidas}
              onChange={(e) => handleIdentificacionChange('areaUnidadesConstruidas', e.target.value as AreaUnidadesConstruidas)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="MENOR_2000">Menor a 2.000 m²</option>
              <option value="MAYOR_IGUAL_2000">Mayor o igual a 2.000 m² (Ley 1796 de 2016)</option>
              <option value="SUPERA_POR_AMPLIACION_2000">Supera 2.000 m² por Ampliación</option>
              <option value="CINCO_O_MAS_VIVIENDA">5 o más unidades habitacionales</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              * Edificaciones ≥ 2.000 m² requieren revisión estructural y supervisión técnica independiente según la Ley 1796 de 2016.
            </p>
          </div>

          {/* Tipo de Vivienda */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Tipo de Vivienda (si aplica)
            </label>
            <select
              value={solicitud.identificacion.tipoVivienda || 'NO_VIS'}
              onChange={(e) => handleIdentificacionChange('tipoVivienda', e.target.value as TipoVivienda)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white font-medium"
            >
              <option value="VIP">Vivienda de Interés Prioritario (VIP)</option>
              <option value="VIS">Vivienda de Interés Social (VIS)</option>
              <option value="NO_VIS">No VIS (Comercial ordinaria)</option>
            </select>
          </div>

          {/* Bien de Interés Cultural */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Patrimonio / Interés Cultural
            </label>
            <button
              type="button"
              onClick={() => handleIdentificacionChange('bienInteresCultural', !solicitud.identificacion.bienInteresCultural)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg border text-xs font-semibold transition-all ${
                solicitud.identificacion.bienInteresCultural
                  ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Bien de Interés Cultural (BIC)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                solicitud.identificacion.bienInteresCultural ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {solicitud.identificacion.bienInteresCultural ? 'SÍ (BIC)' : 'NO'}
              </span>
            </button>
            <p className="text-[11px] text-slate-500 mt-1">
              Requiere visto bueno o autorización de la autoridad de patrimonio cultural competente.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center px-6 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          Continuar a Predio y Linderos →
        </button>
      </div>
    </div>
  );
};
