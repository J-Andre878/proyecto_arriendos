import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const property = await prisma.properties.findUnique({
      where: { id: propertyId },
      include: {
        property_images: {
          orderBy: { display_order: 'asc' }
        },
        property_phones: {
          orderBy: [{ is_primary: "desc" }, { id: "asc" }]
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
    const pubStatus = (property as any).publication_status;
    if (property.user_id !== user.userId && pubStatus !== "active") {
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
