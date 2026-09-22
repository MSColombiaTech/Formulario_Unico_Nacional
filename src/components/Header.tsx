import React, { useRef } from 'react';
import { FileText, Download, Upload, Database, Sparkles, ShieldCheck } from 'lucide-react';
import { FunSolicitudPayload } from '../types/fun';
import { EJEMPLO_FUN_BOGOTA } from '../utils/colombiaData';

interface HeaderProps {
  solicitud: FunSolicitudPayload;
  onCargarEjemplo: () => void;
  onImportarJson: (data: FunSolicitudPayload) => void;
  onOpenSqlModal: () => void;
  onDescargarPdf: () => void;
  isGeneratingPdf: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  solicitud,
  onCargarEjemplo,
  onImportarJson,
  onOpenSqlModal,
  onDescargarPdf,
  isGeneratingPdf
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(solicitud, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FUN_${solicitud.general.municipio.replace(/\s+/g, '_')}_${solicitud.predio.matriculaInmobiliaria || 'solicitud'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.general && parsed.identificacion && parsed.predio) {
          onImportarJson(parsed);
        } else {
          alert('El archivo no tiene el formato válido de una solicitud FUN.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-b border-blue-900/60 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo and Legal identification */}
          <div className="flex items-center space-x-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                  COLOMBIA
                </span>
                <span className="text-xs text-blue-200/80 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Res. 1051 de 2025 • Dec. 1077 de 2015
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Formulario Único Nacional (FUN)
                <span className="hidden sm:inline-block text-xs font-normal text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                  Licencias Urbanísticas
                </span>
              </h1>
            </div>
          </div>

          {/* Actions toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onCargarEjemplo}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-colors shadow-sm"
              title="Cargar datos de ejemplo en Bogotá D.C."
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ejemplo Completo</span>
            </button>

            <button
              onClick={handleExportJson}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors"
              title="Exportar archivo JSON de la solicitud"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Exportar JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors"
              title="Importar archivo JSON previo"
            >
              <Upload className="w-3.5 h-3.5 text-slate-300" />
              <span>Importar JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={onOpenSqlModal}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 transition-colors"
              title="Ver esquema DDL de Supabase"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>SQL Supabase</span>
            </button>

            <button
              onClick={onDescargarPdf}
              disabled={isGeneratingPdf}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generando...' : 'Descargar PDF Oficial'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
