import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, surname, email, phone, password } = body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Email inválido" },
        { status: 400 }
      );
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "El email ya está registrado" },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await prisma.users.create({
      data: {
        name,
        surname: surname || null,
        email,
        phone: phone || null,
        password: hashedPassword,
        auth_provider: "local",
        is_active: true,
        role_id: 1, // Rol por defecto (usuario normal)
      },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        avatar_url: true,
        created_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Usuario registrado exitosamente",
      user,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { success: false, error: "Error al registrar usuario" },
      { status: 500 }
    );
  }
}
