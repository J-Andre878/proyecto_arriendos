import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { validatePhoneNumber, normalizePhoneNumber } from "@/lib/phoneValidation";

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
      province,
      city,
      phones,
      num_guests,
      num_rooms,
      num_beds,
      num_bathrooms,
      price_per_night,
      property_type,
      images,
      amenities,
    } = body;


    // Validaciones básicas
    if (!title || !description || !address || !price_per_night || !phones || !Array.isArray(phones) || phones.length === 0) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos (incluidos los teléfonos)" },
        { status: 400 }
      );
    }

    // Validar que haya al menos una imagen
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: "Debe subir al menos una imagen para publicar" },
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

    // Actualizar el teléfono del usuario si no lo tiene
    // Verificar si el usuario ya tiene teléfono registrado
    const existingUser = await prisma.users.findUnique({
      where: { id: user.userId },
      select: { phone: true }
    });

    if (!existingUser?.phone && normalizedPhones.length > 0) {
      await prisma.users.update({
        where: { id: user.userId },
        data: { phone: normalizedPhones[0] },
      });
    }

    // Crear la propiedad como pendiente de pago
    const property = await prisma.properties.create({
      data: {
        user_id: user.userId,
        title,
        description,
        address,
        province: province || "Loja",
        city: city || "Sin especificar",
        num_guests: num_guests || 1,
        num_rooms: num_rooms || 1,
        num_beds: num_beds || 1,
        num_bathrooms: num_bathrooms || 1,
        price_per_night,
        property_type: property_type || "apartment",
        is_active: false, // No se activa hasta que se pague
        // publication_status lo maneja la BD con default 'draft'
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

    // Guardar teléfonos asociados a la propiedad
    await prisma.property_phones.createMany({
      data: normalizedPhones.map((phone, idx) => ({
        property_id: property.id,
        phone_number: phone,
        is_primary: idx === 0,
      })),
    });

    // Guardar imágenes si se enviaron
    if (images && Array.isArray(images) && images.length > 0) {
      await prisma.property_images.createMany({
        data: images.map((img: {url: string}, index: number) => ({
          property_id: property.id,
          image_url: img.url,
          is_main: index === 0, // Primera imagen es la principal
          display_order: index + 1,
        })),
      });
    }

    // Guardar amenidades si se enviaron
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      await prisma.property_amenities.createMany({
        data: amenities.map((amenity_id: number) => ({
          property_id: property.id,
          amenity_id,
        })),
        skipDuplicates: true, // Evitar duplicados si los hay
      });
    }

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
