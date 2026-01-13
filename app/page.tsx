import PropertyCard from "./components/PropertyCard";
import Navbar from "./components/Navbar";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Obtener propiedades activas con sus imágenes
  const properties = await prisma.properties.findMany({
    where: {
      is_active: true,
      deleted_at: null,
    },
    include: {
      property_images: {
        orderBy: [{ is_main: "desc" }, { display_order: "asc" }],
        take: 5,
      },
      users: {
        select: {
          id: true,
          name: true,
          avatar_url: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
    take: 12,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navbar */}
      <Navbar />

      {/* Header / Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Arriendos Loja
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100">
              Encuentra tu alojamiento perfecto en Loja. Espacios únicos,
              experiencias inolvidables.
            </p>

            {/* Barra de búsqueda básica */}
            <div className="mx-auto mt-10 max-w-4xl">
              <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-2xl sm:flex-row sm:items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="¿A dónde vas?"
                    className="w-full rounded-lg border-0 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    className="w-full rounded-lg border-0 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <select className="w-full rounded-lg border-0 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Huéspedes</option>
                    <option>1 huésped</option>
                    <option>2 huéspedes</option>
                    <option>3 huéspedes</option>
                    <option>4+ huéspedes</option>
                  </select>
                </div>
                <button className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Título de sección */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Propiedades Disponibles
          </h2>
          <p className="mt-2 text-gray-600">
            {properties.length} alojamientos encontrados en Loja
          </p>
        </div>

        {/* Grid de propiedades */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                description={property.description}
                price_per_night={Number(property.price_per_night)}
                city={property.city}
                num_guests={property.num_guests}
                num_rooms={property.num_rooms}
                num_beds={property.num_beds}
                num_bathrooms={property.num_bathrooms}
                images={property.property_images.map((img) => ({
                  id: img.id,
                  image_url: img.image_url,
                  is_main: img.is_main,
                }))}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="h-24 w-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              No hay propiedades disponibles
            </h3>
            <p className="mt-2 text-gray-600">
              Vuelve pronto para ver nuevas propiedades
            </p>
          </div>
        )}
      </main>

      {/* Footer simple */}
      <footer className="mt-20 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2026 Arriendos Loja. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
