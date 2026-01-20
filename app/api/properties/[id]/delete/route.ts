import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/properties/[id]/delete
 * Elimina (soft delete) una propiedad del usuario
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const propertyId = parseInt(id);

    // Verificar que la propiedad existe y pertenece al usuario
    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    if (property.user_id !== user.userId) {
      return NextResponse.json(
        { success: false, error: "No tienes permiso para eliminar esta propiedad" },
        { status: 403 }
      );
    }

    // Soft delete
    await prisma.properties.update({
      where: { id: propertyId },
      data: {
        deleted_at: new Date(),
        is_active: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Propiedad eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar propiedad" },
      { status: 500 }
    );
  }
}
