import { z } from 'zod';

export const tramiteTipoSchema = z.enum([
  'URBANIZACION',
  'PARCELACION',
  'SUBDIVISION',
  'CONSTRUCCION',
  'ESPACIO_PUBLICO',
  'RECONOCIMIENTO',
  'OTRAS'
]);

export const objetoTramiteSchema = z.enum([
  'INICIAL',
  'MODIFICACION',
  'REVALIDACION',
  'OTRAS'
]);

export const areaUnidadesSchema = z.enum([
  'MENOR_2000',
  'MAYOR_IGUAL_2000',
  'SUPERA_POR_AMPLIACION_2000',
  'CINCO_O_MAS_VIVIENDA'
]);

export const funSolicitudSchema = z.object({
  general: z.object({
    autoridad: z.string().min(2, 'La autoridad o curaduría es requerida'),
    radicacionNo: z.string().optional(),
    departamento: z.string().min(2, 'El departamento es requerido'),
    municipio: z.string().min(2, 'El municipio es requerido'),
    fecha: z.string().min(4, 'La fecha es requerida')
  }),
  identificacion: z.object({
    tipoTramite: tramiteTipoSchema,
    objetoTramite: objetoTramiteSchema,
    objetoTramiteCual: z.string().optional(),
    modalidadUrbanizacion: z.enum(['DESARROLLO', 'SANEAMIENTO', 'REURBANIZACION']).optional(),
    modalidadSubdivision: z.enum(['RURAL', 'URBANA', 'RELOTEO']).optional(),
    modalidadesConstruccion: z.array(z.string()),
    usos: z.array(z.string()).min(1, 'Debe seleccionar al menos un uso predominante'),
    usosOtroCual: z.string().optional(),
    areaUnidadesConstruidas: areaUnidadesSchema,
    tipoVivienda: z.enum(['VIP', 'VIS', 'NO_VIS']).optional(),
    bienInteresCultural: z.boolean()
  }),
  predio: z.object({
    direccionActual: z.string().min(3, 'La dirección actual es requerida'),
    direccionesAnteriores: z.string().optional(),
    matriculaInmobiliaria: z.string().min(3, 'La matrícula inmobiliaria es requerida'),
    identificacionCatastral: z.string().min(3, 'La cédula catastral es requerida'),
    clasificacionSuelo: z.enum(['URBANO', 'RURAL', 'EXPANSION']),
    planimetriaLote: z.enum(['PLANO_LOTEO', 'PLANO_TOPOGRAFICO', 'OTRO']),
    planimetriaOtroCual: z.string().optional(),
    barrio: z.string().optional(),
    comuna: z.string().optional(),
    estrato: z.number().optional(),
    manzanaNo: z.string().optional(),
    loteNo: z.string().optional(),
    vereda: z.string().optional(),
    sector: z.string().optional(),
    corregimiento: z.string().optional()
  }),
  vecinosColindantes: z.array(
    z.object({
      id: z.number(),
      direccionPredio: z.string(),
      direccionCorrespondencia: z.string()
    })
  ),
  linderos: z.object({
    norte: z.object({ longitud: z.number(), colindaCon: z.string() }),
    sur: z.object({ longitud: z.number(), colindaCon: z.string() }),
    oriente: z.object({ longitud: z.number(), colindaCon: z.string() }),
    occidente: z.object({ longitud: z.number(), colindaCon: z.string() }),
    areaTotalPredio: z.number().min(0, 'El área debe ser un valor numérico válido')
  }),
  titulares: z.array(
    z.object({
      nombre: z.string().min(2, 'El nombre del titular es requerido'),
      ccNit: z.string().min(2, 'El documento CC/NIT es requerido'),
      telefono: z.string().min(5, 'El teléfono es requerido'),
      correoElectronico: z.string().email('Debe ser un correo electrónico válido')
    })
  ).min(1, 'Debe haber al menos un titular registrado'),
  titularesAceptanNotificacionElectronica: z.boolean(),
  profesionales: z.record(
    z.object({
      nombre: z.string(),
      cedula: z.string(),
      matriculaProfesional: z.string(),
      fechaExpedicionMatricula: z.string(),
      correoElectronico: z.string(),
      telefono: z.string(),
      exigeSupervisionTecnica: z.boolean().optional()
    })
  ),
  responsableSolicitud: z.object({
    nombre: z.string().min(2, 'El nombre del responsable es requerido'),
    cedula: z.string().min(3, 'La cédula es requerida'),
    telefono: z.string().min(5, 'El teléfono es requerido'),
    direccionCorrespondencia: z.string().min(3, 'La dirección es requerida'),
    correoElectronico: z.string().email('Debe ser un correo válido'),
    aceptaNotificacionElectronica: z.boolean()
  }),
  anexoConstruccionSostenible: z.object({
    zonificacionClimatica: z.enum(['CALIDO_SECO', 'CALIDO_HUMEDO', 'TEMPLADO', 'FRIO']),
    medidasPasivas: z.record(z.boolean()),
    medidasActivas: z.record(z.boolean()),
    porcentajeAhorroAguaEsperado: z.number().min(0).max(100),
    porcentajeAhorroEnergiaEsperado: z.number().min(0).max(100),
    descripcionMedidasAdicionales: z.string().optional()
  })
});
