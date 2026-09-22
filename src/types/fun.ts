export type TramiteTipo =
  | 'URBANIZACION'
  | 'PARCELACION'
  | 'SUBDIVISION'
  | 'CONSTRUCCION'
  | 'ESPACIO_PUBLICO'
  | 'RECONOCIMIENTO'
  | 'OTRAS';

export type ObjetoTramite =
  | 'INICIAL'
  | 'MODIFICACION'
  | 'REVALIDACION'
  | 'OTRAS';

export type ModalidadUrbanizacion =
  | 'DESARROLLO'
  | 'SANEAMIENTO'
  | 'REURBANIZACION';

export type ModalidadSubdivision =
  | 'RURAL'
  | 'URBANA'
  | 'RELOTEO';

export type ModalidadConstruccion =
  | 'OBRA_NUEVA'
  | 'AMPLIACION'
  | 'ADECUACION'
  | 'MODIFICACION'
  | 'RESTAURACION'
  | 'REFORZAMIENTO_ESTRUCTURAL'
  | 'DEMOLICION_TOTAL'
  | 'DEMOLICION_PARCIAL'
  | 'RECONSTRUCCION'
  | 'CERRAMIENTO';

export type UsoTipo =
  | 'VIVIENDA'
  | 'COMERCIO_SERVICIOS'
  | 'DOTACIONAL'
  | 'INDUSTRIAL'
  | 'OTRO';

export type AreaUnidadesConstruidas =
  | 'MENOR_2000'
  | 'MAYOR_IGUAL_2000'
  | 'SUPERA_POR_AMPLIACION_2000'
  | 'CINCO_O_MAS_VIVIENDA';

export type TipoVivienda = 'VIP' | 'VIS' | 'NO_VIS';

export type ClasificacionSuelo = 'URBANO' | 'RURAL' | 'EXPANSION';

export type PlanimetriaLote = 'PLANO_LOTEO' | 'PLANO_TOPOGRAFICO' | 'OTRO';

export interface LinderoDetalle {
  longitud: number;
  colindaCon: string;
}

export interface VecinoColindante {
  id: number;
  direccionPredio: string;
  direccionCorrespondencia: string;
}

export interface Titular {
  nombre: string;
  ccNit: string;
  telefono: string;
  correoElectronico: string;
}

export interface ProfesionalInfo {
  nombre: string;
  cedula: string;
  matriculaProfesional: string;
  fechaExpedicionMatricula: string;
  correoElectronico: string;
  telefono: string;
  exigeSupervisionTecnica?: boolean;
}

export interface AnexoConstruccionSostenible {
  zonificacionClimatica: 'CALIDO_SECO' | 'CALIDO_HUMEDO' | 'TEMPLADO' | 'FRIO';
  medidasPasivas: {
    ventilacionNatural: boolean;
    iluminacionNatural: boolean;
    orientacionSolar: boolean;
    alerosYSombrillas: boolean;
    aislamientoTermico: boolean;
    masaTermica: boolean;
  };
  medidasActivas: {
    iluminacionLedEficiente: boolean;
    sensoresPresencia: boolean;
    equiposClimatizacionInverter: boolean;
    energiaSolarFotovoltaica: boolean;
    colectoresSolaresTermicos: boolean;
    griferiasAhorroAgua: boolean;
    reusoAguaLluvia: boolean;
  };
  porcentajeAhorroAguaEsperado: number;
  porcentajeAhorroEnergiaEsperado: number;
  descripcionMedidasAdicionales?: string;
}

export interface FunSolicitudPayload {
  general: {
    autoridad: string;
    radicacionNo?: string;
    departamento: string;
    municipio: string;
    fecha: string;
  };
  identificacion: {
    tipoTramite: TramiteTipo;
    objetoTramite: ObjetoTramite;
    objetoTramiteCual?: string;
    modalidadUrbanizacion?: ModalidadUrbanizacion;
    modalidadSubdivision?: ModalidadSubdivision;
    modalidadesConstruccion: ModalidadConstruccion[];
    usos: UsoTipo[];
    usosOtroCual?: string;
    areaUnidadesConstruidas: AreaUnidadesConstruidas;
    tipoVivienda?: TipoVivienda;
    bienInteresCultural: boolean;
  };
  predio: {
    direccionActual: string;
    direccionesAnteriores?: string;
    matriculaInmobiliaria: string;
    identificacionCatastral: string;
    clasificacionSuelo: ClasificacionSuelo;
    planimetriaLote: PlanimetriaLote;
    planimetriaOtroCual?: string;
    barrio?: string;
    comuna?: string;
    estrato?: number;
    manzanaNo?: string;
    loteNo?: string;
    vereda?: string;
    sector?: string;
    corregimiento?: string;
  };
  vecinosColindantes: VecinoColindante[];
  linderos: {
    norte: LinderoDetalle;
    sur: LinderoDetalle;
    oriente: LinderoDetalle;
    occidente: LinderoDetalle;
    areaTotalPredio: number;
  };
  titulares: Titular[];
  titularesAceptanNotificacionElectronica: boolean;
  profesionales: Record<string, ProfesionalInfo>;
  responsableSolicitud: {
    nombre: string;
    cedula: string;
    telefono: string;
    direccionCorrespondencia: string;
    correoElectronico: string;
    aceptaNotificacionElectronica: boolean;
  };
  anexoConstruccionSostenible: AnexoConstruccionSostenible;
}

export const ROLES_PROFESIONALES: Array<{ key: string; label: string; desc: string; obligatorio: boolean; exigeSupervisionPosible?: boolean }> = [
  { key: 'urbanizador', label: 'Urbanizador o Constructor Responsable', desc: 'Ingeniero Civil o Arquitecto', obligatorio: true },
  { key: 'directorConstruccion', label: 'Director de la Construcción', desc: 'Ingeniero Civil o Arquitecto con experiencia mínima de 3 años', obligatorio: true },
  { key: 'arquitectoProyectista', label: 'Arquitecto Proyectista', desc: 'Diseñador Arquitectónico del proyecto', obligatorio: true },
  { key: 'disenadorEstructural', label: 'Diseñador Estructural', desc: 'Ingeniero Civil matriculado con experiencia acreditada', obligatorio: true },
  { key: 'disenadorElementosNoEstructurales', label: 'Diseñador Elementos No Estructurales', desc: 'Ingeniero o Arquitecto', obligatorio: false },
  { key: 'ingenieroGeotecnista', label: 'Ingeniero Geotecnista', desc: 'Estudio de suelos y geotecnia', obligatorio: true },
  { key: 'revisorEstructuralIndependiente', label: 'Revisor Independiente de Diseños Estructurales', desc: 'Obligatorio según Ley 1796 de 2016 (Vivienda Segura) si supera 2000m²', obligatorio: false },
  { key: 'supervisorTecnicoIndependiente', label: 'Supervisor Técnico Independiente', desc: 'Supervisión técnica continua en obra (Ley 1796)', obligatorio: false, exigeSupervisionPosible: true }
];
