import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/favorites
 * Obtiene todos los favoritos del usuario actual
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

    const favorites = await prisma.favorites.findMany({
      where: { user_id: user.userId },
      include: {
        properties: {
          include: {
            property_images: {
              orderBy: [{ is_main: "desc" }, { display_order: "asc" }],
            },
            users: {
              select: {
                id: true,
                name: true,
                avatar_url: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({
      success: true,
      favorites: favorites.map((fav: any) => ({
        id: fav.id,
        property: fav.properties,
        created_at: fav.created_at,
      })),
    });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener favoritos" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Agrega una propiedad a favoritos
 * Body: { propertyId: number }
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: "propertyId requerido" },
        { status: 400 }
      );
    }

    // Verificar que la propiedad existe
    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Crear favorito (si ya existe, la BD retornará error por unique constraint)
    const favorite = await prisma.favorites.create({
      data: {
        user_id: user.userId,
        property_id: propertyId,
      },
    });

    return NextResponse.json({
      success: true,
      favorite,
      message: "Guardado exitosamente",
    });
  } catch (error: any) {
    // Si ya existe el favorito
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Ya está guardado" },
        { status: 409 }
      );
    }

    console.error("Error al agregar a favoritos:", error);
    return NextResponse.json(
      { success: false, error: "Error al agregar a favoritos" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites
 * Elimina una propiedad de favoritos
 * Body: { propertyId: number }
 */
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: "propertyId requerido" },
        { status: 400 }
      );
    }

    // Eliminar favorito
    await prisma.favorites.deleteMany({
      where: {
        user_id: user.userId,
        property_id: propertyId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Eliminado de guardados",
    });
  } catch (error) {
    console.error("Error al eliminar de favoritos:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar de favoritos" },
      { status: 500 }
    );
  }
}
