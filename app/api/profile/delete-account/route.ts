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

    // Eliminar favoritos del usuario
    await prisma.favorites.deleteMany({
      where: { user_id: user.id },
    });

    // Eliminar propiedades (las imágenes, amenidades y teléfonos se eliminan en cascada)
    await prisma.properties.deleteMany({
      where: { user_id: user.id },
    });

    // Finalmente, eliminar el usuario
    await prisma.users.delete({
      where: { id: user.id },
    });

    return Response.json({
      success: true,
      message: "Cuenta eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    return Response.json(
      { error: "Error al eliminar la cuenta" },
      { status: 500 }
    );
  }
}
