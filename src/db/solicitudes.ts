import { db } from './index.ts';
import { funSolicitudes } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getSolicitudes(userUid?: string) {
  try {
    if (userUid) {
      return await db.select().from(funSolicitudes).where(eq(funSolicitudes.userUid, userUid)).orderBy(desc(funSolicitudes.createdAt));
    }
    return await db.select().from(funSolicitudes).orderBy(desc(funSolicitudes.createdAt)).limit(50);
  } catch (error) {
    console.error('Error fetching solicitudes from Cloud SQL:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getSolicitudById(id: string) {
  try {
    const result = await db.select().from(funSolicitudes).where(eq(funSolicitudes.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error(`Error fetching solicitud ${id}:`, error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function saveSolicitud(data: {
  id: string;
  userId?: number;
  userUid?: string;
  radicacionNo?: string;
  autoridad?: string;
  departamento?: string;
  municipio?: string;
  fecha?: string;
  tipoTramite?: string;
  objetoTramite?: string;
  direccionPredio?: string;
  matriculaInmobiliaria?: string;
  identificacionCatastral?: string;
  clasificacionSuelo?: string;
  estado?: string;
  datos: any;
}) {
  try {
    const result = await db.insert(funSolicitudes)
      .values({
        id: data.id,
        userId: data.userId,
        userUid: data.userUid,
        radicacionNo: data.radicacionNo,
        autoridad: data.autoridad,
        departamento: data.departamento,
        municipio: data.municipio,
        fecha: data.fecha,
        tipoTramite: data.tipoTramite,
        objetoTramite: data.objetoTramite,
        direccionPredio: data.direccionPredio,
        matriculaInmobiliaria: data.matriculaInmobiliaria,
        identificacionCatastral: data.identificacionCatastral,
        clasificacionSuelo: data.clasificacionSuelo,
        estado: data.estado || 'RADICADA',
        datos: data.datos,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: funSolicitudes.id,
        set: {
          radicacionNo: data.radicacionNo,
          autoridad: data.autoridad,
          departamento: data.departamento,
          municipio: data.municipio,
          fecha: data.fecha,
          tipoTramite: data.tipoTramite,
          objetoTramite: data.objetoTramite,
          direccionPredio: data.direccionPredio,
          matriculaInmobiliaria: data.matriculaInmobiliaria,
          identificacionCatastral: data.identificacionCatastral,
          clasificacionSuelo: data.clasificacionSuelo,
          estado: data.estado || 'RADICADA',
          datos: data.datos,
          updatedAt: new Date(),
        }
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error saving solicitud in Cloud SQL:', error);
    throw new Error('Database insert failed. Please try again later.', { cause: error });
  }
}
