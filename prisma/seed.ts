const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Crear roles por defecto
  const roles = [
    { name: 'user', description: 'Usuario regular' },
    { name: 'host', description: 'Anfitrión de propiedades' },
    { name: 'admin', description: 'Administrador del sistema' },
  ]

  for (const role of roles) {
    const existingRole = await prisma.roles.findUnique({
      where: { name: role.name },
    })

    if (!existingRole) {
      await prisma.roles.create({
        data: role,
      })
      console.log(`Rol creado: ${role.name}`)
    } else {
      console.log(`Rol ya existe: ${role.name}`)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
