import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import { FunSolicitudPayload } from '../types/fun';

// Standard clean text function ensuring WinAnsi compatibility without breaking Spanish characters
export function cleanWinAnsi(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/[≥]/g, '>=')
    .replace(/[≤]/g, '<=')
    .replace(/[²]/g, '2')
    .replace(/[³]/g, '3')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[•]/g, '-')
    .replace(/[°º]/g, 'o')
    .replace(/[ª]/g, 'a')
    .replace(/[✓✔]/g, 'X')
    .replace(/[^\x00-\x7F\xA0-\xFF]/g, '');
}

/**
 * Loads the official blank 4-page PDF template of the Formulario Único Nacional (Resolución 1051 de 2025).
 * Preserves 100% of the authentic government design, layout, resolution text, logos, and borders.
 */
async function loadOfficialTemplateBytes(): Promise<Uint8Array> {
  // Client-side browser execution
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/templates/formulario_unico_nacional_res_1051.pdf');
      if (res.ok) {
        const buf = await res.arrayBuffer();
        return new Uint8Array(buf);
      }
    } catch {
      // Fallback
    }

    try {
      const resApi = await fetch('/api/template-pdf');
      if (resApi.ok) {
        const buf = await resApi.arrayBuffer();
        return new Uint8Array(buf);
      }
    } catch {
      // Fallback
    }
  } else {
    // Node.js backend execution
    const fs = await import('fs');
    const path = await import('path');
    const possiblePaths = [
      path.resolve(process.cwd(), 'public/templates/formulario_unico_nacional_res_1051.pdf'),
      path.resolve(process.cwd(), 'src/assets/formulario_unico_nacional_res_1051.pdf'),
      path.resolve(process.cwd(), 'dist/templates/formulario_unico_nacional_res_1051.pdf'),
      '/tmp/official_fun_1051.pdf'
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return fs.readFileSync(p);
      }
    }
  }

  throw new Error('No se pudo encontrar la plantilla oficial del FUN (Resolución 1051 de 2025).');
}

/**
 * Generates the completed Formulario Único Nacional (FUN) by loading the official 4-page
 * MinVivienda template (Resolución 1051 de 2025) and stamping the user's data into the enabled fields.
 */
