import React, { useState } from 'react';
import { X, Copy, Check, Database, Terminal, Shield } from 'lucide-react';
import { SUPABASE_MIGRATION_SQL } from '../utils/supabaseSql';

interface SqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlModal: React.FC<SqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_MIGRATION_SQL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Migración SQL Normalizada para Supabase
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PostgreSQL
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Esquema relacional de 7 tablas con llaves foráneas, enums, RLS e índices para el FUN (Res. 1051/2025).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar SQL'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info pills */}
        <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400">
            <Shield className="w-3.5 h-3.5" /> Row Level Security (RLS) incluido
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-blue-400">
            <Terminal className="w-3.5 h-3.5" /> Tablas: fun_solicitudes, fun_predios, fun_vecinos, fun_titulares, fun_profesionales, fun_anexos
          </span>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950/80 font-mono text-xs text-emerald-300 select-all leading-relaxed">
          <pre className="whitespace-pre">{SUPABASE_MIGRATION_SQL}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Pegue este script directamente en el SQL Editor del panel de Supabase.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
