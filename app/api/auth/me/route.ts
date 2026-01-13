import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "tu-secret-key-muy-seguro-cambiar-en-produccion";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    // Obtener usuario de la base de datos
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        avatar_url: true,
        is_active: true,
        role_id: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user || !user.is_active) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado o inactivo" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: user.roles.name,
      },
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json(
      { success: false, error: "Token inválido o expirado" },
      { status: 401 }
    );
  }
}
