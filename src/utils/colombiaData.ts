import { FunSolicitudPayload } from '../types/fun';

export const DEPARTAMENTOS_COLOMBIA: Record<string, string[]> = {
  'Bogotá D.C.': ['Bogotá D.C.'],
  'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Sabaneta', 'Apartadó', 'Turbo'],
  'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Yumbo', 'Cartago', 'Buga', 'Jamundí'],
  'Cundinamarca': ['Soacha', 'Chía', 'Zipaquirá', 'Facatativá', 'Fusagasugá', 'Madrid', 'Mosquera', 'Funza', 'Cajicá', 'Girardot'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Puerto Colombia'],
  'Bolívar': ['Cartagena de Indias', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Villa de Leyva'],
  'Caldas': ['Manizales', 'La Dorada', 'Chinchiná', 'Villamaría', 'Riosucio'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'],
  'Quindío': ['Armenia', 'Calarcá', 'Montenegro', 'Quimbaya', 'La Tebaida'],
  'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Chaparral', 'Mariquita'],
  'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Villa del Rosario', 'Los Patios', 'Pamplona'],
  'Meta': ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'],
  'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres'],
  'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'],
  'Cesar': ['Valledupar', 'Aguachica', 'Agustín Codazzi'],
  'Córdoba': ['Montería', 'Lorica', 'Cereté', 'Sahagún', 'Montelíbano'],
  'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco'],
  'Sucre': ['Sincelejo', 'Corozal', 'San Marcos']
};

export const EJEMPLO_FUN_BOGOTA: FunSolicitudPayload = {
  general: {
    autoridad: 'Curaduría Urbana No. 2 de Bogotá D.C.',
    radicacionNo: '11001-2-26-0418',
    departamento: 'Bogotá D.C.',
    municipio: 'Bogotá D.C.',
    fecha: '2026-04-15'
  },
  identificacion: {
    tipoTramite: 'CONSTRUCCION',
    objetoTramite: 'INICIAL',
    modalidadesConstruccion: ['OBRA_NUEVA'],
    usos: ['VIVIENDA', 'COMERCIO_SERVICIOS'],
    areaUnidadesConstruidas: 'MAYOR_IGUAL_2000',
    tipoVivienda: 'VIS',
    bienInteresCultural: false
  },
  predio: {
    direccionActual: 'Calle 127 # 19A - 44',
    direccionesAnteriores: 'Calle 127 # 19-38 Lote 4',
    matriculaInmobiliaria: '50N-20491823',
    identificacionCatastral: '0083041902001000',
    clasificacionSuelo: 'URBANO',
    planimetriaLote: 'PLANO_LOTEO',
    barrio: 'Santa Bárbara Central',
    comuna: 'Localidad 01 Usaquén',
    estrato: 5,
    manzanaNo: '14',
    loteNo: '08'
  },
  vecinosColindantes: [
    { id: 1, direccionPredio: 'Calle 127 # 19A - 32', direccionCorrespondencia: 'Calle 127 # 19A - 32 Apto 301' },
    { id: 2, direccionPredio: 'Calle 127 # 19A - 56', direccionCorrespondencia: 'Calle 127 # 19A - 56' },
    { id: 3, direccionPredio: 'Carrera 19B # 126B - 15', direccionCorrespondencia: 'Carrera 19B # 126B - 15' },
    { id: 4, direccionPredio: 'Carrera 19B # 126B - 29', direccionCorrespondencia: 'Carrera 19B # 126B - 29' }
  ],
  linderos: {
    norte: { longitud: 32.5, colindaCon: 'Calle 127 en ancho de 25.00m' },
    sur: { longitud: 32.5, colindaCon: 'Predio Calle 127 # 19A - 56' },
    oriente: { longitud: 48.2, colindaCon: 'Predio Calle 127 # 19A - 32' },
    occidente: { longitud: 48.2, colindaCon: 'Carrera 19B en ancho de 16.00m' },
    areaTotalPredio: 1566.5
  },
  titulares: [
    {
      nombre: 'CONSTRUCCIONES Y DESARROLLOS URBANOS S.A.S.',
      ccNit: '901.458.712-4',
      telefono: '3104558899',
      correoElectronico: 'tramites@urbanoscol.com'
    },
    {
      nombre: 'CARLOS ANDRÉS MENDOZA RESTREPO',
      ccNit: '79.845.120',
      telefono: '3152204488',
      correoElectronico: 'carlos.mendoza@inmobiliariamega.co'
    }
  ],
  titularesAceptanNotificacionElectronica: true,
  profesionales: {
    urbanizador: {
      nombre: 'ING. GUSTAVO ROJAS OVALLE',
      cedula: '19.450.321',
      matriculaProfesional: '25202-045811 CND',
      fechaExpedicionMatricula: '2012-08-14',
      correoElectronico: 'gustavo.rojas@urbanoscol.com',
      telefono: '3118995544'
    },
    directorConstruccion: {
      nombre: 'ARQ. VALENTINA DUQUE MORALES',
      cedula: '52.981.402',
      matriculaProfesional: 'A25482015-1084 CPNAA',
      fechaExpedicionMatricula: '2015-03-20',
      correoElectronico: 'arq.duque@constructora.com',
      telefono: '3146603322'
    },
    arquitectoProyectista: {
      nombre: 'ARQ. JULIÁN SILVA PARRA',
      cedula: '80.125.660',
      matriculaProfesional: 'A25482011-0982 CPNAA',
      fechaExpedicionMatricula: '2011-11-10',
      correoElectronico: 'julian.silva@arquitectosvanguardia.com',
      telefono: '3187744112'
    },
    disenadorEstructural: {
      nombre: 'ING. HÉCTOR FABIO GIRALDO',
      cedula: '71.650.980',
      matriculaProfesional: '05202-099411 ANT',
      fechaExpedicionMatricula: '2008-05-18',
      correoElectronico: 'hector.giraldo@estructuralesg.com',
      telefono: '3004512299'
    },
    ingenieroGeotecnista: {
      nombre: 'ING. MARÍA DEL PILAR CÁRDENAS',
      cedula: '53.011.890',
      matriculaProfesional: '25202-184520 CND',
      fechaExpedicionMatricula: '2014-09-05',
      correoElectronico: 'pilar.cardenas@geotecniabogota.com',
      telefono: '3169824411'
    },
    revisorEstructuralIndependiente: {
      nombre: 'ING. ROBERTO SALAMANCA PEÑA',
      cedula: '14.280.999',
      matriculaProfesional: '25202-012948 CND',
      fechaExpedicionMatricula: '2003-02-14',
      correoElectronico: 'roberto@salamanca-consultores.co',
      telefono: '3138801928'
    },
    supervisorTecnicoIndependiente: {
      nombre: 'ING. BEATRIZ HELENA VANEGAS',
      cedula: '41.980.231',
      matriculaProfesional: '63202-088712 QUI',
      fechaExpedicionMatricula: '2010-06-22',
      correoElectronico: 'beatriz.vanegas@supervisiontecnica.co',
      telefono: '3174509122',
      exigeSupervisionTecnica: true
    }
  },
  responsableSolicitud: {
    nombre: 'ABG. FELIPE SARMIENTO OROZCO',
    cedula: '80.741.902',
    telefono: '3109845566',
    direccionCorrespondencia: 'Carrera 7 # 71 - 21 Torre B Piso 9',
    correoElectronico: 'tramites.legales@sarmientoabogados.com',
    aceptaNotificacionElectronica: true
  },
  anexoConstruccionSostenible: {
    zonificacionClimatica: 'FRIO',
    medidasPasivas: {
      ventilacionNatural: true,
      iluminacionNatural: true,
      orientacionSolar: true,
      alerosYSombrillas: true,
      aislamientoTermico: true,
      masaTermica: false
    },
    medidasActivas: {
      iluminacionLedEficiente: true,
      sensoresPresencia: true,
      equiposClimatizacionInverter: false,
      energiaSolarFotovoltaica: true,
      colectoresSolaresTermicos: true,
      griferiasAhorroAgua: true,
      reusoAguaLluvia: true
    },
    porcentajeAhorroAguaEsperado: 35,
    porcentajeAhorroEnergiaEsperado: 28,
    descripcionMedidasAdicionales: 'El proyecto implementa sistema de captación y filtrado de aguas pluviales para sanitarios y riego de cubiertas verdes, luminarias LED de 130 lm/W en zonas comunes y paneles solares fotovoltaicos para el 30% de la energía de bombeo.'
  }
};

