import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extraer parámetros de búsqueda
    const city = searchParams.get('city');
    const propertyType = searchParams.get('propertyType');
    const numGuests = searchParams.get('numGuests');
    const numRooms = searchParams.get('numRooms');
    const numBeds = searchParams.get('numBeds');
    const numBathrooms = searchParams.get('numBathrooms');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const amenities = searchParams.get('amenities'); // IDs separados por comas
    
    // Construir el objeto where dinámicamente
    const where: any = {
      is_active: true,
      deleted_at: null,
    };
    
    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive'
      };
    }
    
    if (propertyType) {
      where.property_type = propertyType;
    }
    
    if (numGuests) {
      where.num_guests = {
        gte: parseInt(numGuests)
      };
    }
    
    if (numRooms) {
      where.num_rooms = {
        gte: parseInt(numRooms)
      };
    }
    
    if (numBeds) {
      where.num_beds = {
        gte: parseInt(numBeds)
      };
    }
    
    if (numBathrooms) {
      where.num_bathrooms = {
        gte: parseInt(numBathrooms)
      };
    }
    
    if (minPrice || maxPrice) {
      where.price_per_night = {};
      if (minPrice) where.price_per_night.gte = parseFloat(minPrice);
      if (maxPrice) where.price_per_night.lte = parseFloat(maxPrice);
    }
    
    // Filtro por amenidades
    if (amenities) {
      const amenityIds = amenities.split(',').map(id => parseInt(id));
      where.property_amenities = {
        some: {
          amenity_id: {
            in: amenityIds
          }
        }
      };
    }
    
    // Buscar propiedades
    const properties = await prisma.properties.findMany({
      where,
      include: {
        property_images: {
          where: { is_main: true },
          take: 1
        },
        property_amenities: {
          include: {
            amenities: true
          }
        },
        users: {
          select: {
            name: true,
            surname: true,
            avatar_url: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    // Calcular rating promedio para cada propiedad
    const propertiesWithRating = properties.map((property: any) => ({
      ...property,
      averageRating: property.reviews.length > 0
        ? property.reviews.reduce((sum: number, r: any) => sum + Number(r.rating), 0) / property.reviews.length
        : 0,
      reviewCount: property.reviews.length
    }));
    
    return NextResponse.json({
      success: true,
      count: propertiesWithRating.length,
      data: propertiesWithRating
    });
    
  } catch (error) {
    console.error('Error searching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Error al buscar propiedades' },
      { status: 500 }
    );
  }
}