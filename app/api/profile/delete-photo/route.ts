import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return Response.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Encontrar el usuario
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return Response.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar el usuario para eliminar la foto de perfil
    // Solo limpiar profile_image_url, avatar_url debe ser de Google OAuth y no tocarla
    await prisma.users.update({
      where: { id: user.id },
      data: { profile_image_url: null },
    });

    return Response.json({
      success: true,
      message: "Foto de perfil eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar foto de perfil:", error);
    return Response.json(
      { error: "Error al eliminar la foto de perfil" },
      { status: 500 }
    );
  }
}
