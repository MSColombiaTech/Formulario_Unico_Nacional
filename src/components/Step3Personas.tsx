import React from 'react';
import { FunSolicitudPayload, ROLES_PROFESIONALES, Titular, ProfesionalInfo } from '../types/fun';
import { Users, Plus, Trash2, Briefcase, UserCheck, Shield, CheckCircle } from 'lucide-react';

interface Step3Props {
  solicitud: FunSolicitudPayload;
  onChange: (updated: FunSolicitudPayload) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Personas: React.FC<Step3Props> = ({ solicitud, onChange, onNext, onBack }) => {
  // Titulares
  const addTitular = () => {
    if (solicitud.titulares.length >= 4) return;
    onChange({
      ...solicitud,
      titulares: [
        ...solicitud.titulares,
        { nombre: '', ccNit: '', telefono: '', correoElectronico: '' }
      ]
    });
  };

  const removeTitular = (index: number) => {
    if (solicitud.titulares.length <= 1) return;
    const updated = solicitud.titulares.filter((_, idx) => idx !== index);
    onChange({
      ...solicitud,
      titulares: updated
    });
  };

  const updateTitular = (index: number, field: keyof Titular, val: string) => {
    const updated = [...solicitud.titulares];
    updated[index] = {
      ...updated[index],
      [field]: val
    };
    onChange({
      ...solicitud,
      titulares: updated
    });
  };

  // Profesionales
  const updateProfesional = (rolKey: string, field: keyof ProfesionalInfo, val: any) => {
    const currentProf = solicitud.profesionales[rolKey] || {
      nombre: '',
      cedula: '',
      matriculaProfesional: '',
      fechaExpedicionMatricula: '',
      correoElectronico: '',
      telefono: '',
      exigeSupervisionTecnica: false
    };

    onChange({
      ...solicitud,
      profesionales: {
        ...solicitud.profesionales,
        [rolKey]: {
          ...currentProf,
          [field]: val
        }
      }
    });
  };

  // Responsable de la solicitud
  const updateResponsable = (field: keyof FunSolicitudPayload['responsableSolicitud'], val: any) => {
    onChange({
      ...solicitud,
      responsableSolicitud: {
        ...solicitud.responsableSolicitud,
        [field]: val
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
              Páginas 2 y 3 del FUN
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              5. Titulares, 5.2 Profesionales Responsables & 5.3 Apoderado
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Ingrese los propietarios o titulares de derechos reales, los profesionales idóneos que suscriben los diseños bajo NSR-10 / Ley 1796, y el responsable de la solicitud.
            </p>
          </div>
          <Users className="w-10 h-10 text-blue-600 shrink-0 hidden sm:block" />
        </div>
      </div>

      {/* 5. TITULARES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">5</span>
            5. Titulares de la Solicitud (Hasta 4 Personas Naturales o Jurídicas)
          </h3>
          <button
            type="button"
            onClick={addTitular}
            disabled={solicitud.titulares.length >= 4}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Titular ({solicitud.titulares.length}/4)</span>
          </button>
        </div>

        {/* Notificación Electrónica Titulares */}
        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-3">
          <input
            type="checkbox"
            id="notifTitulares"
            checked={solicitud.titularesAceptanNotificacionElectronica}
            onChange={(e) => onChange({ ...solicitud, titularesAceptanNotificacionElectronica: e.target.checked })}
            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
          <label htmlFor="notifTitulares" className="text-xs text-indigo-950 font-medium cursor-pointer">
            <span className="font-bold">Autorización Expresa de Notificación Electrónica: </span>
            Los titulares autorizan de manera inequívoca que todas las comunicaciones, requerimientos de observaciones y actos administrativos (resolución o licencia) sean notificados a los correos electrónicos registrados, en los términos de la Ley 1437 de 2011 (CPACA).
          </label>
        </div>

        <div className="space-y-4">
          {solicitud.titulares.map((tit, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  Titular No. {idx + 1}
                </span>
                {solicitud.titulares.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTitular(idx)}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nombre o Razón Social *
                  </label>
                  <input
                    type="text"
                    value={tit.nombre}
                    onChange={(e) => updateTitular(idx, 'nombre', e.target.value)}
                    placeholder="Ej. Construcciones SAS o Juan Pérez"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    C.C. o NIT *
                  </label>
                  <input
                    type="text"
                    value={tit.ccNit}
                    onChange={(e) => updateTitular(idx, 'ccNit', e.target.value)}
                    placeholder="Ej. 901.458.712-4"
                    className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Teléfono Móvil *
                  </label>
                  <input
                    type="text"
                    value={tit.telefono}
                    onChange={(e) => updateTitular(idx, 'telefono', e.target.value)}
                    placeholder="Ej. 3104558899"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    value={tit.correoElectronico}
                    onChange={(e) => updateTitular(idx, 'correoElectronico', e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5.2 PROFESIONALES RESPONSABLES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">5.2</span>
            Profesionales Responsables del Proyecto (NSR-10 / Ley 1796 de 2016)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Cada profesional debe estar debidamente matriculado ante COPNIA, CPNAA o CPNT y habilitado para el ejercicio.
          </p>
        </div>

        <div className="space-y-4">
          {ROLES_PROFESIONALES.map((rol) => {
            const prof = solicitud.profesionales[rol.key] || {
              nombre: '',
              cedula: '',
              matriculaProfesional: '',
              fechaExpedicionMatricula: '',
              correoElectronico: '',
              telefono: '',
              exigeSupervisionTecnica: false
            };

            const isFilled = !!prof.nombre;

            return (
              <div
                key={rol.key}
                className={`p-4 rounded-xl border transition-all ${
                  isFilled
                    ? 'border-blue-300 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      {rol.label}
                    </span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      ({rol.desc})
                    </span>
                  </div>
                  {rol.obligatorio ? (
                    <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Obligatorio
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Según escala / Ley 1796
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={prof.nombre}
                      onChange={(e) => updateProfesional(rol.key, 'nombre', e.target.value)}
                      placeholder="Ej. Ing. Gustavo Rojas"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Cédula de Ciudadanía</label>
                    <input
                      type="text"
                      value={prof.cedula}
                      onChange={(e) => updateProfesional(rol.key, 'cedula', e.target.value)}
                      placeholder="Ej. 19.450.321"
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Matrícula Profesional</label>
                    <input
                      type="text"
                      value={prof.matriculaProfesional}
                      onChange={(e) => updateProfesional(rol.key, 'matriculaProfesional', e.target.value)}
                      placeholder="Ej. 25202-045811 CND"
                      className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Fecha Expedición Matrícula</label>
                    <input
                      type="date"
                      value={prof.fechaExpedicionMatricula}
                      onChange={(e) => updateProfesional(rol.key, 'fechaExpedicionMatricula', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={prof.telefono}
                      onChange={(e) => updateProfesional(rol.key, 'telefono', e.target.value)}
                      placeholder="Ej. 3118995544"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={prof.correoElectronico}
                      onChange={(e) => updateProfesional(rol.key, 'correoElectronico', e.target.value)}
                      placeholder="profesional@ejemplo.com"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                {rol.exigeSupervisionPosible && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`sup-${rol.key}`}
                      checked={prof.exigeSupervisionTecnica || false}
                      onChange={(e) => updateProfesional(rol.key, 'exigeSupervisionTecnica', e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <label htmlFor={`sup-${rol.key}`} className="text-xs font-semibold text-blue-900 cursor-pointer">
                      El proyecto exige Supervisión Técnica Independiente en obra conforme a la Ley 1796 de 2016.
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5.3 RESPONSABLE DE LA SOLICITUD (APODERADO) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">5.3</span>
          5.3 Responsable de la Solicitud (Apoderado o Mandatario)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre Completo o Razón Social *
            </label>
            <input
              type="text"
              value={solicitud.responsableSolicitud.nombre}
              onChange={(e) => updateResponsable('nombre', e.target.value)}
              placeholder="Ej. Abg. Felipe Sarmiento"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cédula / NIT *
            </label>
            <input
              type="text"
              value={solicitud.responsableSolicitud.cedula}
              onChange={(e) => updateResponsable('cedula', e.target.value)}
              placeholder="Ej. 80.741.902"
              className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Teléfono de Contacto *
            </label>
            <input
              type="text"
              value={solicitud.responsableSolicitud.telefono}
              onChange={(e) => updateResponsable('telefono', e.target.value)}
              placeholder="Ej. 3109845566"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dirección de Correspondencia Física *
            </label>
            <input
              type="text"
              value={solicitud.responsableSolicitud.direccionCorrespondencia}
              onChange={(e) => updateResponsable('direccionCorrespondencia', e.target.value)}
              placeholder="Ej. Carrera 7 # 71 - 21 Torre B Piso 9"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Correo Electrónico para Notificaciones *
            </label>
            <input
              type="email"
              value={solicitud.responsableSolicitud.correoElectronico}
              onChange={(e) => updateResponsable('correoElectronico', e.target.value)}
              placeholder="responsable@ejemplo.com"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="notifResp"
            checked={solicitud.responsableSolicitud.aceptaNotificacionElectronica}
            onChange={(e) => updateResponsable('aceptaNotificacionElectronica', e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
          />
          <label htmlFor="notifResp" className="text-xs text-slate-700 font-medium cursor-pointer">
            El apoderado o responsable acepta la notificación por medios electrónicos de conformidad con la ley.
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          ← Regresar a Predio y Linderos
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          Continuar a Construcción Sostenible →
        </button>
      </div>
    </div>
  );
};
