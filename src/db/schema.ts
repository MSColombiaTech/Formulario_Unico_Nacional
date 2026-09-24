import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Tabla de usuarios sincronizados desde Firebase Authentication
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabla principal de solicitudes del Formulario Único Nacional (FUN)
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
}));
