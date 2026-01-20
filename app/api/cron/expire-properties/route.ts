import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cron Job: Expira propiedades que han cumplido su período de 30 días
 * 
 * Este endpoint debe ejecutarse diariamente para:
 * 1. Buscar propiedades con expires_at < now() y is_active = true
 * 2. Desactivarlas automáticamente
 * 3. Cambiar su publication_status a 'expired'
 * 
 * Configuración en vercel.json para ejecución automática
 */
export async function GET(request: Request) {
  try {
    // Verificar que la petición viene de Vercel Cron
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // En desarrollo, permitir sin secret
    if (process.env.NODE_ENV === "production" && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { success: false, error: "No autorizado" },
          { status: 401 }
        );
      }
    }

    const now = new Date();

    // Buscar propiedades expiradas que aún están activas
    const expiredProperties = await prisma.$executeRaw`
      UPDATE properties
      SET 
        is_active = false,
        publication_status = 'expired',
        updated_at = NOW()
      WHERE 
        expires_at IS NOT NULL 
        AND expires_at < ${now}
        AND is_active = true
        AND publication_status = 'active'
      RETURNING id, title, user_id, expires_at
    `;

    // Obtener detalles de las propiedades expiradas para logging
    const expiredCount = Array.isArray(expiredProperties) ? expiredProperties.length : 0;

    console.log(`[CRON] Propiedades expiradas: ${expiredCount}`);
    
    if (expiredCount > 0 && Array.isArray(expiredProperties)) {
      console.log('[CRON] Detalles:', expiredProperties);
    }

    return NextResponse.json({
      success: true,
      message: `Se expiraron ${expiredCount} propiedades`,
      expired_count: expiredCount,
      timestamp: now.toISOString(),
    });

  } catch (error) {
    console.error("[CRON ERROR] Error al expirar propiedades:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar propiedades expiradas",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

// También permitir POST para testing manual
export async function POST(request: Request) {
  return GET(request);
}
