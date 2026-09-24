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
  zonaClimaticaDistinta?: {
    esDistinta: boolean;
    cual?: string;
  };
  medidasPasivas: {
    ventilacionNatural: boolean;
    iluminacionNatural: boolean;
    orientacionSolar: boolean;
    alerosYSombrillas: boolean;
    aislamientoTermico: boolean;
    masaTermica: boolean;
    cubiertaVerde?: boolean;
    elementosProteccionSolar?: boolean;
    vidriosProteccionSolar?: boolean;
    cubiertaProteccionSolar?: boolean;
    paredProteccionSolar?: boolean;
    otro?: boolean;
    otroCual?: string;
  };
  medidasActivas: {
    iluminacionLedEficiente: boolean;
    sensoresPresencia: boolean;
    equiposClimatizacionInverter: boolean;
    energiaSolarFotovoltaica: boolean;
    colectoresSolaresTermicos: boolean;
    griferiasAhorroAgua: boolean;
    reusoAguaLluvia: boolean;
    iluminacionEficiente?: boolean;
    equiposAireEficientes?: boolean;
    aguaCalienteSolar?: boolean;
    controlesIluminacion?: boolean;
    variadoresVelocidadBombas?: boolean;
    otro?: boolean;
    otroCual?: string;
  };
  medidasAhorroAgua?: {
    sanitariosBajoConsumo?: boolean;
    lavamanosBajoConsumo?: boolean;
    duchasBajoConsumo?: boolean;
    orinalesBajoConsumo?: boolean;
    recoleccionAguaLluvia?: boolean;
    otro?: boolean;
    otroCual?: string;
  };
  materialidadMuroExterno?: 'ladrillo_portante' | 'ladrillo_comun' | 'concreto_vaciado' | 'superboard' | 'muro_cortina_aluminio' | 'otro';
  materialidadMuroExternoCual?: string;
  materialidadMuroInterno?: 'ladrillo_numero_4' | 'drywall' | 'ladrillo_comun' | 'concreto_vaciado' | 'bloque_concreto' | 'otro';
  materialidadMuroInternoCual?: string;
  materialidadCubierta?: 'concreto_vaciado' | 'panel_sandwich' | 'tejas_arcilla' | 'metalica' | 'fibrocemento' | 'otro';
  materialidadCubiertaCual?: string;
  relacionMuroVentana?: {
    norte?: number;
    sur?: number;
    oriente?: number;
    occidente?: number;
    alturaPisoTecho?: number;
  };
  porcentajeAhorroAguaEsperado: number;
  porcentajeAhorroEnergiaEsperado: number;
  areaNetaUrbanismoPaisajismo?: number;
  areaNetaZonasComunes?: number;
  areaNetaParqueaderos?: number;
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
  { key: 'urbanizador', label: 'URBANIZADOR / PARCELADOR', desc: 'Sin requisitos de experiencia mínima', obligatorio: false },
  { key: 'directorConstruccion', label: 'DIRECTOR DE LA CONSTRUCCIÓN', desc: 'Experiencia mínima 3 años o posgrado', obligatorio: true },
  { key: 'arquitectoProyectista', label: 'ARQUITECTO PROYECTISTA', desc: 'Sin requisitos de experiencia mínima', obligatorio: true },
  { key: 'disenadorEstructural', label: 'INGENIERO CIVIL DISEÑADOR ESTRUCTURAL', desc: 'Experiencia mínima 5 años o posgrado', obligatorio: true, exigeSupervisionPosible: true },
  { key: 'disenadorElementosNoEstructurales', label: 'DISEÑADOR DE ELEMENTOS NO ESTRUCTURALES', desc: 'Experiencia mínima 3 años o posgrado', obligatorio: false },
  { key: 'ingenieroGeotecnista', label: 'INGENIERO CIVIL GEOTECNISTA', desc: 'Experiencia mínima 5 años o posgrado', obligatorio: true, exigeSupervisionPosible: true },
  { key: 'topografo', label: 'INGENIERO TOPÓGRAFO Y/O TOPÓGRAFO', desc: 'Profesional en topografía o ingeniería catastral', obligatorio: false },
  { key: 'revisorEstructuralIndependiente', label: 'REVISOR INDEPENDIENTE DE LOS DISEÑOS ESTRUCTURALES', desc: 'Experiencia mínima 5 años o posgrado', obligatorio: false },
  { key: 'otrosEspecialistas1', label: 'OTROS PROFESIONALES ESPECIALISTAS (1)', desc: 'Hidrosanitario, eléctrico, gas, etc.', obligatorio: false },
  { key: 'otrosEspecialistas2', label: 'OTROS PROFESIONALES ESPECIALISTAS (2)', desc: 'Acústica, bioclimática, redes, etc.', obligatorio: false }
];