export const ESTADO_INICIAL_FUN: FunSolicitudPayload = {
  general: {
    autoridad: 'Curaduría Urbana / Secretaría de Planeación',
    radicacionNo: '',
    departamento: 'Bogotá D.C.',
    municipio: 'Bogotá D.C.',
    fecha: new Date().toISOString().split('T')[0]
  },
  identificacion: {
    tipoTramite: 'CONSTRUCCION',
    objetoTramite: 'INICIAL',
    modalidadesConstruccion: ['OBRA_NUEVA'],
    usos: ['VIVIENDA'],
    areaUnidadesConstruidas: 'MENOR_2000',
    tipoVivienda: 'NO_VIS',
    bienInteresCultural: false
  },
  predio: {
    direccionActual: '',
    matriculaInmobiliaria: '',
    identificacionCatastral: '',
    clasificacionSuelo: 'URBANO',
    planimetriaLote: 'PLANO_LOTEO'
  },
  vecinosColindantes: [
    { id: 1, direccionPredio: '', direccionCorrespondencia: '' }
  ],
  linderos: {
    norte: { longitud: 0, colindaCon: '' },
    sur: { longitud: 0, colindaCon: '' },
    oriente: { longitud: 0, colindaCon: '' },
    occidente: { longitud: 0, colindaCon: '' },
    areaTotalPredio: 0
  },
  titulares: [
    { nombre: '', ccNit: '', telefono: '', correoElectronico: '' }
  ],
  titularesAceptanNotificacionElectronica: true,
  profesionales: {},
  responsableSolicitud: {
    nombre: '',
    cedula: '',
    telefono: '',
    direccionCorrespondencia: '',
    correoElectronico: '',
    aceptaNotificacionElectronica: true
  },
  anexoConstruccionSostenible: {
    zonificacionClimatica: 'TEMPLADO',
    medidasPasivas: {
      ventilacionNatural: true,
      iluminacionNatural: true,
      orientacionSolar: true,
      alerosYSombrillas: false,
      aislamientoTermico: false,
      masaTermica: false
    },
    medidasActivas: {
      iluminacionLedEficiente: true,
      sensoresPresencia: true,
      equiposClimatizacionInverter: false,
      energiaSolarFotovoltaica: false,
      colectoresSolaresTermicos: false,
      griferiasAhorroAgua: true,
      reusoAguaLluvia: false
    },
    porcentajeAhorroAguaEsperado: 20,
    porcentajeAhorroEnergiaEsperado: 20,
    descripcionMedidasAdicionales: ''
  }
};
