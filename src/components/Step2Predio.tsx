import React from 'react';
import { FunSolicitudPayload, ClasificacionSuelo, PlanimetriaLote, VecinoColindante } from '../types/fun';
import { MapPin, Plus, Trash2, Compass, Home } from 'lucide-react';

interface Step2Props {
  solicitud: FunSolicitudPayload;
  onChange: (updated: FunSolicitudPayload) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Predio: React.FC<Step2Props> = ({ solicitud, onChange, onNext, onBack }) => {
  const handlePredioChange = (field: keyof FunSolicitudPayload['predio'], value: any) => {
    onChange({
      ...solicitud,
      predio: {
        ...solicitud.predio,
        [field]: value
      }
    });
  };

  const handleLinderoChange = (cardinal: 'norte' | 'sur' | 'oriente' | 'occidente', field: 'longitud' | 'colindaCon', value: any) => {
    onChange({
      ...solicitud,
      linderos: {
        ...solicitud.linderos,
        [cardinal]: {
          ...solicitud.linderos[cardinal],
          [field]: field === 'longitud' ? (parseFloat(value) || 0) : value
        }
      }
    });
  };

  const handleAreaTotalChange = (val: string) => {
    onChange({
      ...solicitud,
      linderos: {
        ...solicitud.linderos,
        areaTotalPredio: parseFloat(val) || 0
      }
    });
  };

  // Vecinos management (max 8)
  const addVecino = () => {
    if (solicitud.vecinosColindantes.length >= 8) return;
    const nextId = solicitud.vecinosColindantes.length + 1;
    onChange({
      ...solicitud,
      vecinosColindantes: [
        ...solicitud.vecinosColindantes,
        { id: nextId, direccionPredio: '', direccionCorrespondencia: '' }
      ]
    });
  };

  const removeVecino = (index: number) => {
    const updated = solicitud.vecinosColindantes.filter((_, idx) => idx !== index);
    // re-index
    const reindexed = updated.map((v, i) => ({ ...v, id: i + 1 }));
    onChange({
      ...solicitud,
      vecinosColindantes: reindexed
    });
  };

  const updateVecino = (index: number, field: 'direccionPredio' | 'direccionCorrespondencia', val: string) => {
    const updated = [...solicitud.vecinosColindantes];
    updated[index] = {
      ...updated[index],
      [field]: val
    };
    onChange({
      ...solicitud,
      vecinosColindantes: updated
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
              Páginas 1 y 2 del FUN
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              2. Información del Predio, 3. Vecinos Colindantes & 4. Linderos
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Registre la información catastral, folio de matrícula inmobiliaria, linderos exactos y hasta 8 vecinos colindantes para citación.
            </p>
          </div>
          <MapPin className="w-10 h-10 text-blue-600 shrink-0 hidden sm:block" />
        </div>
      </div>

      {/* 2. PREDIO */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
          2. Información Jurídica y Catastral del Inmueble
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dirección Actual del Predio *
            </label>
            <input
              type="text"
              value={solicitud.predio.direccionActual}
              onChange={(e) => handlePredioChange('direccionActual', e.target.value)}
              placeholder="Ej. Calle 127 # 19A - 44"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Direcciones Anteriores o Tradicionales
            </label>
            <input
              type="text"
              value={solicitud.predio.direccionesAnteriores || ''}
              onChange={(e) => handlePredioChange('direccionesAnteriores', e.target.value)}
              placeholder="Ej. Calle 127 # 19-38 Lote 4 Manzana B"
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Matrícula Inmobiliaria *
            </label>
            <input
              type="text"
              value={solicitud.predio.matriculaInmobiliaria}
              onChange={(e) => handlePredioChange('matriculaInmobiliaria', e.target.value)}
              placeholder="Ej. 50N-20491823"
              className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Cédula Catastral / Chip *
            </label>
            <input
              type="text"
              value={solicitud.predio.identificacionCatastral}
              onChange={(e) => handlePredioChange('identificacionCatastral', e.target.value)}
              placeholder="Ej. 0083041902001000"
              className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Clasificación de Suelo *
            </label>
            <select
              value={solicitud.predio.clasificacionSuelo}
              onChange={(e) => handlePredioChange('clasificacionSuelo', e.target.value as ClasificacionSuelo)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
            >
              <option value="URBANO">Urbano</option>
              <option value="RURAL">Rural</option>
              <option value="EXPANSION">Expansión Urbana</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Planimetría del Lote *
            </label>
            <select
              value={solicitud.predio.planimetriaLote}
              onChange={(e) => handlePredioChange('planimetriaLote', e.target.value as PlanimetriaLote)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
            >
              <option value="PLANO_LOTEO">Plano de Loteo Oficial</option>
              <option value="PLANO_TOPOGRAFICO">Plano Topográfico</option>
              <option value="OTRO">Otro Documento Gráfico</option>
            </select>
          </div>
        </div>

        {/* Datos adicionales de ubicación */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Barrio</label>
            <input
              type="text"
              value={solicitud.predio.barrio || ''}
              onChange={(e) => handlePredioChange('barrio', e.target.value)}
              placeholder="Ej. Santa Bárbara"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Comuna / Localidad</label>
            <input
              type="text"
              value={solicitud.predio.comuna || ''}
              onChange={(e) => handlePredioChange('comuna', e.target.value)}
              placeholder="Ej. Usaquén"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Estrato (1 a 6)</label>
            <input
              type="number"
              min={1}
              max={6}
              value={solicitud.predio.estrato || ''}
              onChange={(e) => handlePredioChange('estrato', parseInt(e.target.value) || undefined)}
              placeholder="Ej. 4"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Manzana No.</label>
            <input
              type="text"
              value={solicitud.predio.manzanaNo || ''}
              onChange={(e) => handlePredioChange('manzanaNo', e.target.value)}
              placeholder="Ej. 14"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Lote No.</label>
            <input
              type="text"
              value={solicitud.predio.loteNo || ''}
              onChange={(e) => handlePredioChange('loteNo', e.target.value)}
              placeholder="Ej. 08"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Vereda / Sector</label>
            <input
              type="text"
              value={solicitud.predio.vereda || ''}
              onChange={(e) => handlePredioChange('vereda', e.target.value)}
              placeholder="Ej. El Hato"
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 3. VECINOS COLINDANTES */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
            3. Información de Vecinos Colindantes (Máximo 8 Predios)
          </h3>
          <button
            type="button"
            onClick={addVecino}
            disabled={solicitud.vecinosColindantes.length >= 8}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Vecino ({solicitud.vecinosColindantes.length}/8)</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          La citación a vecinos colindantes es obligatoria según el artículo 2.2.6.1.2.2.1 del Decreto 1077 de 2015.
        </p>

        <div className="space-y-3">
          {solicitud.vecinosColindantes.map((vecino, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row items-start md:items-center gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Dirección del Predio Colindante *
                  </label>
                  <input
                    type="text"
                    value={vecino.direccionPredio}
                    onChange={(e) => updateVecino(idx, 'direccionPredio', e.target.value)}
                    placeholder="Ej. Calle 127 # 19A - 32"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Dirección de Correspondencia / Notificación *
                  </label>
                  <input
                    type="text"
                    value={vecino.direccionCorrespondencia}
                    onChange={(e) => updateVecino(idx, 'direccionCorrespondencia', e.target.value)}
                    placeholder="Ej. Calle 127 # 19A - 32 Apto 301"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              {solicitud.vecinosColindantes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVecino(idx)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors self-end md:self-center"
                  title="Eliminar vecino"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. LINDEROS Y ÁREAS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</span>
          4. Linderos, Dimensiones y Área Total del Predio
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Norte */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              LINDERO NORTE
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Longitud (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={solicitud.linderos.norte.longitud || ''}
                  onChange={(e) => handleLinderoChange('norte', 'longitud', e.target.value)}
                  placeholder="32.50"
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-slate-600 mb-1">Colinda Con *</label>
                <input
                  type="text"
                  value={solicitud.linderos.norte.colindaCon}
                  onChange={(e) => handleLinderoChange('norte', 'colindaCon', e.target.value)}
                  placeholder="Ej. Calle 127 en ancho de 25.00m"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Sur */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              LINDERO SUR
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Longitud (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={solicitud.linderos.sur.longitud || ''}
                  onChange={(e) => handleLinderoChange('sur', 'longitud', e.target.value)}
                  placeholder="32.50"
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-slate-600 mb-1">Colinda Con *</label>
                <input
                  type="text"
                  value={solicitud.linderos.sur.colindaCon}
                  onChange={(e) => handleLinderoChange('sur', 'colindaCon', e.target.value)}
                  placeholder="Ej. Predio Calle 127 # 19A - 56"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Oriente */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              LINDERO ORIENTE
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Longitud (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={solicitud.linderos.oriente.longitud || ''}
                  onChange={(e) => handleLinderoChange('oriente', 'longitud', e.target.value)}
                  placeholder="48.20"
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-slate-600 mb-1">Colinda Con *</label>
                <input
                  type="text"
                  value={solicitud.linderos.oriente.colindaCon}
                  onChange={(e) => handleLinderoChange('oriente', 'colindaCon', e.target.value)}
                  placeholder="Ej. Predio Calle 127 # 19A - 32"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Occidente */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              LINDERO OCCIDENTE
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Longitud (m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={solicitud.linderos.occidente.longitud || ''}
                  onChange={(e) => handleLinderoChange('occidente', 'longitud', e.target.value)}
                  placeholder="48.20"
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] text-slate-600 mb-1">Colinda Con *</label>
                <input
                  type="text"
                  value={solicitud.linderos.occidente.colindaCon}
                  onChange={(e) => handleLinderoChange('occidente', 'colindaCon', e.target.value)}
                  placeholder="Ej. Carrera 19B en ancho de 16.00m"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Área Total */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
              Área Total del Predio (m²) *
            </span>
            <span className="text-xs text-blue-700/80">
              Debe coincidir con la cabida superficial estipulada en la escritura pública y folio de matrícula inmobiliaria.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              value={solicitud.linderos.areaTotalPredio || ''}
              onChange={(e) => handleAreaTotalChange(e.target.value)}
              placeholder="1566.50"
              className="w-40 px-3.5 py-2 text-sm font-bold font-mono text-blue-900 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-blue-900">m²</span>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          ← Regresar a Datos Generales
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          Continuar a Titulares y Profesionales →
        </button>
      </div>
    </div>
  );
};
