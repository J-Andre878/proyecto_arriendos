import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Verificar autenticación
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      address,
      city,
      num_guests,
      num_rooms,
      num_beds,
      num_bathrooms,
      price_per_night,
      property_type,
    } = body;

    // Validaciones básicas
    if (!title || !description || !address || !price_per_night) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    if (price_per_night <= 0) {
      return NextResponse.json(
        { success: false, error: "El precio debe ser mayor a 0" },
        { status: 400 }
      );
    }

    // Crear la propiedad
    const property = await prisma.properties.create({
      data: {
        user_id: user.userId,
        title,
        description,
        address,
        city: city || "Loja",
        num_guests: num_guests || 1,
        num_rooms: num_rooms || 1,
        num_beds: num_beds || 1,
        num_bathrooms: num_bathrooms || 1,
        price_per_night,
        property_type: property_type || "apartment",
        is_active: true,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Propiedad publicada exitosamente",
      property,
    });
  } catch (error) {
    console.error("Error al crear propiedad:", error);
    return NextResponse.json(
      { success: false, error: "Error al publicar la propiedad" },
      { status: 500 }
    );
  }
}
