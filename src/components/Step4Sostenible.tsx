import React from 'react';
import { FunSolicitudPayload } from '../types/fun';
import { Leaf, Sun, Wind, Droplets, Zap, ShieldCheck } from 'lucide-react';

interface Step4Props {
  solicitud: FunSolicitudPayload;
  onChange: (updated: FunSolicitudPayload) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Sostenible: React.FC<Step4Props> = ({ solicitud, onChange, onNext, onBack }) => {
  const anexo = solicitud.anexoConstruccionSostenible || {
    zonificacionClimatica: 'TEMPLADO',
    medidasPasivas: {
      ventilacionNatural: true,
      iluminacionNatural: true,
      orientacionSolar: true,
      alerosYSombrillas: false,
      aislamientoTermico: false,
      masaTermica: false
    },
    medidasActivas: {
      iluminacionLedEficiente: true,
      sensoresPresencia: true,
      equiposClimatizacionInverter: false,
      energiaSolarFotovoltaica: false,
      colectoresSolaresTermicos: false,
      griferiasAhorroAgua: true,
      reusoAguaLluvia: false
    },
    porcentajeAhorroAguaEsperado: 25,
    porcentajeAhorroEnergiaEsperado: 25,
    descripcionMedidasAdicionales: ''
  };

  const updateZonificacion = (zona: 'CALIDO_SECO' | 'CALIDO_HUMEDO' | 'TEMPLADO' | 'FRIO') => {
    onChange({
      ...solicitud,
      anexoConstruccionSostenible: {
        ...anexo,
        zonificacionClimatica: zona
      }
    });
  };

  const toggleMedidaPasiva = (key: keyof typeof anexo.medidasPasivas) => {
    onChange({
      ...solicitud,
      anexoConstruccionSostenible: {
        ...anexo,
        medidasPasivas: {
          ...anexo.medidasPasivas,
          [key]: !anexo.medidasPasivas[key]
        }
      }
    });
  };

  const toggleMedidaActiva = (key: keyof typeof anexo.medidasActivas) => {
    onChange({
      ...solicitud,
      anexoConstruccionSostenible: {
        ...anexo,
        medidasActivas: {
          ...anexo.medidasActivas,
          [key]: !anexo.medidasActivas[key]
        }
      }
    });
  };

  const updateAhorro = (field: 'porcentajeAhorroAguaEsperado' | 'porcentajeAhorroEnergiaEsperado', val: number) => {
    onChange({
      ...solicitud,
      anexoConstruccionSostenible: {
        ...anexo,
        [field]: val
      }
    });
  };

  const updateDescripcion = (desc: string) => {
    onChange({
      ...solicitud,
      anexoConstruccionSostenible: {
        ...anexo,
        descripcionMedidasAdicionales: desc
      }
    });
  };

  const zonasList: Array<{ key: 'CALIDO_SECO' | 'CALIDO_HUMEDO' | 'TEMPLADO' | 'FRIO'; label: string; temp: string; ejemplos: string }> = [
    { key: 'CALIDO_SECO', label: 'Cálido Seco', temp: '> 24°C, baja humedad', ejemplos: 'Cúcuta, Neiva, Girardot' },
    { key: 'CALIDO_HUMEDO', label: 'Cálido Húmedo', temp: '> 24°C, alta humedad', ejemplos: 'Barranquilla, Cali, Cartagena' },
    { key: 'TEMPLADO', label: 'Templado', temp: '17°C a 24°C', ejemplos: 'Medellín, Bucaramanga, Pereira' },
    { key: 'FRIO', label: 'Frío', temp: '< 17°C', ejemplos: 'Bogotá D.C., Tunja, Pasto' }
  ];

  const medidasPasivasList: Array<{ key: keyof typeof anexo.medidasPasivas; label: string; desc: string }> = [
    { key: 'ventilacionNatural', label: 'Ventilación Natural Cruzada', desc: 'Disposición de aberturas opuestas para flujo de aire continuo' },
    { key: 'iluminacionNatural', label: 'Iluminación Natural Óptima', desc: 'Aprovechamiento de vanos y claraboyas para reducir luminarias diurnas' },
    { key: 'orientacionSolar', label: 'Orientación Solar Favorable', desc: 'Fachadas dispuestas evitando asoleamiento directo crítico norte-sur' },
    { key: 'alerosYSombrillas', label: 'Aleros, Cortasoles y Sombrillas', desc: 'Elementos arquitectónicos protectores de radiación solar directa' },
    { key: 'aislamientoTermico', label: 'Aislamiento Térmico de Envolvente', desc: 'Materiales aislantes en cubiertas y muros de cerramiento' },
    { key: 'masaTermica', label: 'Aprovechamiento de Masa Térmica', desc: 'Inercia de materiales estructurales para estabilizar temperatura' }
  ];

  const medidasActivasList: Array<{ key: keyof typeof anexo.medidasActivas; label: string; desc: string }> = [
    { key: 'iluminacionLedEficiente', label: 'Iluminación LED de Alta Eficiencia', desc: 'Eficacia luminosa superior a 110 lm/W en todas las zonas' },
    { key: 'sensoresPresencia', label: 'Sensores de Presencia y Movimiento', desc: 'Automatización lumínica en pasillos, parqueaderos y zonas comunes' },
    { key: 'equiposClimatizacionInverter', label: 'Climatización Inverter / VRF', desc: 'Sistemas HVAC con SEER superior a los mínimos normativos' },
    { key: 'energiaSolarFotovoltaica', label: 'Energía Solar Fotovoltaica', desc: 'Generación distribuida de energía renovable para áreas comunes' },
    { key: 'colectoresSolaresTermicos', label: 'Colectores Solares Térmicos', desc: 'Precalentamiento de agua sanitaria mediante captadores solares' },
    { key: 'griferiasAhorroAgua', label: 'Griferías y Sanitarios de Bajo Consumo', desc: 'Inodoros de ≤ 4.8 L y lavamanos con aireadores de ≤ 5 L/min' },
    { key: 'reusoAguaLluvia', label: 'Sistema de Captación y Reúso de Agua Lluvia', desc: 'Tanques de almacenamiento y filtración para riego y sanitarios' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800">
              Página 4 del FUN (Anexo Sostenible)
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Anexo de Construcción Sostenible (Resolución 0549 de 2015)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Cumplimiento obligatorio de la Guía de Construcción Sostenible para ahorro porcentual mínimo de agua y energía según zonificación bioclimática.
            </p>
          </div>
          <Leaf className="w-10 h-10 text-emerald-600 shrink-0 hidden sm:block" />
        </div>
      </div>

      {/* Zonificación Climática */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sun className="w-5 h-5 text-amber-500" />
          Zonificación Bioclimática del Municipio
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {zonasList.map((zona) => {
            const isSelected = anexo.zonificacionClimatica === zona.key;
            return (
              <button
                key={zona.key}
                type="button"
                onClick={() => updateZonificacion(zona.key)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                    {zona.label}
                  </span>
                  <input type="radio" checked={isSelected} readOnly className="text-emerald-600" />
                </div>
                <p className="text-xs font-medium text-slate-600 mb-1">{zona.temp}</p>
                <p className="text-[11px] text-slate-500">{zona.ejemplos}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Medidas Pasivas */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Wind className="w-5 h-5 text-teal-600" />
          A. Medidas Pasivas de Eficiencia Energética y Confort Térmico
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {medidasPasivasList.map((m) => {
            const checked = anexo.medidasPasivas[m.key];
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleMedidaPasiva(m.key)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  checked
                    ? 'bg-teal-50/80 border-teal-500 ring-1 ring-teal-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${checked ? 'text-teal-950' : 'text-slate-800'}`}>
                    {m.label}
                  </span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {checked && <span className="text-[10px]">✓</span>}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {m.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Medidas Activas */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Zap className="w-5 h-5 text-amber-500" />
          B. Medidas Activas y Tecnologías de Alta Eficiencia
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {medidasActivasList.map((m) => {
            const checked = anexo.medidasActivas[m.key];
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => toggleMedidaActiva(m.key)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  checked
                    ? 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${checked ? 'text-amber-950' : 'text-slate-800'}`}>
                    {m.label}
                  </span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    checked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {checked && <span className="text-[10px]">✓</span>}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {m.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metas de Ahorro Porcentual (Agua y Energía) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          C. Metas de Porcentaje de Ahorro Estimado (Línea Base Res. 0549)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ahorro Agua */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-600" />
                Ahorro Estimado en Agua Potable
              </span>
              <span className="text-base font-extrabold text-blue-700">
                {anexo.porcentajeAhorroAguaEsperado}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={anexo.porcentajeAhorroAguaEsperado}
              onChange={(e) => updateAhorro('porcentajeAhorroAguaEsperado', parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-blue-800/80">
              <span>Mínimo regulatorio: 20%</span>
              <span className="font-semibold text-emerald-700">
                {anexo.porcentajeAhorroAguaEsperado >= 20 ? '✓ Cumple Norma Res. 0549' : '⚠️ Inferior al 20%'}
              </span>
            </div>
          </div>

          {/* Ahorro Energía */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                Ahorro Estimado en Energía Eléctrica
              </span>
              <span className="text-base font-extrabold text-amber-700">
                {anexo.porcentajeAhorroEnergiaEsperado}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={1}
              value={anexo.porcentajeAhorroEnergiaEsperado}
              onChange={(e) => updateAhorro('porcentajeAhorroEnergiaEsperado', parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-amber-800/80">
              <span>Mínimo regulatorio: 20% a 45%</span>
              <span className="font-semibold text-emerald-700">
                {anexo.porcentajeAhorroEnergiaEsperado >= 20 ? '✓ Cumple Norma Res. 0549' : '⚠️ Inferior al 20%'}
              </span>
            </div>
          </div>
        </div>

        {/* Memoria técnica descriptiva */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            D. Memoria Descriptiva de Soluciones Sostenibles (Resumen para la Autoridad)
          </label>
          <textarea
            rows={3}
            value={anexo.descripcionMedidasAdicionales || ''}
            onChange={(e) => updateDescripcion(e.target.value)}
            placeholder="Describa brevemente los sistemas hidrosanitarios eficientes, paneles solares, cubiertas reflectivas o sistemas de recolección previstos en el diseño..."
            className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-hidden"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          ← Regresar a Titulares y Profesionales
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          Continuar a Revisión y Descarga →
        </button>
      </div>
    </div>
  );
};
