// Esquema oficial normalizado para Google Cloud SQL (PostgreSQL - Developer Edition / Free Tier)
// DDL SQL ejecutado y validado en la base de datos Google Cloud SQL provisionada.

export const GOOGLE_DB_SQL = `-- ==============================================================================
-- GOOGLE CLOUD SQL (POSTGRESQL DEVELOPER EDITION / FREE TIER)
-- FORMULARIO ÚNICO NACIONAL (FUN) - RESOLUCIÓN 1051 DE 2025 (MINVIVIENDA)
-- ==============================================================================

-- 1. Tabla de Usuarios vinculada a Firebase Authentication
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "uid" TEXT NOT NULL UNIQUE,  -- UID de Firebase Auth (Google Sign-In)
  "email" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla Principal de Solicitudes FUN
CREATE TABLE IF NOT EXISTS "fun_solicitudes" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "user_id" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
  "user_uid" TEXT,
  "radicacion_no" TEXT,
  "autoridad" TEXT,
  "departamento" TEXT,
  "municipio" TEXT,
  "fecha" TEXT,
  "tipo_tramite" TEXT,
  "objeto_tramite" TEXT,
  "direccion_predio" TEXT,
  "matricula_inmobiliaria" TEXT,
  "identificacion_catastral" TEXT,
  "clasificacion_suelo" TEXT,
  "estado" TEXT DEFAULT 'RADICADA' NOT NULL,
  "datos" JSONB NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Índices de búsqueda y rendimiento en Cloud SQL
CREATE INDEX IF NOT EXISTS "idx_fun_solicitudes_user_uid" ON "fun_solicitudes"("user_uid");
CREATE INDEX IF NOT EXISTS "idx_fun_solicitudes_matricula" ON "fun_solicitudes"("matricula_inmobiliaria");
CREATE INDEX IF NOT EXISTS "idx_fun_solicitudes_municipio" ON "fun_solicitudes"("municipio");
CREATE INDEX IF NOT EXISTS "idx_fun_solicitudes_radicacion" ON "fun_solicitudes"("radicacion_no");
CREATE INDEX IF NOT EXISTS "idx_fun_solicitudes_created_at" ON "fun_solicitudes"("created_at" DESC);
`;
