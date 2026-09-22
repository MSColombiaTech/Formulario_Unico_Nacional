import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { funSolicitudSchema } from './src/utils/schemaValidation';
import { generarFunPdfBytes } from './src/utils/pdfGenerator';
import { SUPABASE_MIGRATION_SQL } from './src/utils/supabaseSql';
import { EJEMPLO_FUN_BOGOTA } from './src/utils/colombiaData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json({ limit: '10mb' }));

// In-memory store for FUN requests
const solicitudesStore = new Map<string, any>();
// Seed with Bogotá sample
solicitudesStore.set('ejemplo-bogota', {
  id: 'ejemplo-bogota',
  createdAt: new Date().toISOString(),
  ...EJEMPLO_FUN_BOGOTA
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'Formulario Único Nacional (FUN) - Res. 1051 de 2025',
    timestamp: new Date().toISOString()
  });
});

// Return Supabase DDL migration script
app.get('/api/supabase-sql', (_req: Request, res: Response) => {
  res.type('text/plain').send(SUPABASE_MIGRATION_SQL);
});

// List all saved requests
app.get('/api/solicitudes', (_req: Request, res: Response) => {
  const all = Array.from(solicitudesStore.values());
  res.json({ count: all.length, data: all });
});

// Save or validate a FUN request
app.post('/api/solicitudes', (req: Request, res: Response) => {
  const parseResult = funSolicitudSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Error de validación según esquema FUN Res. 1051/2025',
      details: parseResult.error.errors
    });
  }

  const id = req.body.id || `fun-${Date.now()}`;
  const record = {
    id,
    createdAt: new Date().toISOString(),
    ...parseResult.data
  };
  solicitudesStore.set(id, record);

  res.status(201).json({
    message: 'Solicitud guardada con éxito',
    id,
    record
  });
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
