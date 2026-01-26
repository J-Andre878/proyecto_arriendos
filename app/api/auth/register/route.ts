import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { validatePhoneNumber, normalizePhoneNumber } from "@/lib/phoneValidation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, surname, email, phone, password } = body;

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Validar teléfono si se proporciona
    let normalizedPhone = null;
    if (phone && phone.trim()) {
      const phoneValidation = validatePhoneNumber(phone);
      if (!phoneValidation.isValid) {
        return NextResponse.json(
          { success: false, error: phoneValidation.error },
          { status: 400 }
        );
      }
      normalizedPhone = normalizePhoneNumber(phone);
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Este email ya está registrado" },
        { status: 400 }
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Obtener el rol de usuario (user), o crearlo si no existe
    let userRole = await prisma.roles.findUnique({
      where: { name: "user" },
    });

    if (!userRole) {
      // Crear el rol si no existe
      userRole = await prisma.roles.create({
        data: {
          name: "user",
          description: "Usuario normal",
        },
      });
    }

    // Crear usuario
    const user = await prisma.users.create({
      data: {
        name,
        surname: surname || null,
        email,
        phone: normalizedPhone,
        password: hashedPassword,
        auth_provider: "local",
        role_id: userRole.id,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
