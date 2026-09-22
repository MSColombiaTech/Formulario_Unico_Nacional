import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';
import { FunSolicitudPayload, ROLES_PROFESIONALES } from '../types/fun';

interface RenderContext {
  doc: PDFDocument;
  page: PDFPage;
  fontRegular: PDFFont;
  fontBold: PDFFont;
  width: number;
  height: number;
}

const PRIMARY_COLOR = rgb(0.08, 0.18, 0.36); // #142e5c Navy
const SECONDARY_BG = rgb(0.93, 0.95, 0.98);
const BORDER_COLOR = rgb(0.65, 0.72, 0.82);
const TEXT_DARK = rgb(0.1, 0.13, 0.18);
const TEXT_MUTED = rgb(0.4, 0.45, 0.52);

export function cleanWinAnsi(str: string | undefined): string {
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

function drawHeader(ctx: RenderContext, pageNum: number, pageSubtitle: string) {
  const { page, fontRegular, fontBold, width, height } = ctx;
  
  // Top Header Banner
  page.drawRectangle({
    x: 36,
    y: height - 68,
    width: width - 72,
    height: 44,
    color: PRIMARY_COLOR
  });

  page.drawText(cleanWinAnsi('REPÚBLICA DE COLOMBIA - MINISTERIO DE VIVIENDA, CIUDAD Y TERRITORIO'), {
    x: 48,
    y: height - 40,
    size: 8.5,
    font: fontBold,
    color: rgb(1, 1, 1)
  });

  page.drawText(cleanWinAnsi('FORMULARIO ÚNICO NACIONAL (FUN) - RESOLUCIÓN 1051 DE 2025 (DECRETO 1077 DE 2015)'), {
    x: 48,
    y: height - 54,
    size: 7.5,
    font: fontRegular,
    color: rgb(0.9, 0.94, 1)
  });

  page.drawText(cleanWinAnsi(`PÁGINA ${pageNum} DE 4 - ${pageSubtitle}`), {
    x: width - 210,
    y: height - 40,
    size: 7.5,
    font: fontBold,
    color: rgb(1, 0.9, 0.4)
  });

  // Footer
  page.drawLine({
    start: { x: 36, y: 32 },
    end: { x: width - 36, y: 32 },
    thickness: 0.8,
    color: BORDER_COLOR
  });

  page.drawText(cleanWinAnsi('Formulario Único Nacional para la Radicación de Licencias Urbanísticas en Colombia (Res. 1051/2025)'), {
    x: 36,
    y: 20,
    size: 6.5,
    font: fontRegular,
    color: TEXT_MUTED
  });

  page.drawText(cleanWinAnsi(`Página ${pageNum} de 4`), {
    x: width - 85,
    y: 20,
    size: 7,
    font: fontBold,
    color: PRIMARY_COLOR
  });
}

function drawSectionTitle(page: PDFPage, font: PDFFont, title: string, y: number, width: number) {
  page.drawRectangle({
    x: 36,
    y: y - 3,
    width: width - 72,
    height: 16,
    color: SECONDARY_BG
  });

  page.drawRectangle({
    x: 36,
    y: y - 3,
    width: 4,
    height: 16,
    color: PRIMARY_COLOR
  });

  page.drawText(cleanWinAnsi(title), {
    x: 45,
    y: y + 2,
    size: 8,
    font: font,
    color: PRIMARY_COLOR
  });

  return y - 10;
}

function drawBoxField(
  page: PDFPage,
  fontR: PDFFont,
  fontB: PDFFont,
  label: string,
  value: string | undefined,
  x: number,
  y: number,
  w: number,
  h: number = 26
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    borderWidth: 0.6,
    borderColor: BORDER_COLOR,
    color: rgb(1, 1, 1)
  });

  page.drawText(cleanWinAnsi(label.toUpperCase()), {
    x: x + 4,
    y: y + h - 8,
    size: 6,
    font: fontB,
    color: TEXT_MUTED
  });

  const displayVal = cleanWinAnsi(value || '---').substring(0, Math.floor(w / 4.8));
  page.drawText(displayVal, {
    x: x + 4,
    y: y + 5,
    size: 7.5,
    font: fontR,
    color: TEXT_DARK
  });
}

