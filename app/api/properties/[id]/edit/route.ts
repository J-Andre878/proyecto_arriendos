import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { validatePhoneNumber, normalizePhoneNumber } from "@/lib/phoneValidation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const propertyId = parseInt(id);

    const body = await request.json();
    const {
      title,
      description,
      address,
      city,
      phones,
      num_guests,
      num_rooms,
      num_beds,
      num_bathrooms,
      price_per_night,
      property_type,
      images,
    } = body;

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
        { success: false, error: "No tienes permiso para editar esta propiedad" },
        { status: 403 }
      );
    }

    // Validaciones básicas
    if (!title || !description || !address || !price_per_night || !phones || !Array.isArray(phones) || phones.length === 0) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos (incluidos los teléfonos)" },
        { status: 400 }
      );
    }

    if (price_per_night <= 0) {
      return NextResponse.json(
        { success: false, error: "El precio debe ser mayor a 0" },
        { status: 400 }
      );
    }

    // Validar y normalizar teléfonos
    const normalizedPhones: string[] = [];
    for (const phone of phones) {
      const phoneValidation = validatePhoneNumber(phone);
      if (!phoneValidation.isValid) {
        return NextResponse.json(
          { success: false, error: phoneValidation.error || "Teléfono inválido" },
          { status: 400 }
        );
      }
      normalizedPhones.push(normalizePhoneNumber(phone));
    }

    // Actualizar el teléfono del usuario al primer número
    await prisma.users.update({
      where: { id: user.userId },
      data: { phone: normalizedPhones[0] },
    });

    // Actualizar la propiedad
    const updatedProperty = await prisma.properties.update({
      where: { id: propertyId },
      data: {
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
        updated_at: new Date(),
      },
      include: {
        property_images: {
          orderBy: { display_order: "asc" },
        },
      },
    });

    // Actualizar imágenes si se enviaron
    if (images && Array.isArray(images) && images.length > 0) {
      // Eliminar imágenes antiguas
      await prisma.property_images.deleteMany({
        where: { property_id: propertyId },
      });

      // Crear nuevas imágenes
      await prisma.property_images.createMany({
        data: images.map((img: { url: string }, index: number) => ({
          property_id: propertyId,
          image_url: img.url,
          is_main: index === 0,
          display_order: index + 1,
        })),
      });
    }

    // Actualizar teléfonos: eliminar antiguos y crear nuevos
    await prisma.property_phones.deleteMany({
      where: { property_id: propertyId },
    });

    await prisma.property_phones.createMany({
      data: normalizedPhones.map((phone, idx) => ({
        property_id: propertyId,
        phone_number: phone,
        is_primary: idx === 0,
      })),
    });

    return NextResponse.json({
      success: true,
      message: "Propiedad actualizada exitosamente",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error al actualizar propiedad:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la propiedad" },
      { status: 500 }
    );
  }
}
