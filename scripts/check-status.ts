import { prisma } from "@/lib/prisma";

async function checkStatus() {
  try {
    // Verificar rol
    const role = await prisma.roles.findUnique({
      where: { name: "user" }
    });
    
    console.log("✓ Rol 'user':", role ? `Existe (ID: ${role.id})` : "No existe");
    
    // Contar usuarios
    const userCount = await prisma.users.count();
    console.log("✓ Total de usuarios:", userCount);
    
    // Listar usuarios
    const users = await prisma.users.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        auth_provider: true,
        is_active: true,
      }
    });
    
    console.log("\n📋 Usuarios registrados:");
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.auth_provider}) - Activo: ${u.is_active}`);
    });
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatus();
