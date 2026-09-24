import React, { useRef, useState } from 'react';
import { FileText, Download, Upload, Database, Sparkles, ShieldCheck, LogIn, LogOut, User as UserIcon, CloudCheck, Check, Loader2 } from 'lucide-react';
import { FunSolicitudPayload } from '../types/fun';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  solicitud: FunSolicitudPayload;
  saveStatus?: 'saved' | 'saving';
  onCargarEjemplo: () => void;
  onImportarJson: (data: FunSolicitudPayload) => void;
  onOpenSqlModal: () => void;
  onDescargarPdf: () => void;
  isGeneratingPdf: boolean;
  onGuardarCloudSql?: () => void;
  isSavingCloudSql?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  solicitud,
  saveStatus = 'saved',
  onCargarEjemplo,
  onImportarJson,
  onOpenSqlModal,
  onDescargarPdf,
  isGeneratingPdf,
  onGuardarCloudSql,
  isSavingCloudSql = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, signInWithGoogle, logout, loading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

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
      } catch {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLogin = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setAuthError(err?.message || 'Error al autenticarse con Google');
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-b border-blue-900/60 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo and Legal identification */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                  COLOMBIA
                </span>
                <span className="text-xs text-blue-200/80 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Res. 1051 de 2025 • Dec. 1077 de 2015
                </span>
                {/* Indicador de guardado local */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all duration-300 ${
                    saveStatus === 'saving'
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30'
                  }`}
                  title={
                    saveStatus === 'saving'
                      ? 'Guardando borrador en el almacenamiento local...'
                      : 'Borrador guardado automáticamente en el navegador'
                  }
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <Loader2 className="w-3 h-3 text-amber-300 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Guardado</span>
                    </>
                  )}
                </div>
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
            {onGuardarCloudSql && (
              <button
                onClick={onGuardarCloudSql}
                disabled={isSavingCloudSql}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 transition-colors shadow-sm disabled:opacity-50"
                title="Guardar en Google Cloud SQL PostgreSQL"
              >
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isSavingCloudSql ? 'Guardando en BD...' : 'Guardar en Google DB'}</span>
              </button>
            )}

            <button
              onClick={onCargarEjemplo}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 transition-colors shadow-sm"
              title="Cargar datos de ejemplo en Bogotá D.C."
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Ejemplo Completo</span>
              <span className="sm:hidden">Ejemplo</span>
            </button>

            <button
              onClick={handleExportJson}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors"
              title="Exportar archivo JSON de la solicitud"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Exportar JSON</span>
              <span className="sm:hidden">JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors"
              title="Importar archivo JSON previo"
            >
              <Upload className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Importar</span>
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-900/40 hover:bg-indigo-900/60 text-indigo-200 border border-indigo-500/40 transition-colors"
              title="Ver esquema y DDL de Google Cloud SQL (PostgreSQL Free Tier)"
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Google DB (SQL)</span>
            </button>

            {/* Google Authentication */}
            {!loading && (
              <div className="flex items-center pl-1 border-l border-slate-700/60">
                {user ? (
                  <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Usuario'}
                        className="w-5 h-5 rounded-full ring-1 ring-emerald-400"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs text-slate-200 max-w-[100px] truncate hidden md:inline">
                      {user.displayName || user.email}
                    </span>
                    <button
                      type="button"
                      onClick={logout}
                      title="Cerrar sesión"
                      className="text-slate-400 hover:text-rose-300 p-0.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 transition-colors"
                    title="Iniciar sesión con Google para vincular tus radicaciones"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-400" />
                    <span>Acceder</span>
                  </button>
                )}
              </div>
            )}

            <button
              onClick={onDescargarPdf}
              disabled={isGeneratingPdf}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}</span>
            </button>
          </div>
        </div>
        {authError && (
          <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded">
            {authError}
          </div>
        )}
      </div>
    </header>
  );
};