function drawCheckItem(
  page: PDFPage,
  fontR: PDFFont,
  fontB: PDFFont,
  label: string,
  checked: boolean,
  x: number,
  y: number,
  w: number
) {
  // Checkbox box
  page.drawRectangle({
    x,
    y,
    width: 9,
    height: 9,
    borderWidth: 0.8,
    borderColor: checked ? PRIMARY_COLOR : BORDER_COLOR,
    color: checked ? SECONDARY_BG : rgb(1, 1, 1)
  });

  if (checked) {
    page.drawText('X', {
      x: x + 1.8,
      y: y + 1.5,
      size: 7,
      font: fontB,
      color: PRIMARY_COLOR
    });
  }

  page.drawText(cleanWinAnsi(label), {
    x: x + 13,
    y: y + 1,
    size: 7,
    font: checked ? fontB : fontR,
    color: checked ? PRIMARY_COLOR : TEXT_DARK
  });
}

export async function generarFunPdfBytes(solicitud: FunSolicitudPayload): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const WIDTH = 612; // Letter
  const HEIGHT = 792;

  // ============================================================================
  // PÁGINA 1: GENERALIDADES, IDENTIFICACIÓN Y PREDIO
  // ============================================================================
  const p1 = doc.addPage([WIDTH, HEIGHT]);
  const ctx1: RenderContext = { doc, page: p1, fontRegular, fontBold, width: WIDTH, height: HEIGHT };
  drawHeader(ctx1, 1, 'GENERALIDADES, IDENTIFICACION Y PREDIO');

  let y = HEIGHT - 85;

  // SECCIÓN 0: DATOS GENERALES
  y = drawSectionTitle(p1, fontBold, '0. DATOS GENERALES DE RADICACION', y, WIDTH);
  y -= 26;
  drawBoxField(p1, fontRegular, fontBold, 'Autoridad / Curaduria / Planeacion', solicitud.general.autoridad, 36, y, 220);
  drawBoxField(p1, fontRegular, fontBold, 'Radicacion No.', solicitud.general.radicacionNo || 'SIN RADICAR', 260, y, 110);
  drawBoxField(p1, fontRegular, fontBold, 'Departamento', solicitud.general.departamento, 374, y, 95);
  drawBoxField(p1, fontRegular, fontBold, 'Municipio', solicitud.general.municipio, 473, y, 103);
  y -= 28;
  drawBoxField(p1, fontRegular, fontBold, 'Fecha de Radicacion (AAAA-MM-DD)', solicitud.general.fecha, 36, y, 180);
  drawBoxField(p1, fontRegular, fontBold, 'Decreto Reglamentario', 'Decreto 1077 de 2015 / Res. 1051 de 2025', 220, y, 356);

  // SECCIÓN 1: IDENTIFICACIÓN DE LA SOLICITUD
  y -= 22;
  y = drawSectionTitle(p1, fontBold, '1. IDENTIFICACION DE LA SOLICITUD', y, WIDTH);

  // 1.1 Tipo de Trámite
  y -= 14;
  p1.drawText(cleanWinAnsi('1.1 Tipo de Trámite Principal:'), { x: 36, y, size: 7.5, font: fontBold, color: PRIMARY_COLOR });
  y -= 14;
  const tramites: Array<{ key: string; label: string }> = [
    { key: 'URBANIZACION', label: 'Urbanización' },
    { key: 'PARCELACION', label: 'Parcelación' },
    { key: 'SUBDIVISION', label: 'Subdivisión' },
    { key: 'CONSTRUCCION', label: 'Construcción' },
    { key: 'ESPACIO_PUBLICO', label: 'Espacio Público' },
    { key: 'RECONOCIMIENTO', label: 'Reconocimiento' },
    { key: 'OTRAS', label: 'Otras' }
  ];
  let tramX = 36;
  tramites.forEach((t) => {
    drawCheckItem(p1, fontRegular, fontBold, t.label, solicitud.identificacion.tipoTramite === t.key, tramX, y, 75);
    tramX += 77;
  });

  // 1.2 Objeto del Trámite
  y -= 16;
  p1.drawText(cleanWinAnsi('1.2 Objeto del Trámite:'), { x: 36, y, size: 7.5, font: fontBold, color: PRIMARY_COLOR });
  y -= 14;
  const objetos: Array<{ key: string; label: string }> = [
    { key: 'INICIAL', label: 'Inicial' },
    { key: 'MODIFICACION', label: 'Modificación' },
    { key: 'REVALIDACION', label: 'Revalidación' },
    { key: 'OTRAS', label: `Otras: ${solicitud.identificacion.objetoTramiteCual || ''}` }
  ];
  let objX = 36;
  objetos.forEach((o) => {
    drawCheckItem(p1, fontRegular, fontBold, o.label, solicitud.identificacion.objetoTramite === o.key, objX, y, 120);
    objX += 135;
  });

  // 1.3 Modalidades de Construcción
  y -= 16;
  p1.drawText(cleanWinAnsi('1.3 Modalidades de Construcción (si aplica):'), { x: 36, y, size: 7.5, font: fontBold, color: PRIMARY_COLOR });
  y -= 13;
  const modConstruccion: Array<{ key: string; label: string }> = [
    { key: 'OBRA_NUEVA', label: 'Obra Nueva' },
    { key: 'AMPLIACION', label: 'Ampliación' },
    { key: 'ADECUACION', label: 'Adecuación' },
    { key: 'MODIFICACION', label: 'Modificación' },
    { key: 'RESTAURACION', label: 'Restauración' }
  ];
  let mcX = 36;
  modConstruccion.forEach((mc) => {
    const isChecked = solicitud.identificacion.modalidadesConstruccion?.includes(mc.key as any) ?? false;
    drawCheckItem(p1, fontRegular, fontBold, mc.label, isChecked, mcX, y, 105);
    mcX += 108;
  });

  y -= 13;
  const modConstruccion2: Array<{ key: string; label: string }> = [
    { key: 'REFORZAMIENTO_ESTRUCTURAL', label: 'Reforzamiento Estructural' },
    { key: 'DEMOLICION_TOTAL', label: 'Demolición Total' },
    { key: 'DEMOLICION_PARCIAL', label: 'Demol. Parcial' },
    { key: 'RECONSTRUCCION', label: 'Reconstrucción' },
    { key: 'CERRAMIENTO', label: 'Cerramiento' }
  ];
  mcX = 36;
  modConstruccion2.forEach((mc) => {
    const isChecked = solicitud.identificacion.modalidadesConstruccion?.includes(mc.key as any) ?? false;
    drawCheckItem(p1, fontRegular, fontBold, mc.label, isChecked, mcX, y, 105);
    mcX += 108;
  });

  // 1.4 Usos y Categorías
  y -= 16;
  p1.drawText(cleanWinAnsi('1.4 Usos Predominantes:'), { x: 36, y, size: 7.5, font: fontBold, color: PRIMARY_COLOR });
  y -= 13;
  const usos: Array<{ key: string; label: string }> = [
    { key: 'VIVIENDA', label: 'Vivienda' },
    { key: 'COMERCIO_SERVICIOS', label: 'Comercio / Servicios' },
    { key: 'DOTACIONAL', label: 'Dotacional' },
    { key: 'INDUSTRIAL', label: 'Industrial' },
    { key: 'OTRO', label: `Otro: ${solicitud.identificacion.usosOtroCual || ''}` }
  ];
  let usoX = 36;
  usos.forEach((u) => {
    const isChecked = solicitud.identificacion.usos?.includes(u.key as any) ?? false;
    drawCheckItem(p1, fontRegular, fontBold, u.label, isChecked, usoX, y, 100);
    usoX += 108;
  });

  // 1.5 Áreas, Tipo Vivienda y BIC
  y -= 16;
  p1.drawText(cleanWinAnsi('1.5 Escala y Regulaciones Especiales:'), { x: 36, y, size: 7.5, font: fontBold, color: PRIMARY_COLOR });
  y -= 13;
  const areas: Array<{ key: string; label: string }> = [
    { key: 'MENOR_2000', label: '< 2.000 m2' },
    { key: 'MAYOR_IGUAL_2000', label: '>= 2.000 m2 (Ley 1796)' },
    { key: 'SUPERA_POR_AMPLIACION_2000', label: 'Supera 2.000 m2 por Ampl.' },
    { key: 'CINCO_O_MAS_VIVIENDA', label: '>= 5 Unidades Vivienda' }
  ];
  let arX = 36;
  areas.forEach((a) => {
    drawCheckItem(p1, fontRegular, fontBold, a.label, solicitud.identificacion.areaUnidadesConstruidas === a.key, arX, y, 130);
    arX += 135;
  });

  y -= 14;
  drawCheckItem(p1, fontRegular, fontBold, 'Vivienda Interés Prioritario (VIP)', solicitud.identificacion.tipoVivienda === 'VIP', 36, y, 160);
  drawCheckItem(p1, fontRegular, fontBold, 'Vivienda Interés Social (VIS)', solicitud.identificacion.tipoVivienda === 'VIS', 196, y, 160);
  drawCheckItem(p1, fontRegular, fontBold, 'No VIS', solicitud.identificacion.tipoVivienda === 'NO_VIS', 356, y, 80);
  drawCheckItem(p1, fontRegular, fontBold, 'Inmueble de Interés Cultural (BIC)', solicitud.identificacion.bienInteresCultural, 436, y, 140);

  // SECCIÓN 2: INFORMACIÓN SOBRE EL PREDIO
  y -= 22;
  y = drawSectionTitle(p1, fontBold, '2. INFORMACION SOBRE EL PREDIO OBJETO DE LA SOLICITUD', y, WIDTH);
  y -= 26;
  drawBoxField(p1, fontRegular, fontBold, 'Direccion Actual del Inmueble', solicitud.predio.direccionActual, 36, y, 310);
  drawBoxField(p1, fontRegular, fontBold, 'Direcciones Anteriores', solicitud.predio.direccionesAnteriores || 'NINGUNA', 350, y, 226);
  y -= 28;
  drawBoxField(p1, fontRegular, fontBold, 'Matricula Inmobiliaria', solicitud.predio.matriculaInmobiliaria, 36, y, 175);
  drawBoxField(p1, fontRegular, fontBold, 'Identificacion Catastral / CHIP', solicitud.predio.identificacionCatastral, 215, y, 185);
  drawBoxField(p1, fontRegular, fontBold, 'Clasificacion de Suelo', solicitud.predio.clasificacionSuelo, 404, y, 172);
  y -= 28;
  drawBoxField(p1, fontRegular, fontBold, 'Barrio / Urbanizacion', solicitud.predio.barrio || 'N/A', 36, y, 140);
  drawBoxField(p1, fontRegular, fontBold, 'Comuna / Localidad', solicitud.predio.comuna || 'N/A', 180, y, 140);
  drawBoxField(p1, fontRegular, fontBold, 'Estrato', solicitud.predio.estrato ? String(solicitud.predio.estrato) : 'N/A', 324, y, 60);
  drawBoxField(p1, fontRegular, fontBold, 'Manzana No.', solicitud.predio.manzanaNo || 'N/A', 388, y, 65);
  drawBoxField(p1, fontRegular, fontBold, 'Lote No.', solicitud.predio.loteNo || 'N/A', 457, y, 65);
  drawBoxField(p1, fontRegular, fontBold, 'Planimetria', solicitud.predio.planimetriaLote, 526, y, 50);

  // ============================================================================
  // PÁGINA 2: VECINOS, LINDEROS Y TITULARES
  // ============================================================================
  const p2 = doc.addPage([WIDTH, HEIGHT]);
  const ctx2: RenderContext = { doc, page: p2, fontRegular, fontBold, width: WIDTH, height: HEIGHT };
  drawHeader(ctx2, 2, 'VECINOS COLINDANTES, LINDEROS Y TITULARES');

  y = HEIGHT - 85;

  // SECCIÓN 3: INFORMACIÓN DE VECINOS COLINDANTES
  y = drawSectionTitle(p2, fontBold, '3. INFORMACION DE VECINOS COLINDANTES (HASTA 8 PREDIOS)', y, WIDTH);
  y -= 14;

  // Table header for Vecinos
  p2.drawRectangle({ x: 36, y: y - 2, width: WIDTH - 72, height: 14, color: PRIMARY_COLOR });
  p2.drawText('#', { x: 44, y: y + 2, size: 7, font: fontBold, color: rgb(1, 1, 1) });
  p2.drawText(cleanWinAnsi('DIRECCIÓN DEL PREDIO COLINDANTE'), { x: 75, y: y + 2, size: 7, font: fontBold, color: rgb(1, 1, 1) });
  p2.drawText(cleanWinAnsi('DIRECCIÓN DE CORRESPONDENCIA / NOTIFICACIÓN'), { x: 320, y: y + 2, size: 7, font: fontBold, color: rgb(1, 1, 1) });
  y -= 14;

  for (let i = 0; i < 8; i++) {
    const vecino = solicitud.vecinosColindantes?.[i];
    const isEven = i % 2 === 0;
    p2.drawRectangle({
      x: 36,
      y: y - 2,
      width: WIDTH - 72,
      height: 14,
      borderWidth: 0.5,
      borderColor: BORDER_COLOR,
      color: isEven ? rgb(1, 1, 1) : rgb(0.97, 0.98, 1)
    });
    p2.drawText(String(i + 1), { x: 44, y: y + 2, size: 7, font: fontBold, color: PRIMARY_COLOR });
    p2.drawText(cleanWinAnsi(vecino?.direccionPredio || '---'), { x: 75, y: y + 2, size: 7, font: fontRegular, color: TEXT_DARK });
    p2.drawText(cleanWinAnsi(vecino?.direccionCorrespondencia || '---'), { x: 320, y: y + 2, size: 7, font: fontRegular, color: TEXT_DARK });
    y -= 14;
  }

  // SECCIÓN 4: LINDEROS, DIMENSIONES Y ÁREAS
  y -= 10;
  y = drawSectionTitle(p2, fontBold, '4. LINDEROS, DIMENSIONES Y AREA TOTAL DEL PREDIO', y, WIDTH);
  y -= 26;
  drawBoxField(p2, fontRegular, fontBold, 'Lindero Norte (Longitud)', `${solicitud.linderos.norte.longitud} m`, 36, y, 140);
  drawBoxField(p2, fontRegular, fontBold, 'Colinda al Norte con', solicitud.linderos.norte.colindaCon, 180, y, 396);
  y -= 28;
  drawBoxField(p2, fontRegular, fontBold, 'Lindero Sur (Longitud)', `${solicitud.linderos.sur.longitud} m`, 36, y, 140);
  drawBoxField(p2, fontRegular, fontBold, 'Colinda al Sur con', solicitud.linderos.sur.colindaCon, 180, y, 396);
  y -= 28;
  drawBoxField(p2, fontRegular, fontBold, 'Lindero Oriente (Longitud)', `${solicitud.linderos.oriente.longitud} m`, 36, y, 140);
  drawBoxField(p2, fontRegular, fontBold, 'Colinda al Oriente con', solicitud.linderos.oriente.colindaCon, 180, y, 396);
  y -= 28;
  drawBoxField(p2, fontRegular, fontBold, 'Lindero Occidente (Longitud)', `${solicitud.linderos.occidente.longitud} m`, 36, y, 140);
  drawBoxField(p2, fontRegular, fontBold, 'Colinda al Occidente con', solicitud.linderos.occidente.colindaCon, 180, y, 396);
  y -= 28;
  drawBoxField(p2, fontRegular, fontBold, 'Area Total del Predio (m2)', `${solicitud.linderos.areaTotalPredio} m2`, 36, y, 220);
  drawBoxField(p2, fontRegular, fontBold, 'Constancia Juridica', 'Linderos acordes con titulo de propiedad y folio de matricula inmobiliaria', 260, y, 316);

  // SECCIÓN 5: TITULARES Y NOTIFICACIONES
  y -= 20;
  y = drawSectionTitle(p2, fontBold, '5. TITULARES DEL DERECHO DE DOMINIO Y AUTORIZACION', y, WIDTH);
  y -= 14;

  drawCheckItem(
    p2,
    fontRegular,
    fontBold,
    'Los titulares AUTORIZAN ser notificados electronicamente conforme al CPACA y Dec. 1077 de 2015.',
    solicitud.titularesAceptanNotificacionElectronica,
    36,
    y,
    WIDTH - 72
  );

  y -= 12;

  const titulares = solicitud.titulares || [];
  for (let i = 0; i < 4; i++) {
    const tit = titulares[i];
    y -= 36;
    p2.drawRectangle({
      x: 36,
      y,
      width: WIDTH - 72,
      height: 34,
      borderWidth: 0.6,
      borderColor: BORDER_COLOR,
      color: tit ? rgb(1, 1, 1) : rgb(0.98, 0.98, 0.98)
    });

    p2.drawText(cleanWinAnsi(`Titular ${i + 1}: ${tit ? tit.nombre : '(Casilla no utilizada)'}`), {
      x: 44,
      y: y + 22,
      size: 7.5,
      font: fontBold,
      color: tit ? PRIMARY_COLOR : TEXT_MUTED
    });

    if (tit) {
      p2.drawText(cleanWinAnsi(`CC/NIT: ${tit.ccNit}  |  Tel: ${tit.telefono}  |  Email: ${tit.correoElectronico}`), {
        x: 44,
        y: y + 10,
        size: 7,
        font: fontRegular,
        color: TEXT_DARK
      });
      // Signature line placeholder
      p2.drawLine({
        start: { x: WIDTH - 180, y: y + 8 },
        end: { x: WIDTH - 48, y: y + 8 },
        thickness: 0.6,
        color: TEXT_MUTED
      });
      p2.drawText('Firma del Titular', { x: WIDTH - 150, y: y + 1, size: 5.5, font: fontRegular, color: TEXT_MUTED });
    }
  }

  // ============================================================================
  // PÁGINA 3: PROFESIONALES RESPONSABLES Y RESPONSABLE DE LA SOLICITUD
  // ============================================================================
  const p3 = doc.addPage([WIDTH, HEIGHT]);
  const ctx3: RenderContext = { doc, page: p3, fontRegular, fontBold, width: WIDTH, height: HEIGHT };
  drawHeader(ctx3, 3, 'PROFESIONALES RESPONSABLES (LEY 1796 / NSR-10)');

  y = HEIGHT - 85;

  y = drawSectionTitle(p3, fontBold, '5.2 PROFESIONALES RESPONSABLES DEL PROYECTO', y, WIDTH);
  y -= 12;

  ROLES_PROFESIONALES.forEach((rol) => {
    const prof = solicitud.profesionales?.[rol.key];
    y -= 44;

    p3.drawRectangle({
      x: 36,
      y,
      width: WIDTH - 72,
      height: 42,
      borderWidth: 0.6,
      borderColor: prof ? PRIMARY_COLOR : BORDER_COLOR,
      color: prof ? rgb(1, 1, 1) : rgb(0.98, 0.98, 0.99)
    });

    // Rol title banner inside row
    p3.drawRectangle({
      x: 36,
      y: y + 29,
      width: WIDTH - 72,
      height: 13,
      color: SECONDARY_BG
    });

    p3.drawText(cleanWinAnsi(`${rol.label.toUpperCase()} (${rol.desc})`), {
      x: 42,
      y: y + 33,
      size: 6.5,
      font: fontBold,
      color: PRIMARY_COLOR
    });

    if (prof) {
      p3.drawText(cleanWinAnsi(`Nombre: ${prof.nombre}`), { x: 42, y: y + 17, size: 7, font: fontBold, color: TEXT_DARK });
      p3.drawText(cleanWinAnsi(`C.C.: ${prof.cedula}`), { x: 260, y: y + 17, size: 7, font: fontRegular, color: TEXT_DARK });
      p3.drawText(cleanWinAnsi(`Matricula Prof: ${prof.matriculaProfesional}`), { x: 370, y: y + 17, size: 7, font: fontRegular, color: TEXT_DARK });

      p3.drawText(cleanWinAnsi(`Tel: ${prof.telefono}  |  Email: ${prof.correoElectronico}`), {
        x: 42,
        y: y + 5,
        size: 6.5,
        font: fontRegular,
        color: TEXT_MUTED
      });

      if (prof.exigeSupervisionTecnica) {
        p3.drawText('[X] Exige Supervision Tecnica Continua en Obra (Ley 1796 de 2016)', {
          x: 310,
          y: y + 5,
          size: 6,
          font: fontBold,
          color: PRIMARY_COLOR
        });
      }
    } else {
      p3.drawText('No Aplica / No Designado para este tipo de tramite', {
        x: 42,
        y: y + 12,
        size: 7,
        font: fontRegular,
        color: TEXT_MUTED
      });
    }
  });

  // SECCIÓN 5.3 RESPONSABLE DE LA SOLICITUD
  y -= 14;
  y = drawSectionTitle(p3, fontBold, '5.3 RESPONSABLE DE LA SOLICITUD (APODERADO O MANDATARIO)', y, WIDTH);
  y -= 26;
  const resp = solicitud.responsableSolicitud;
  drawBoxField(p3, fontRegular, fontBold, 'Nombre Completo o Razon Social', resp.nombre, 36, y, 270);
  drawBoxField(p3, fontRegular, fontBold, 'Cedula de Ciudadania / NIT', resp.cedula, 310, y, 130);
  drawBoxField(p3, fontRegular, fontBold, 'Telefono de Contacto', resp.telefono, 444, y, 132);
  y -= 28;
  drawBoxField(p3, fontRegular, fontBold, 'Direccion de Correspondencia Fisica', resp.direccionCorrespondencia, 36, y, 310);
  drawBoxField(p3, fontRegular, fontBold, 'Correo Electronico para Notificaciones', resp.correoElectronico, 350, y, 226);

  y -= 16;
  drawCheckItem(
    p3,
    fontRegular,
    fontBold,
    'El responsable autoriza la notificacion electronica de todos los actos administrativos emitidos.',
    resp.aceptaNotificacionElectronica,
    36,
    y,
    WIDTH - 72
  );

  y -= 38;
  p3.drawLine({ start: { x: 36, y }, end: { x: 260, y }, thickness: 0.8, color: TEXT_DARK });
  p3.drawText('Firma del Responsable / Apoderado', { x: 36, y: y - 10, size: 7, font: fontBold, color: TEXT_DARK });
  p3.drawText(cleanWinAnsi(`C.C. ${resp.cedula}`), { x: 36, y: y - 19, size: 6.5, font: fontRegular, color: TEXT_MUTED });

  p3.drawLine({ start: { x: 320, y }, end: { x: WIDTH - 36, y }, thickness: 0.8, color: TEXT_DARK });
  p3.drawText('Sello y Radicador de Curaduria Urbana / Autoridad Competente', { x: 320, y: y - 10, size: 7, font: fontBold, color: PRIMARY_COLOR });
  p3.drawText('Fecha y Hora Oficial de Recepcion', { x: 320, y: y - 19, size: 6.5, font: fontRegular, color: TEXT_MUTED });

  // ============================================================================
  // PÁGINA 4: ANEXO DE CONSTRUCCIÓN SOSTENIBLE (RES. 0549/2015 Y 1051/2025)
  // ============================================================================
  const p4 = doc.addPage([WIDTH, HEIGHT]);
  const ctx4: RenderContext = { doc, page: p4, fontRegular, fontBold, width: WIDTH, height: HEIGHT };
  drawHeader(ctx4, 4, 'ANEXO DE CONSTRUCCION SOSTENIBLE');

  y = HEIGHT - 85;

  y = drawSectionTitle(p4, fontBold, 'ANEXO 1: PARAMETROS Y MEDIDAS DE CONSTRUCCION SOSTENIBLE', y, WIDTH);
  y -= 14;

  p4.drawText(cleanWinAnsi('Resolución 0549 de 2015 (Guía de Construcción Sostenible) reglamentada en el FUN Res. 1051 de 2025'), {
    x: 36,
    y,
    size: 7.5,
    font: fontRegular,
    color: TEXT_MUTED
  });

  // Zonificación Climática
  y -= 22;
  p4.drawText(cleanWinAnsi('Zonificación Climática Oficial del Proyecto:'), { x: 36, y, size: 7.5, font: fontBold, color: PRIMARY_COLOR });
  y -= 14;
  const zonas: Array<{ key: string; label: string }> = [
    { key: 'CALIDO_SECO', label: 'Cálido Seco' },
    { key: 'CALIDO_HUMEDO', label: 'Cálido Húmedo' },
    { key: 'TEMPLADO', label: 'Templado' },
    { key: 'FRIO', label: 'Frío' }
  ];
  let zX = 36;
  zonas.forEach((z) => {
    drawCheckItem(p4, fontRegular, fontBold, z.label, solicitud.anexoConstruccionSostenible?.zonificacionClimatica === z.key, zX, y, 120);
    zX += 135;
  });

  // Medidas Pasivas
  y -= 22;
  y = drawSectionTitle(p4, fontBold, 'A. MEDIDAS PASIVAS DE EFICIENCIA ENERGETICA Y CONFORT TERMICO', y, WIDTH);
  y -= 16;
  const pas = solicitud.anexoConstruccionSostenible?.medidasPasivas || ({} as any);
  drawCheckItem(p4, fontRegular, fontBold, 'Ventilación Natural Cruzada', !!pas.ventilacionNatural, 36, y, 180);
  drawCheckItem(p4, fontRegular, fontBold, 'Iluminación Natural Óptima', !!pas.iluminacionNatural, 220, y, 180);
  drawCheckItem(p4, fontRegular, fontBold, 'Orientación Solar Favorable', !!pas.orientacionSolar, 400, y, 160);
  y -= 16;
  drawCheckItem(p4, fontRegular, fontBold, 'Aleros, Sombrillas y Persianas', !!pas.alerosYSombrillas, 36, y, 180);
  drawCheckItem(p4, fontRegular, fontBold, 'Aislamiento Térmico en Envolvente', !!pas.aislamientoTermico, 220, y, 180);
  drawCheckItem(p4, fontRegular, fontBold, 'Aprovechamiento de Masa Térmica', !!pas.masaTermica, 400, y, 160);

  // Medidas Activas
  y -= 24;
  y = drawSectionTitle(p4, fontBold, 'B. MEDIDAS ACTIVAS Y SISTEMAS EFICIENTES', y, WIDTH);
  y -= 16;
  const act = solicitud.anexoConstruccionSostenible?.medidasActivas || ({} as any);
  drawCheckItem(p4, fontRegular, fontBold, 'Iluminación LED de Alta Eficiencia', !!act.iluminacionLedEficiente, 36, y, 180);
  drawCheckItem(p4, fontRegular, fontBold, 'Sensores de Ocupación / Presencia', !!act.sensoresPresencia, 220, y, 180);
  drawCheckItem(p4, fontRegular, fontBold, 'Climatización con Inverter / VRF', !!act.equiposClimatizacionInverter, 400, y, 160);
  y -= 16;
  drawCheckItem(p4, fontRegular, fontBold, 'Energía Solar Fotovoltaica', !!act.energiaSolarFotovoltaica, 36, y, 180);
  drawCheckItem(p4, fontRegular, fontBold, 'Colectores Solares Térmicos', !!act.colectoresSolaresTermicos, 220, y, 180);
  drawCheckItem(p4, fontRegular, fontBold, 'Griferías y Sanitarios de Bajo Consumo', !!act.griferiasAhorroAgua, 400, y, 160);
  y -= 16;
  drawCheckItem(p4, fontRegular, fontBold, 'Sistema de Captación y Reúso de Agua Lluvia', !!act.reusoAguaLluvia, 36, y, 300);

  // Ahorros esperados
  y -= 24;
  y = drawSectionTitle(p4, fontBold, 'C. PORCENTAJES DE AHORRO ESTIMADOS (RES. 0549 DE 2015)', y, WIDTH);
  y -= 26;
  drawBoxField(
    p4,
    fontRegular,
    fontBold,
    'Porcentaje Estimado de Ahorro en Agua',
    `${solicitud.anexoConstruccionSostenible?.porcentajeAhorroAguaEsperado || 0} % (Minimo exigido: 20%)`,
    36,
    y,
    260
  );
  drawBoxField(
    p4,
    fontRegular,
    fontBold,
    'Porcentaje Estimado de Ahorro en Energia',
    `${solicitud.anexoConstruccionSostenible?.porcentajeAhorroEnergiaEsperado || 0} % (Minimo exigido: 20%)`,
    306,
    y,
    270
  );

  // Descripción complementaria
  y -= 24;
  y = drawSectionTitle(p4, fontBold, 'D. MEMORIA Y JUSTIFICACION TECNICA DE CONSTRUCCION SOSTENIBLE', y, WIDTH);
  y -= 60;
  p4.drawRectangle({
    x: 36,
    y,
    width: WIDTH - 72,
    height: 56,
    borderWidth: 0.6,
    borderColor: BORDER_COLOR,
    color: rgb(1, 1, 1)
  });
  const rawDesc = solicitud.anexoConstruccionSostenible?.descripcionMedidasAdicionales || 'Se cumple con las especificaciones de la Guia de Construccion Sostenible adoptada por el Ministerio de Vivienda.';
  const desc = cleanWinAnsi(rawDesc);
  p4.drawText(desc.substring(0, 360), {
    x: 42,
    y: y + 42,
    size: 7,
    font: fontRegular,
    color: TEXT_DARK,
    maxWidth: WIDTH - 84,
    lineHeight: 10
  });

  // Firmas finales de responsabilidad técnica
  y -= 50;
  p4.drawLine({ start: { x: 36, y }, end: { x: 260, y }, thickness: 0.8, color: TEXT_DARK });
  p4.drawText('Firma del Diseñador / Profesional Especialista en Sostenibilidad', { x: 36, y: y - 10, size: 7, font: fontBold, color: TEXT_DARK });
  p4.drawText('Matrícula Profesional y Certificación Energética', { x: 36, y: y - 19, size: 6.5, font: fontRegular, color: TEXT_MUTED });

  p4.drawLine({ start: { x: 320, y }, end: { x: WIDTH - 36, y }, thickness: 0.8, color: TEXT_DARK });
  p4.drawText('Firma del Titular / Propietario del Proyecto', { x: 320, y: y - 10, size: 7, font: fontBold, color: PRIMARY_COLOR });
  p4.drawText('Aceptación de cumplimiento de estándares ambientales y urbanísticos', { x: 320, y: y - 19, size: 6.5, font: fontRegular, color: TEXT_MUTED });

  return await doc.save();
}
