import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const amenities = await prisma.amenities.findMany({
      orderBy: [
        { category: "asc" },
        { name: "asc" }
      ],
    });

    return NextResponse.json({
      success: true,
      amenities: amenities,
    });
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener amenidades" },
      { status: 500 }
    );
  }
}
