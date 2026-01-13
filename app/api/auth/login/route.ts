import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "tu-secret-key-muy-seguro-cambiar-en-produccion";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validaciones básicas
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: "Usuario inactivo. Contacta al administrador" },
        { status: 403 }
      );
    }

    // Verificar contraseña
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: "Este usuario usa autenticación externa" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roleId: user.role_id,
        roleName: user.roles.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Crear refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Guardar sesión en la base de datos
    await prisma.user_sessions.create({
      data: {
        user_id: user.id,
        token,
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        is_active: true,
      },
    });

    // Establecer cookies
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 días
      path: "/",
    });

    // Retornar datos del usuario (sin contraseña)
    const userData = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      avatar_url: user.avatar_url,
      role: user.roles.name,
    };

    return NextResponse.json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { success: false, error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
