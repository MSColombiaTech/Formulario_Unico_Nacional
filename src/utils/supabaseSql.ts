export const SUPABASE_MIGRATION_SQL = `-- ==============================================================================
-- MIGRACIÓN DDL PARA SUPABASE / POSTGRESQL: FORMULARIO ÚNICO NACIONAL (FUN)
-- Normativa: Decreto 1077 de 2015 y Resolución 1051 de 2025 (MinVivienda Colombia)
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Enumeraciones de dominio (tipos estrictos según Res. 1051/2025)
DO $$ BEGIN
  CREATE TYPE tramite_tipo_enum AS ENUM (
    'URBANIZACION', 'PARCELACION', 'SUBDIVISION', 'CONSTRUCCION', 'ESPACIO_PUBLICO', 'RECONOCIMIENTO', 'OTRAS'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE objeto_tramite_enum AS ENUM (
    'INICIAL', 'MODIFICACION', 'REVALIDACION', 'OTRAS'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE clasificacion_suelo_enum AS ENUM (
    'URBANO', 'RURAL', 'EXPANSION'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE planimetria_lote_enum AS ENUM (
    'PLANO_LOTEO', 'PLANO_TOPOGRAFICO', 'OTRO'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE area_unidades_enum AS ENUM (
    'MENOR_2000', 'MAYOR_IGUAL_2000', 'SUPERA_POR_AMPLIACION_2000', 'CINCO_O_MAS_VIVIENDA'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Tabla Principal: Solicitud FUN
CREATE TABLE IF NOT EXISTS fun_solicitudes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  radicacion_no VARCHAR(50),
  autoridad VARCHAR(150) NOT NULL DEFAULT 'Curaduría Urbana',
  departamento VARCHAR(80) NOT NULL,
  municipio VARCHAR(80) NOT NULL,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Identificación de la solicitud
  tipo_tramite tramite_tipo_enum NOT NULL,
  objeto_tramite objeto_tramite_enum NOT NULL,
  objeto_tramite_cual TEXT,
  modalidad_urbanizacion VARCHAR(50),
  modalidad_subdivision VARCHAR(50),
  modalidades_construccion TEXT[] DEFAULT '{}',
  usos TEXT[] DEFAULT '{}',
  usos_otro_cual TEXT,
  area_unidades_construidas area_unidades_enum NOT NULL DEFAULT 'MENOR_2000',
  tipo_vivienda VARCHAR(20),
  bien_interes_cultural BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Aceptación de notificaciones
  titulares_aceptan_notificacion_electronica BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Metadatos y auditoría
  estado VARCHAR(30) NOT NULL DEFAULT 'BORRADOR', -- BORRADOR, RADICADO, SUBSANACION, APROBADO, NEGADO
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabla: Información del Predio y Linderos
CREATE TABLE IF NOT EXISTS fun_predios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID NOT NULL REFERENCES fun_solicitudes(id) ON DELETE CASCADE,
  direccion_actual VARCHAR(255) NOT NULL,
  direcciones_anteriores TEXT,
  matricula_inmobiliaria VARCHAR(60) NOT NULL,
  identificacion_catastral VARCHAR(60) NOT NULL,
  clasificacion_suelo clasificacion_suelo_enum NOT NULL DEFAULT 'URBANO',
  planimetria_lote planimetria_lote_enum NOT NULL DEFAULT 'PLANO_LOTEO',
  planimetria_otro_cual TEXT,
  barrio VARCHAR(100),
  comuna VARCHAR(100),
  estrato SMALLINT CHECK (estrato BETWEEN 1 AND 6),
  manzana_no VARCHAR(20),
  lote_no VARCHAR(20),
  vereda VARCHAR(100),
  sector VARCHAR(100),
  corregimiento VARCHAR(100),
  
  -- Linderos y dimensiones
  lindero_norte_longitud NUMERIC(10, 2),
  lindero_norte_colinda TEXT,
  lindero_sur_longitud NUMERIC(10, 2),
  lindero_sur_colinda TEXT,
  lindero_oriente_longitud NUMERIC(10, 2),
  lindero_oriente_colinda TEXT,
  lindero_occidente_longitud NUMERIC(10, 2),
  lindero_occidente_colinda TEXT,
  area_total_predio NUMERIC(12, 2) NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabla: Vecinos Colindantes (hasta 8 oficiales)
CREATE TABLE IF NOT EXISTS fun_vecinos_colindantes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID NOT NULL REFERENCES fun_solicitudes(id) ON DELETE CASCADE,
  orden SMALLINT NOT NULL CHECK (orden BETWEEN 1 AND 8),
  direccion_predio VARCHAR(255) NOT NULL,
  direccion_correspondencia VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_solicitud_vecino_orden UNIQUE (solicitud_id, orden)
);

-- 6. Tabla: Titulares del Predio (hasta 4 oficiales)
CREATE TABLE IF NOT EXISTS fun_titulares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID NOT NULL REFERENCES fun_solicitudes(id) ON DELETE CASCADE,
  orden SMALLINT NOT NULL CHECK (orden BETWEEN 1 AND 4),
  nombre VARCHAR(200) NOT NULL,
  cc_nit VARCHAR(40) NOT NULL,
  telefono VARCHAR(40) NOT NULL,
  correo_electronico VARCHAR(150) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tabla: Profesionales Responsables
CREATE TABLE IF NOT EXISTS fun_profesionales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID NOT NULL REFERENCES fun_solicitudes(id) ON DELETE CASCADE,
  rol_clave VARCHAR(50) NOT NULL, -- urbanizador, arquitectoProyectista, disenadorEstructural, etc.
  nombre VARCHAR(200) NOT NULL,
  cedula VARCHAR(30) NOT NULL,
  matricula_profesional VARCHAR(60) NOT NULL,
  fecha_expedicion_matricula DATE,
  correo_electronico VARCHAR(150) NOT NULL,
  telefono VARCHAR(40) NOT NULL,
  exige_supervision_tecnica BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_solicitud_profesional_rol UNIQUE (solicitud_id, rol_clave)
);

-- 8. Tabla: Responsable de la Solicitud / Apoderado
CREATE TABLE IF NOT EXISTS fun_responsables_solicitud (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID NOT NULL REFERENCES fun_solicitudes(id) ON DELETE CASCADE,
  nombre VARCHAR(200) NOT NULL,
  cedula VARCHAR(30) NOT NULL,
  telefono VARCHAR(40) NOT NULL,
  direccion_correspondencia VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(150) NOT NULL,
  acepta_notificacion_electronica BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_solicitud_responsable UNIQUE (solicitud_id)
);

-- 9. Tabla: Anexo Construcción Sostenible (Resolución 0549 de 2015 / Res. 1051 de 2025)
CREATE TABLE IF NOT EXISTS fun_anexos_sostenibles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID NOT NULL REFERENCES fun_solicitudes(id) ON DELETE CASCADE,
  zonificacion_climatica VARCHAR(40) NOT NULL,
  medidas_pasivas JSONB NOT NULL DEFAULT '{}'::jsonb,
  medidas_activas JSONB NOT NULL DEFAULT '{}'::jsonb,
  porcentaje_ahorro_agua NUMERIC(5, 2) DEFAULT 0,
  porcentaje_ahorro_energia NUMERIC(5, 2) DEFAULT 0,
  descripcion_adicional TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_solicitud_anexo UNIQUE (solicitud_id)
);

-- 10. Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_fun_solicitudes_radicacion ON fun_solicitudes(radicacion_no);
CREATE INDEX IF NOT EXISTS idx_fun_predios_solicitud ON fun_predios(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_fun_predios_matricula ON fun_predios(matricula_inmobiliaria);
CREATE INDEX IF NOT EXISTS idx_fun_titulares_solicitud ON fun_titulares(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_fun_profesionales_solicitud ON fun_profesionales(solicitud_id);

-- 11. Políticas de Seguridad RLS (Row Level Security)
ALTER TABLE fun_solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_predios ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_vecinos_colindantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_titulares ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_profesionales ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_responsables_solicitud ENABLE ROW LEVEL SECURITY;
ALTER TABLE fun_anexos_sostenibles ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública/autenticada y escritura
CREATE POLICY "Permitir lectura completa de solicitudes FUN" ON fun_solicitudes FOR SELECT USING (true);
CREATE POLICY "Permitir insercion y actualizacion con service_role o autenticado" ON fun_solicitudes FOR ALL USING (true);
CREATE POLICY "Permitir predios relacionados" ON fun_predios FOR ALL USING (true);
CREATE POLICY "Permitir vecinos relacionados" ON fun_vecinos_colindantes FOR ALL USING (true);
CREATE POLICY "Permitir titulares relacionados" ON fun_titulares FOR ALL USING (true);
CREATE POLICY "Permitir profesionales relacionados" ON fun_profesionales FOR ALL USING (true);
CREATE POLICY "Permitir responsables relacionados" ON fun_responsables_solicitud FOR ALL USING (true);
CREATE POLICY "Permitir anexo sostenible relacionado" ON fun_anexos_sostenibles FOR ALL USING (true);
`;
