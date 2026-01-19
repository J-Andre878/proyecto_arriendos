import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const propertyId = parseInt(params.id);
    
    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
      include: {
        property_images: {
          orderBy: { display_order: 'asc' }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    // Solo el dueño puede ver propiedades pending_payment
    if (property.user_id !== user.userId && property.publication_status !== "active") {
      return NextResponse.json(
        { success: false, error: "No tienes permiso para ver esta propiedad" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Error al obtener propiedad:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener la propiedad" },
      { status: 500 }
    );
  }
}
