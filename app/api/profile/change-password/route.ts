import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Validar que se proporcionaron los datos
    if (!newPassword) {
      return NextResponse.json(
        { error: "Por favor proporciona una nueva contraseña" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Obtener usuario
    const user = await prisma.users.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
        auth_provider: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Si el usuario se registró con Google y no tiene contraseña, permitir crear una
    if (!user.password && user.auth_provider === "google") {
      // Crear nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.users.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          auth_provider: "local", // Ahora puede usar email/password
        },
      });

      return NextResponse.json({
        success: true,
        message: "Contraseña creada exitosamente. Ahora puedes iniciar sesión con email y contraseña.",
      });
    }

    // Si el usuario tiene contraseña, verificar la actual
    if (!user.password) {
      return NextResponse.json(
        { error: "No tienes una contraseña configurada. Por favor contacta al soporte." },
        { status: 400 }
      );
    }

    // Verificar contraseña actual
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Por favor proporciona tu contraseña actual" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta" },
        { status: 401 }
      );
    }

    // Hash nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await prisma.users.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Error al cambiar contraseña" },
      { status: 500 }
    );
  }
}
