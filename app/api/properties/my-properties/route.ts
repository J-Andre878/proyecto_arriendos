import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/properties/my-properties
 * Obtiene todas las propiedades del usuario actual
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const properties = await prisma.properties.findMany({
      where: {
        user_id: user.userId,
        deleted_at: null,
      },
      include: {
        property_images: {
          orderBy: [{ is_main: "desc" }, { display_order: "asc" }],
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener propiedades" },
      { status: 500 }
    );
  }
}
