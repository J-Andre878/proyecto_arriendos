import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/favorites/check?propertyId=123
 * Verifica si una propiedad está en favoritos del usuario
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: true,
        isFavorite: false,
      });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: "propertyId requerido" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorites.findFirst({
      where: {
        user_id: user.userId,
        property_id: parseInt(propertyId),
      },
    });

    return NextResponse.json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Error al verificar favorito:", error);
    return NextResponse.json(
      { success: false, error: "Error al verificar favorito" },
      { status: 500 }
    );
  }
}
