import React, { useState } from 'react';
import { X, Copy, Check, Database, Terminal, Shield, Sparkles } from 'lucide-react';
import { GOOGLE_DB_SQL } from '../utils/googleDbSql.ts';

interface SqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlModal: React.FC<SqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'drizzle'>('sql');

  if (!isOpen) return null;

  const DRIZZLE_CODE = `// src/db/schema.ts - Drizzle ORM para Google Cloud SQL (PostgreSQL Free Tier)
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 1. Usuarios autenticados con Google / Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Solicitudes FUN oficiales (Res. 1051 de 2025)
export const funSolicitudes = pgTable('fun_solicitudes', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  userUid: text('user_uid'),
  radicacionNo: text('radicacion_no'),
  autoridad: text('autoridad'),
  departamento: text('departamento'),
  municipio: text('municipio'),
  fecha: text('fecha'),
  tipoTramite: text('tipo_tramite'),
  objetoTramite: text('objeto_tramite'),
  direccionPredio: text('direccion_predio'),
  matriculaInmobiliaria: text('matricula_inmobiliaria'),
  identificacionCatastral: text('identificacion_catastral'),
  clasificacionSuelo: text('clasificacion_suelo'),
  estado: text('estado').default('RADICADA').notNull(),
  datos: jsonb('datos').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  solicitudes: many(funSolicitudes),
}));

export const funSolicitudesRelations = relations(funSolicitudes, ({ one }) => ({
  user: one(users, {
    fields: [funSolicitudes.userId],
    references: [users.id],
  }),
}));`;

  const currentContent = activeTab === 'sql' ? GOOGLE_DB_SQL : DRIZZLE_CODE;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
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
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Google Cloud SQL (PostgreSQL Free Tier)
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Developer Edition
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Instancia relacional Cloud SQL con auto-scaling, Drizzle ORM y autenticación federada con Google.
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
              <span>{copied ? '¡Copiado!' : 'Copiar Código'}</span>
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

        {/* Tab switcher */}
        <div className="px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'sql'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              PostgreSQL DDL
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('drizzle')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'drizzle'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Drizzle ORM Schema
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <Shield className="w-3.5 h-3.5" /> Firebase Auth Integration
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" /> Google Cloud SQL Proxy
            </span>
          </div>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950/80 font-mono text-xs text-blue-200 select-all leading-relaxed">
          <pre className="whitespace-pre">{currentContent}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>La base de datos Google Cloud SQL ya se encuentra activa y aprovisionada.</span>
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
