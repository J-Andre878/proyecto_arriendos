import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Verificar rol
    const role = await prisma.roles.findUnique({
      where: { name: "user" }
    });
    
    // Contar usuarios
    const userCount = await prisma.users.count();
    
    // Listar usuarios
    const users = await prisma.users.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        auth_provider: true,
        is_active: true,
      }
    });
    
    return NextResponse.json({
      role: {
        exists: !!role,
        id: role?.id,
        name: role?.name
      },
      users: {
        total: userCount,
        list: users
      }
    });
    
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
