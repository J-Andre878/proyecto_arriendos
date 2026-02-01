import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const guests = searchParams.get("guests");

    // Construir filtros dinámicos
    const where: any = {
      is_active: true,
      deleted_at: null,
    };

    if (city) {
      where.city = city;
    }

    if (minPrice || maxPrice) {
      where.price_per_night = {};
      if (minPrice) {
        where.price_per_night.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price_per_night.lte = parseFloat(maxPrice);
      }
    }

    if (guests) {
      where.num_guests = {
        gte: parseInt(guests),
      };
    }

    // Obtener propiedades con sus imágenes
    const properties = await prisma.properties.findMany({
      where,
      include: {
        property_images: {
          orderBy: [
            { is_main: "desc" },
            { display_order: "asc" },
          ],
          take: 5,
        },
        users: {
          select: {
            id: true,
            name: true,
            avatar_url: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      take: limit,
      skip: offset,
    });

    // Obtener el total de propiedades para paginación
    const total = await prisma.properties.count({
      where,
    });

    // Calcular rating promedio para cada propiedad
    const propertiesWithRating = properties.map(
      (property: typeof properties[number]) => {
        const ratings = property.reviews.map(
          (r: typeof property.reviews[number]) => Number(r.rating)
        );
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((sum: number, rating) => sum + rating, 0) / ratings.length
            : null;

        return {
          ...property,
          avg_rating: avgRating,
          total_reviews: ratings.length,
        };
      }
    );

    return NextResponse.json({
      success: true,
      data: propertiesWithRating,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al cargar las propiedades",
      },
      { status: 500 }
    );
  }
}
