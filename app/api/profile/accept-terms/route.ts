import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Actualizar usuario para marcar que aceptó términos
    const user = await prisma.users.update({
      where: { email: session.user.email },
      data: { accepted_terms: true },
    });

    return NextResponse.json({
      success: true,
      message: "Términos aceptados correctamente",
    });
  } catch (error) {
    console.error("Error accepting terms:", error);
    return NextResponse.json(
      { error: "Error al aceptar términos" },
      { status: 500 }
    );
  }
}
