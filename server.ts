import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { funSolicitudSchema } from './src/utils/schemaValidation';
import { generarFunPdfBytes } from './src/utils/pdfGenerator';
import { GOOGLE_DB_SQL } from './src/utils/googleDbSql.ts';
import { EJEMPLO_FUN_BOGOTA } from './src/utils/colombiaData';
import { optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getSolicitudes, getSolicitudById, saveSolicitud } from './src/db/solicitudes.ts';
import { getOrCreateUser } from './src/db/users.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json({ limit: '10mb' }));

// Serve official FUN PDF template
app.use('/templates', express.static(path.resolve(__dirname, 'public/templates')));
app.get('/api/template-pdf', (_req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, 'public/templates/formulario_unico_nacional_res_1051.pdf');
  res.sendFile(filePath);
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Formulario Único Nacional (FUN) - Res. 1051 de 2025',
    database: 'Google Cloud SQL (PostgreSQL Free Tier)',
    timestamp: new Date().toISOString()
  });
});

// Return Google Cloud SQL DDL script
app.get('/api/google-sql', (_req: Request, res: Response) => {
  res.type('text/plain').send(GOOGLE_DB_SQL);
});

// Legacy backward-compatibility redirect for Supabase route
app.get('/api/supabase-sql', (_req: Request, res: Response) => {
  res.type('text/plain').send(GOOGLE_DB_SQL);
});

// List all saved requests from Google Cloud SQL
app.get('/api/solicitudes', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userUid = req.user?.uid;
    const solicitudes = await getSolicitudes(userUid);
    res.json({ count: solicitudes.length, data: solicitudes });
  } catch (err) {
    console.error('[FUN Server] Error listando solicitudes de Cloud SQL:', err);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Get single request by ID
app.get('/api/solicitudes/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const item = await getSolicitudById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json(item);
  } catch (err) {
    console.error(`[FUN Server] Error consultando solicitud ${req.params.id}:`, err);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Save or validate a FUN request in Google Cloud SQL
app.post('/api/solicitudes', optionalAuth, async (req: AuthRequest, res: Response) => {
  const parseResult = funSolicitudSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Error de validación según esquema FUN Res. 1051/2025',
      details: parseResult.error.errors
    });
  }

  const payload = parseResult.data;
  const id = (req.body.id as string) || `fun-${Date.now()}`;

  let dbUserId: number | undefined = undefined;
  const userUid = req.user?.uid;

  if (userUid && req.user?.email) {
    try {
      const dbUser = await getOrCreateUser(userUid, req.user.email);
      if (dbUser) {
        dbUserId = dbUser.id;
      }
    } catch (err) {
      console.warn('[FUN Server] Advertencia sincronizando usuario de Firebase en Cloud SQL:', err);
    }
  }

  try {
    const savedRecord = await saveSolicitud({
      id,
      userId: dbUserId,
      userUid,
      radicacionNo: payload.general.radicacionNo,
      autoridad: payload.general.autoridad,
      departamento: payload.general.departamento,
      municipio: payload.general.municipio,
      fecha: payload.general.fecha,
      tipoTramite: payload.identificacion.tipoTramite,
      objetoTramite: payload.identificacion.objetoTramite,
      direccionPredio: payload.predio.direccionActual,
      matriculaInmobiliaria: payload.predio.matriculaInmobiliaria,
      identificacionCatastral: payload.predio.identificacionCatastral,
      clasificacionSuelo: payload.predio.clasificacionSuelo,
      estado: 'RADICADA',
      datos: payload
    });

    res.status(201).json({
      message: 'Solicitud guardada con éxito en Google Cloud SQL',
      id,
      record: savedRecord
    });
  } catch (err: any) {
    console.error('[FUN Server] Error persistiendo en Cloud SQL:', err);
    res.status(500).json({
      error: 'Error persistiendo en base de datos Google Cloud SQL',
      details: err?.message
    });
  }
});

// Server-side PDF generation endpoint
app.post('/api/generate-pdf', async (req: Request, res: Response) => {
  try {
    const parseResult = funSolicitudSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Datos incompletos para generar el PDF oficial',
        details: parseResult.error.errors
      });
    }

    const pdfBytes = await generarFunPdfBytes(parseResult.data as any);
    const fileName = `FUN_${parseResult.data.general.municipio}_${parseResult.data.predio.matriculaInmobiliaria || 'solicitud'}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(Buffer.from(pdfBytes));
  } catch (err: any) {
    console.error('Error generando PDF en backend:', err);
    res.status(500).json({ error: 'Error interno generando PDF', details: err?.message });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: HOST, port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[FUN Server] Servidor activo en http://${HOST}:${PORT} (${isDev ? 'Desarrollo con Vite' : 'Producción'})`);
  });
}

startServer().catch((err) => {
  console.error('[FUN Server] Error iniciando servidor:', err);
});
