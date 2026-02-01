import PropertyCard from "./components/PropertyCard";
import Navbar from "./components/Navbar";
import { prisma } from "@/lib/prisma";
import SearchBar from "./components/SearchBar";

export default async function Home() {
  // Obtener propiedades activas con sus imágenes (máximo 30 días)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const properties = await prisma.properties.findMany({
    where: {
      is_active: true,
      deleted_at: null,
      published_at: {
        gte: thirtyDaysAgo, // Publicadas en los últimos 30 días
      },
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
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Navbar */}
      <Navbar />

      {/* Header / Hero Section */}
      <header className="bg-gradient-to-br from-purple-600 via-violet-600 to-cyan-500 dark:from-gray-900 dark:via-purple-950 dark:to-cyan-900 text-white">
        <div className="mx-auto max-w-[92.5rem] px-3 py-16 sm:px-4 lg:px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-white to-purple-100 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
              Havela
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-purple-100 dark:text-purple-200">
              🌎 <span className="font-semibold">Arriendos de todo el Ecuador</span>
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-purple-100 dark:text-purple-200">
              Encuentra tu alojamiento perfecto en cualquier provincia. Espacios únicos,
              experiencias inolvidables.
            </p>

            {/* Barra de búsqueda */}
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[92.5rem] px-3 py-12 sm:px-4 lg:px-6">
        {/* Título de sección */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Propiedades Disponibles
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Arriendos disponibles en {properties.length} propiedades
          </p>
        </div>

        {/* Grid de propiedades */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property: typeof properties[number]) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                description={property.description}
                price_per_night={Number(property.price_per_night)}
                province={property.province}
                city={property.city}
                num_guests={property.num_guests}
                num_rooms={property.num_rooms}
                num_beds={property.num_beds}
                num_bathrooms={property.num_bathrooms}
                images={property.property_images.map(
                  (img: typeof property.property_images[number]) => ({
                    id: img.id,
                    image_url: img.image_url,
                    is_main: img.is_main,
                  })
                )}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              className="h-24 w-24 text-gray-300 dark:text-gray-700"
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
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              No hay propiedades disponibles
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Vuelve pronto para ver nuevas propiedades
            </p>
          </div>
        )}
      </main>


    </div>
  );
}