export async function generarFunPdfBytes(solicitud: FunSolicitudPayload): Promise<Uint8Array> {
  const templateBytes = await loadOfficialTemplateBytes();
  const pdfDoc = await PDFDocument.load(templateBytes);

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const page1 = pages[0];
  const page2 = pages[1];
  const page3 = pages[2];
  const page4 = pages[3];

  const colorBlack = rgb(0.05, 0.05, 0.05);

  const stampText = (
    page: PDFPage,
    text: string | number | undefined | null,
    x: number,
    y: number,
    size = 7.5,
    isBold = false,
    maxWidth?: number
  ) => {
    if (text === undefined || text === null || text === '') return;
    const clean = cleanWinAnsi(String(text));
    if (!clean) return;
    const font = isBold ? fontBold : fontRegular;
    let actualSize = size;
    if (maxWidth) {
      const textWidth = font.widthOfTextAtSize(clean, actualSize);
      if (textWidth > maxWidth) {
        actualSize = Math.max(5.5, (maxWidth / textWidth) * actualSize);
      }
    }
    page.drawText(clean, {
      x,
      y,
      size: actualSize,
      font,
      color: colorBlack
    });
  };

  /**
   * Stamps an 'X' centered inside a checkbox with given center coordinates (cx, cy)
   */
  const stampBoxCheck = (page: PDFPage, shouldCheck: boolean | undefined | null, cx: number, cy: number, size = 7.5) => {
    if (!shouldCheck) return;
    page.drawText('X', {
      x: cx - 2.8,
      y: cy - 2.8,
      size,
      font: fontBold,
      color: colorBlack
    });
  };

  // =========================================================================
  // PÁGINA 1: GENERALIDADES, TRÁMITE, MODALIDADES Y PREDIO
  // =========================================================================

  // 0.1 OFICINA RESPONSABLE (celda entre x=180..527, baseline y=681.0)
  stampText(page1, solicitud.general.autoridad || 'Curaduría Urbana', 185, 681, 7.5, true);

  // 0.2 No. DE RADICACIÓN (12 casillas oficiales: Municipio[5] - Curaduría[1] - Año[2] - Consecutivo[4])
  if (solicitud.general.radicacionNo) {
    const rawDigits = solicitud.general.radicacionNo.replace(/[^0-9]/g, '');
    const radBoxCentersX = [
      316.9, 332.9, 349.0, 365.6, 381.7, // Municipio (5 dígitos)
      404.2,                             // Curaduría (1 dígito)
      426.8, 443.1,                      // Año (2 dígitos)
      465.7, 482.3, 498.3, 514.7         // Consecutivo (4 dígitos)
    ];
    for (let i = 0; i < Math.min(rawDigits.length, radBoxCentersX.length); i++) {
      page1.drawText(rawDigits[i], {
        x: radBoxCentersX[i] - 2.8,
        y: 664.8,
        size: 8.5,
        font: fontBold,
        color: colorBlack
      });
    }
  }

  // 0.3 DEPARTAMENTO - MUNICIPIO - FECHA (baseline y=647.5)
  const depMunFecha = `${solicitud.general.departamento || ''}  -  ${solicitud.general.municipio || ''}  -  ${solicitud.general.fecha || ''}`;
  stampText(page1, depMunFecha, 340, 647.5, 7.5, false);

  // 1.1 TIPO DE TRÁMITE (casillas a la derecha en cx=252.3)
  stampBoxCheck(page1, solicitud.identificacion.tipoTramite === 'URBANIZACION', 252.3, 606.0);
  stampBoxCheck(page1, solicitud.identificacion.tipoTramite === 'PARCELACION', 252.3, 596.9);
  stampBoxCheck(page1, solicitud.identificacion.tipoTramite === 'SUBDIVISION', 252.3, 587.8);
  stampBoxCheck(page1, solicitud.identificacion.tipoTramite === 'CONSTRUCCION', 252.3, 578.6);
  stampBoxCheck(page1, solicitud.identificacion.tipoTramite === 'ESPACIO_PUBLICO', 252.3, 565.7);
  stampBoxCheck(page1, solicitud.identificacion.tipoTramite === 'RECONOCIMIENTO', 252.3, 549.4);
  stampBoxCheck(page1, solicitud.identificacion.tipoTramite === 'OTRAS', 252.3, 536.9);

  // 1.2 OBJETO DEL TRÁMITE (casillas a la derecha en cx=492.3)
  stampBoxCheck(page1, solicitud.identificacion.objetoTramite === 'INICIAL', 492.3, 606.0);
  stampBoxCheck(page1, solicitud.identificacion.objetoTramite === 'MODIFICACION', 492.3, 596.9);
  stampBoxCheck(page1, solicitud.identificacion.objetoTramite === 'REVALIDACION', 492.3, 587.8);
  if (solicitud.identificacion.objetoTramite === 'OTRAS') {
    stampText(page1, solicitud.identificacion.objetoTramiteCual, 315, 548, 7, false);
  }

  // 1.3 MODALIDAD LICENCIA DE URBANIZACIÓN (casillas a la derecha en cx=252.3)
  stampBoxCheck(page1, solicitud.identificacion.modalidadUrbanizacion === 'DESARROLLO', 252.3, 518.6);
  stampBoxCheck(page1, solicitud.identificacion.modalidadUrbanizacion === 'SANEAMIENTO', 252.3, 509.5);
  stampBoxCheck(page1, solicitud.identificacion.modalidadUrbanizacion === 'REURBANIZACION', 252.3, 499.9);

  // 1.4 MODALIDAD LICENCIA DE SUBDIVISIÓN (casillas a la derecha en cx=252.3)
  stampBoxCheck(page1, solicitud.identificacion.modalidadSubdivision === 'RURAL', 252.3, 481.2);
  stampBoxCheck(page1, solicitud.identificacion.modalidadSubdivision === 'URBANA', 252.3, 472.1);
  stampBoxCheck(page1, solicitud.identificacion.modalidadSubdivision === 'RELOTEO', 252.3, 463.0);

  // 1.5 MODALIDAD LICENCIA DE CONSTRUCCIÓN
  const modConst = solicitud.identificacion.modalidadesConstruccion || [];
  // Columna izquierda (cx=368.0)
  stampBoxCheck(page1, modConst.includes('OBRA_NUEVA'), 368.0, 518.6);
  stampBoxCheck(page1, modConst.includes('AMPLIACION'), 368.0, 499.9);
  stampBoxCheck(page1, modConst.includes('ADECUACION'), 368.0, 490.8);
  stampBoxCheck(page1, modConst.includes('MODIFICACION'), 368.0, 481.2);
  stampBoxCheck(page1, modConst.includes('RESTAURACION'), 368.0, 472.1);
  // Columna derecha (cx=492.3)
  stampBoxCheck(page1, modConst.includes('REFORZAMIENTO_ESTRUCTURAL'), 492.3, 518.6);
  stampBoxCheck(page1, modConst.includes('DEMOLICION_TOTAL'), 492.3, 490.8);
  stampBoxCheck(page1, modConst.includes('DEMOLICION_PARCIAL'), 492.3, 481.2);
  stampBoxCheck(page1, modConst.includes('RECONSTRUCCION'), 492.3, 472.1);
  stampBoxCheck(page1, modConst.includes('CERRAMIENTO'), 492.3, 463.0);

  // 1.6 USOS (fila 1 cy=441.4, fila 2 cy=420.7)
  const usos = solicitud.identificacion.usos || [];
  stampBoxCheck(page1, usos.includes('VIVIENDA'), 73.7, 441.4);
  stampBoxCheck(page1, usos.includes('COMERCIO_SERVICIOS'), 132.3, 441.4);
  stampBoxCheck(page1, usos.includes('DOTACIONAL'), 197.6, 441.4);
  stampBoxCheck(page1, usos.includes('INDUSTRIAL'), 73.7, 420.7);
  stampBoxCheck(page1, usos.includes('OTRO'), 132.3, 420.7);
  if (usos.includes('OTRO')) {
    stampText(page1, solicitud.identificacion.usosOtroCual, 195, 417, 7, false);
  }

  // 1.7 ÁREA O UNIDADES CONSTRUIDA(S) (fila 1 cy=441.4, fila 2 cy=420.7)
  const areaUnidades = solicitud.identificacion.areaUnidadesConstruidas;
  stampBoxCheck(page1, areaUnidades === 'MENOR_2000', 377.1, 441.4);
  stampBoxCheck(page1, areaUnidades === 'SUPERA_POR_AMPLIACION_2000', 506.3, 441.4);
  stampBoxCheck(page1, areaUnidades === 'MAYOR_IGUAL_2000', 377.1, 420.7);
  stampBoxCheck(page1, areaUnidades === 'CINCO_O_MAS_VIVIENDA', 506.3, 420.7);

  // 1.8 TIPO DE VIVIENDA (cy=394.8)
  stampBoxCheck(page1, solicitud.identificacion.tipoVivienda === 'VIP', 75.1, 394.8);
  stampBoxCheck(page1, solicitud.identificacion.tipoVivienda === 'VIS', 134.7, 394.8);
  stampBoxCheck(page1, solicitud.identificacion.tipoVivienda === 'NO_VIS', 200.9, 394.8);

  // 1.9 BIEN DE INTERÉS CULTURAL (cy=394.8)
  stampBoxCheck(page1, solicitud.identificacion.bienInteresCultural === true, 318.1, 394.8);
  stampBoxCheck(page1, solicitud.identificacion.bienInteresCultural === false, 420.3, 394.8);

  // 2. INFORMACIÓN SOBRE EL PREDIO
  // 2.1 DIRECCIÓN O NOMENCLATURA (primera línea de escritura sobre el subrayado y=341.0)
  stampText(page1, solicitud.predio.direccionActual, 85, 341.0, 7.5, true);
  stampText(page1, solicitud.predio.direccionesAnteriores, 350, 341.0, 7.5, false);

  // 2.2 MATRÍCULA INMOBILIARIA y 2.3 IDENTIFICACIÓN CATASTRAL (sobre el subrayado y=281.0)
  stampText(page1, solicitud.predio.matriculaInmobiliaria, 85, 281.0, 8, true);
  stampText(page1, solicitud.predio.identificacionCatastral, 350, 281.0, 8, true);

  // 2.4 CLASIFICACIÓN DEL SUELO (casillas a la derecha en cx=272.9)
  stampBoxCheck(page1, solicitud.predio.clasificacionSuelo === 'URBANO', 272.9, 242.6);
  stampBoxCheck(page1, solicitud.predio.clasificacionSuelo === 'RURAL', 272.9, 233.5);
  stampBoxCheck(page1, solicitud.predio.clasificacionSuelo === 'EXPANSION', 272.9, 224.4);

  // 2.5 PLANIMETRÍA DEL LOTE (casillas a la derecha en cx=503.9)
  stampBoxCheck(page1, solicitud.predio.planimetriaLote === 'PLANO_LOTEO', 503.9, 242.6);
  stampBoxCheck(page1, solicitud.predio.planimetriaLote === 'PLANO_TOPOGRAFICO', 503.9, 234.0);
  stampBoxCheck(page1, solicitud.predio.planimetriaLote === 'OTRO', 503.9, 224.9);
  if (solicitud.predio.planimetriaLote === 'OTRO') {
    stampText(page1, solicitud.predio.planimetriaOtroCual, 340, 211, 7, false);
  }

  // 2.6 INFORMACIÓN GENERAL DEL PREDIO (centrado en cada cuadrícula bajo el rótulo)
  stampText(page1, solicitud.predio.barrio, 185, 168.0, 7.5, false);
  stampText(page1, solicitud.predio.vereda, 360, 168.0, 7.5, false);
  stampText(page1, solicitud.predio.comuna, 185, 145.0, 7.5, false);
  stampText(page1, solicitud.predio.sector, 360, 145.0, 7.5, false);
  stampText(page1, solicitud.predio.estrato ? String(solicitud.predio.estrato) : undefined, 185, 122.0, 8, true);
  stampText(page1, solicitud.predio.corregimiento, 360, 122.0, 7.5, false);
  stampText(page1, solicitud.predio.manzanaNo, 185, 98.0, 8, true);
  stampText(page1, solicitud.predio.loteNo, 360, 98.0, 8, true);

  // =========================================================================
  // PÁGINA 2: VECINOS COLINDANTES, LINDEROS Y TITULARES
  // =========================================================================

  // 3. INFORMACIÓN DE VECINOS COLINDANTES (Hasta 8 vecinos en cuadrícula 2 columnas x 4 filas)
  // Col 1: x = 105 (vecinos impares 1, 3, 5, 7)
  // Col 2: x = 338 (vecinos pares 2, 4, 6, 8)
  const vecinos = solicitud.vecinosColindantes || [];
  const coordsVecinos: Array<{ xPredio: number; yPredio: number; xCorr: number; yCorr: number }> = [
    { xPredio: 105, yPredio: 668.0, xCorr: 105, yCorr: 638.0 }, // Vecino 1 (Col 1, Fila 1)
    { xPredio: 338, yPredio: 668.0, xCorr: 338, yCorr: 638.0 }, // Vecino 2 (Col 2, Fila 1)
    { xPredio: 105, yPredio: 604.0, xCorr: 105, yCorr: 572.0 }, // Vecino 3 (Col 1, Fila 2)
    { xPredio: 338, yPredio: 604.0, xCorr: 338, yCorr: 572.0 }, // Vecino 4 (Col 2, Fila 2)
    { xPredio: 105, yPredio: 539.0, xCorr: 105, yCorr: 506.0 }, // Vecino 5 (Col 1, Fila 3)
    { xPredio: 338, yPredio: 539.0, xCorr: 338, yCorr: 506.0 }, // Vecino 6 (Col 2, Fila 3)
    { xPredio: 105, yPredio: 473.0, xCorr: 105, yCorr: 441.0 }, // Vecino 7 (Col 1, Fila 4)
    { xPredio: 338, yPredio: 473.0, xCorr: 338, yCorr: 441.0 }, // Vecino 8 (Col 2, Fila 4)
  ];

  vecinos.slice(0, 8).forEach((vec, idx) => {
    const c = coordsVecinos[idx];
    if (c) {
      stampText(page2, vec.direccionPredio, c.xPredio, c.yPredio, 7, false);
      stampText(page2, vec.direccionCorrespondencia, c.xCorr, c.yCorr, 7, false);
    }
  });

  // 4. LINDEROS, DIMENSIONES Y ÁREAS
  // Columnas oficiales:
  // LINDEROS: 67.2 a 185.8 pt
  // LONGITUD (Metros lineales): 185.8 a 299.1 pt (centrado/escritura en x = 210)
  // COLINDA CON: 299.1 a 527.1 pt (escritura en x = 305)
  if (solicitud.linderos) {
    if (solicitud.linderos.norte) {
      stampText(page2, `${solicitud.linderos.norte.longitud} m`, 210, 410.5, 7.5, true);
      stampText(page2, solicitud.linderos.norte.colindaCon, 305, 410.5, 7.5, false);
    }
    if (solicitud.linderos.sur) {
      stampText(page2, `${solicitud.linderos.sur.longitud} m`, 210, 377.0, 7.5, true);
      stampText(page2, solicitud.linderos.sur.colindaCon, 305, 377.0, 7.5, false);
    }
    if (solicitud.linderos.oriente) {
      stampText(page2, `${solicitud.linderos.oriente.longitud} m`, 210, 344.0, 7.5, true);
      stampText(page2, solicitud.linderos.oriente.colindaCon, 305, 344.0, 7.5, false);
    }
    if (solicitud.linderos.occidente) {
      stampText(page2, `${solicitud.linderos.occidente.longitud} m`, 210, 311.0, 7.5, true);
      stampText(page2, solicitud.linderos.occidente.colindaCon, 305, 311.0, 7.5, false);
    }
    if (solicitud.linderos.areaTotalPredio !== undefined && solicitud.linderos.areaTotalPredio !== null) {
      const areaValStr = typeof solicitud.linderos.areaTotalPredio === 'number'
        ? solicitud.linderos.areaTotalPredio.toLocaleString('es-CO')
        : String(solicitud.linderos.areaTotalPredio);
      const textWidth = fontBold.widthOfTextAtSize(cleanWinAnsi(areaValStr), 8);
      // El símbolo oficial 'm²' de la plantilla está al extremo derecho (x=513.7 a 527).
      // Se posiciona el valor numérico al lado de m² (terminando a x=510 con un espacio de separación adecuado).
      const xPos = Math.max(305, 510 - textWidth);
      stampText(page2, areaValStr, xPos, 277.5, 8, true);
    }
  }

  // 5.1 TITULARES DE LA LICENCIA (hasta 4 titulares con nombre y datos)
  // El rótulo '5.1 TITULAR (ES) DE LA LICENCIA' está en y = 244.8..236.2 pt (no escribir sobre él)
  // Fila 1 (Nombre): x = 105, hasta x = 292 (antes de FIRMA que inicia en 299)
  // Fila 2 (Datos): C.C. en x = 105, Teléfono en x = 250 (tras etiqueta 'TELÉFONO /CELULAR' que termina en x=247), Correo en x = 372
  const titulares = solicitud.titulares || [];
  const coordsTitulares = [
    { yNombre: 224.0, yDatos: 212.0 }, // Titular 1
    { yNombre: 195.0, yDatos: 182.0 }, // Titular 2
    { yNombre: 165.0, yDatos: 153.0 }, // Titular 3
    { yNombre: 135.0, yDatos: 123.0 }, // Titular 4
  ];

  titulares.slice(0, 4).forEach((tit, idx) => {
    const c = coordsTitulares[idx];
    if (c) {
      stampText(page2, tit.nombre, 105, c.yNombre, 7.5, true, 186);
      stampText(page2, tit.ccNit, 105, c.yDatos, 7.5, false, 75);
      stampText(page2, tit.telefono, 250, c.yDatos, 7, false, 46);
      stampText(page2, tit.correoElectronico, 372, c.yDatos, 7, false, 150);
    }
  });

  // Notificación electrónica titulares (casillas en cx=441.9 [SI] y cx=477.5 [NO], cy=111.1)
  stampBoxCheck(page2, solicitud.titularesAceptanNotificacionElectronica === true, 441.9, 111.1);
  stampBoxCheck(page2, solicitud.titularesAceptanNotificacionElectronica === false, 477.5, 111.1);

  // =========================================================================
  // PÁGINA 3: PROFESIONALES RESPONSABLES Y RESPONSABLE DE LA SOLICITUD
  // =========================================================================

  const profs = solicitud.profesionales || {};

  // Configuración de los 10 roles profesionales oficiales con sus 3 renglones exactos
  // Renglón 1 (Nombre): x = 180 (tras etiqueta NOMBRE)
  // Renglón 2 (Cédula / Matrícula / Fecha): Cédula x = 175, Matrícula x = 315, Fecha x = 445
  // Renglón 3 (Correo / Teléfono): Correo x = 215, Teléfono x = 375
  const rolesConfig: Array<{
    keys: string[];
    yNombre: number;
    yCedulaMat: number;
    yCorreoTel: number;
    hasSupervision?: boolean;
    xSupSi?: number;
    xSupNo?: number;
    ySup?: number;
  }> = [
    { keys: ['urbanizador', 'URBANIZADOR_PARCELADOR'], yNombre: 673.0, yCedulaMat: 657.0, yCorreoTel: 642.0 },
    { keys: ['directorConstruccion', 'DIRECTOR_CONSTRUCCION'], yNombre: 620.0, yCedulaMat: 604.0, yCorreoTel: 589.0 },
    { keys: ['arquitectoProyectista', 'ARQUITECTO_PROYECTISTA'], yNombre: 566.0, yCedulaMat: 550.0, yCorreoTel: 535.0 },
    { keys: ['disenadorEstructural', 'INGENIERO_ESTRUCTURAL'], yNombre: 511.0, yCedulaMat: 495.0, yCorreoTel: 480.0, hasSupervision: true, xSupSi: 480.8, xSupNo: 505.8, ySup: 499.9 },
    { keys: ['disenadorElementosNoEstructurales', 'DISENADOR_NO_ESTRUCTURAL'], yNombre: 456.0, yCedulaMat: 440.0, yCorreoTel: 425.0 },
    { keys: ['ingenieroGeotecnista', 'INGENIERO_GEOTECNISTA'], yNombre: 401.0, yCedulaMat: 385.0, yCorreoTel: 370.0, hasSupervision: true, xSupSi: 480.8, xSupNo: 505.8, ySup: 390.5 },
    { keys: ['topografo', 'TOPOGRAFO'], yNombre: 346.0, yCedulaMat: 330.0, yCorreoTel: 315.0 },
    { keys: ['revisorEstructuralIndependiente', 'REVISOR_ESTRUCTURAL_INDEPENDIENTE'], yNombre: 292.0, yCedulaMat: 276.0, yCorreoTel: 260.0 },
    { keys: ['otrosEspecialistas1', 'ESPECIALISTA_1'], yNombre: 237.0, yCedulaMat: 221.0, yCorreoTel: 206.0 },
    { keys: ['otrosEspecialistas2', 'ESPECIALISTA_2'], yNombre: 182.0, yCedulaMat: 166.0, yCorreoTel: 151.0 },
  ];

  rolesConfig.forEach((cfg) => {
    let prof = undefined;
    for (const k of cfg.keys) {
      if (profs[k]) {
        prof = profs[k];
        break;
      }
    }
    if (prof && prof.nombre) {
      stampText(page3, prof.nombre, 180, cfg.yNombre, 7.5, true);
      stampText(page3, prof.cedula, 175, cfg.yCedulaMat, 7.5, false);
      stampText(page3, prof.matriculaProfesional, 315, cfg.yCedulaMat, 7.5, false);
      stampText(page3, prof.fechaExpedicionMatricula, 445, cfg.yCedulaMat, 7, false);
      stampText(page3, prof.correoElectronico, 215, cfg.yCorreoTel, 7, false);
      stampText(page3, prof.telefono, 375, cfg.yCorreoTel, 7.5, false);

      if (cfg.hasSupervision && cfg.xSupSi && cfg.xSupNo && cfg.ySup) {
        stampBoxCheck(page3, prof.exigeSupervisionTecnica === true, cfg.xSupSi, cfg.ySup);
        stampBoxCheck(page3, prof.exigeSupervisionTecnica === false, cfg.xSupNo, cfg.ySup);
      }
    }
  });

  // 5.3 RESPONSABLE DE LA SOLICITUD
  if (solicitud.responsableSolicitud) {
    const resp = solicitud.responsableSolicitud;
    stampText(page3, resp.nombre, 180, 122.0, 7.5, true);
    stampText(page3, resp.cedula, 180, 106.5, 7.5, false);
    stampText(page3, resp.telefono, 445, 106.5, 7.5, false);
    stampText(page3, resp.direccionCorrespondencia, 265, 80.0, 7.5, false);
    stampText(page3, resp.correoElectronico, 445, 80.0, 7, false);
    // Notificación electrónica solicitante (cx=441.9 [SI], cx=477.5 [NO], cy=68.0)
    stampBoxCheck(page3, resp.aceptaNotificacionElectronica === true, 441.9, 68.0);
    stampBoxCheck(page3, resp.aceptaNotificacionElectronica === false, 477.5, 68.0);
  }

  // =========================================================================
  // PÁGINA 4: ANEXO DE CONSTRUCCIÓN SOSTENIBLE (RESOLUCIÓN 0549 DE 2015)
  // =========================================================================

  const anexo = solicitud.anexoConstruccionSostenible || {};

  // Usos de la edificación en el anexo
  const usosAnexo = usos || [];
  stampBoxCheck(page4, usosAnexo.includes('VIVIENDA'), 150.0, 681.8);
  stampBoxCheck(page4, usosAnexo.includes('DOTACIONAL'), 278.2, 681.8);
  stampBoxCheck(page4, usosAnexo.includes('COMERCIO_SERVICIOS'), 385.3, 681.8);
  stampBoxCheck(page4, usosAnexo.includes('INDUSTRIAL'), 148.6, 663.6);
  stampBoxCheck(page4, usosAnexo.includes('OTRO'), 410.7, 663.6);

  // 2.1.1 Medidas Pasivas de Ahorro en Energía (columna izquierda en cx=277.3)
  const pasivas = anexo.medidasPasivas || ({} as any);
  stampBoxCheck(page4, pasivas.cubiertaVerde || pasivas.aislamientoTermico, 277.3, 618.0);
  stampBoxCheck(page4, pasivas.elementosProteccionSolar || pasivas.alerosYSombrillas, 277.3, 608.9);
  stampBoxCheck(page4, pasivas.vidriosProteccionSolar, 277.3, 599.8);
  stampBoxCheck(page4, pasivas.cubiertaProteccionSolar, 277.3, 590.6);
  stampBoxCheck(page4, pasivas.paredProteccionSolar || pasivas.masaTermica, 277.3, 581.5);
  stampBoxCheck(page4, pasivas.otro, 277.3, 572.4);
  if (pasivas.otro && pasivas.otroCual) {
    stampText(page4, pasivas.otroCual, 160, 568, 6.5, false);
  }

  // 2.1.2 Medidas Activas de Ahorro en Energía (columna derecha en cx=502.9)
  const activas = anexo.medidasActivas || ({} as any);
  stampBoxCheck(page4, activas.iluminacionEficiente || activas.iluminacionLedEficiente, 502.9, 618.0);
  stampBoxCheck(page4, activas.equiposAireEficientes || activas.equiposClimatizacionInverter, 502.9, 608.9);
  stampBoxCheck(page4, activas.aguaCalienteSolar || activas.colectoresSolaresTermicos, 502.9, 599.8);
  stampBoxCheck(page4, activas.controlesIluminacion || activas.sensoresPresencia, 502.9, 590.6);
  stampBoxCheck(page4, activas.variadoresVelocidadBombas, 502.9, 581.5);
  stampBoxCheck(page4, activas.otro, 502.9, 572.4);
  if (activas.otro && activas.otroCual) {
    stampText(page4, activas.otroCual, 430, 568, 6.5, false);
  }

  // 2.2 Materialidad Muro Externo (columna izquierda en cx=277.3)
  const matExt = anexo.materialidadMuroExterno;
  stampBoxCheck(page4, matExt === 'ladrillo_portante', 277.3, 539.8);
  stampBoxCheck(page4, matExt === 'ladrillo_comun', 277.3, 530.6);
  stampBoxCheck(page4, matExt === 'concreto_vaciado', 277.3, 521.3);
  stampBoxCheck(page4, matExt === 'superboard', 277.3, 512.2);
  stampBoxCheck(page4, matExt === 'muro_cortina_aluminio', 277.3, 503.0);
  stampBoxCheck(page4, matExt === 'otro', 277.3, 493.9);

  // 2.3 Materialidad Muro Interno (columna derecha en cx=502.9)
  const matInt = anexo.materialidadMuroInterno;
  stampBoxCheck(page4, matInt === 'ladrillo_numero_4', 502.9, 539.8);
  stampBoxCheck(page4, matInt === 'drywall', 502.9, 530.6);
  stampBoxCheck(page4, matInt === 'ladrillo_comun', 502.9, 521.3);
  stampBoxCheck(page4, matInt === 'concreto_vaciado', 502.9, 512.2);
  stampBoxCheck(page4, matInt === 'bloque_concreto', 502.9, 503.0);
  stampBoxCheck(page4, matInt === 'otro', 502.9, 493.9);

  // 2.4 Materialidad Cubierta (columna izquierda en cx=277.3)
  const matCub = anexo.materialidadCubierta;
  stampBoxCheck(page4, matCub === 'concreto_vaciado', 277.3, 475.4);
  stampBoxCheck(page4, matCub === 'panel_sandwich', 277.3, 465.6);
  stampBoxCheck(page4, matCub === 'tejas_arcilla', 277.3, 455.8);
  stampBoxCheck(page4, matCub === 'metalica', 277.3, 446.2);
  stampBoxCheck(page4, matCub === 'fibrocemento', 277.3, 436.3);
  stampBoxCheck(page4, matCub === 'otro', 277.3, 426.5);

  // 2.5 Relación Muro Ventana (Rango 0% - 100%) y Altura Piso a Techo
  const relMuroVentana = anexo.relacionMuroVentana || {};
  stampText(page4, relMuroVentana.norte !== undefined ? `${relMuroVentana.norte}%` : undefined, 435, 473.0, 7.5, false);
  stampText(page4, relMuroVentana.sur !== undefined ? `${relMuroVentana.sur}%` : undefined, 435, 462.0, 7.5, false);
  stampText(page4, relMuroVentana.oriente !== undefined ? `${relMuroVentana.oriente}%` : undefined, 435, 451.0, 7.5, false);
  stampText(page4, relMuroVentana.occidente !== undefined ? `${relMuroVentana.occidente}%` : undefined, 435, 440.0, 7.5, false);
  stampText(page4, relMuroVentana.alturaPisoTecho !== undefined ? `${relMuroVentana.alturaPisoTecho} m` : undefined, 515, 456.0, 7.5, false);

  // 2.6 Declaración sobre Medidas de Ahorro en Agua (columna izquierda en cx=277.3)
  const agua = anexo.medidasAhorroAgua || ({} as any);
  stampBoxCheck(page4, agua.sanitariosBajoConsumo, 277.3, 408.2);
  stampBoxCheck(page4, agua.lavamanosBajoConsumo || activas.griferiasAhorroAgua, 277.3, 399.1);
  stampBoxCheck(page4, agua.duchasBajoConsumo, 277.3, 390.0);
  stampBoxCheck(page4, agua.orinalesBajoConsumo, 277.3, 380.6);
  stampBoxCheck(page4, agua.recoleccionAguaLluvia || activas.reusoAguaLluvia, 277.3, 371.5);
  stampBoxCheck(page4, agua.otro, 277.3, 362.4);

  // 2.7 Zonificación Climática (fila en cy=394.3)
  const clima = anexo.zonificacionClimatica;
  stampBoxCheck(page4, clima === 'FRIO', 310.4, 394.3);
  stampBoxCheck(page4, clima === 'TEMPLADO', 356.5, 394.3);
  stampBoxCheck(page4, clima === 'CALIDO_SECO', 421.3, 394.3);
  stampBoxCheck(page4, clima === 'CALIDO_HUMEDO', 473.4, 394.3);

  // 2.8 y 2.9 Ahorros Esperados en Agua y Energía (sobre el renglón correspondiente)
  stampText(page4, anexo.porcentajeAhorroAguaEsperado !== undefined ? `${anexo.porcentajeAhorroAguaEsperado}%` : undefined, 200, 341.0, 8, true);
  stampText(page4, anexo.porcentajeAhorroEnergiaEsperado !== undefined ? `${anexo.porcentajeAhorroEnergiaEsperado}%` : undefined, 450, 341.0, 8, true);

  // Áreas Netas (Res. 0549 de 2015)
  stampText(page4, anexo.areaNetaUrbanismoPaisajismo !== undefined ? `${anexo.areaNetaUrbanismoPaisajismo} m2` : undefined, 420, 301.0, 7.5, false);
  stampText(page4, anexo.areaNetaZonasComunes !== undefined ? `${anexo.areaNetaZonasComunes} m2` : undefined, 420, 289.0, 7.5, false);
  stampText(page4, anexo.areaNetaParqueaderos !== undefined ? `${anexo.areaNetaParqueaderos} m2` : undefined, 420, 277.0, 7.5, false);

  // Return generated filled official PDF bytes
  return await pdfDoc.save();
}
