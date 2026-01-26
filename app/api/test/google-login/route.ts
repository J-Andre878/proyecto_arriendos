import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/test/google-login
 * Simula un login con Google
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, image } = body;

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    console.log("\n=== TEST GOOGLE LOGIN ===");
    console.log("📧 Email:", email);
    console.log("👤 Nombre:", name);

    // 1. Verificar que el rol existe
    let userRole = await prisma.roles.findUnique({
      where: { name: "user" }
    });

    if (!userRole) {
      console.log("⚠️ Rol 'user' no existe, creando...");
      userRole = await prisma.roles.create({
        data: {
          name: "user",
          description: "Usuario normal"
        }
      });
      console.log("✅ Rol creado:", userRole.id);
    } else {
      console.log("✅ Rol existe:", userRole.id);
    }

    // 2. Verificar si el usuario existe
    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log("👤 Usuario existente:", existingUser.id);
      return NextResponse.json({
        status: "existing_user",
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          auth_provider: existingUser.auth_provider
        }
      });
    }

    // 3. Crear nuevo usuario
    console.log("📝 Creando nuevo usuario...");
    const newUser = await prisma.users.create({
      data: {
        email,
        name: name || "Usuario",
        surname: null,
        avatar_url: image || null,
        auth_provider: "google",
        role_id: userRole.id,
        is_active: true
      }
    });

    console.log("✅ Usuario creado:", newUser.id);
    console.log("======================\n");

    return NextResponse.json({
      status: "new_user_created",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        auth_provider: newUser.auth_provider
      }
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
