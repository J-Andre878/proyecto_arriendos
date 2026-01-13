import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu-secret-key-muy-seguro-cambiar-en-produccion";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        // Decodificar token para obtener el userId
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

        // Desactivar la sesión en la base de datos
        await prisma.user_sessions.updateMany({
          where: {
            user_id: decoded.userId,
            token,
          },
          data: {
            is_active: false,
          },
        });
      } catch (error) {
        console.error("Error al invalidar sesión:", error);
      }
    }

    // Eliminar cookies
    cookieStore.delete("token");
    cookieStore.delete("refreshToken");

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { success: false, error: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
