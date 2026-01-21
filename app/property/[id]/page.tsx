import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import PropertyGalleryClient from "@/app/components/PropertyGalleryClient";
import Navbar from "@/app/components/Navbar";
import FavoriteButton from "@/app/components/FavoriteButton";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const propertyId = parseInt(id);

  // Obtener la propiedad con todas sus relaciones
  const property = await prisma.properties.findUnique({
    where: { id: propertyId },
    include: {
      property_images: {
        orderBy: [{ is_main: "desc" }, { display_order: "asc" }],
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar_url: true,
          created_at: true,
        },
      },
    },
  });

  if (!property || !property.is_active) {
    notFound();
  }

  const mainImage = property.property_images.find((img: typeof property.property_images[0]) => img.is_main) || property.property_images[0];
  const otherImages = property.property_images.filter((img: typeof property.property_images[0]) => !img.is_main);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
            <p className="mt-2 text-lg text-gray-600">
              📍 {property.city}
            </p>
          </div>
          {/* Botón de favorito */}
          <div className="ml-4">
            <FavoriteButton propertyId={propertyId} className="scale-125" />
          </div>
        </div>

        {/* Galería de imágenes con lightbox/slider al hacer clic */}
        <PropertyGalleryClient images={property.property_images} title={property.title} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Columna izquierda - Detalles */}
          <div className="lg:col-span-2">
            {/* Información básica */}
            <div className="rounded-lg bg-white p-6 shadow-md mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {property.property_type === "apartment" ? "Apartamento" : 
                 property.property_type === "house" ? "Casa" : 
                 property.property_type}
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col items-center rounded-lg border border-gray-200 p-4">
                  <span className="text-3xl">👥</span>
                  <span className="mt-2 text-sm text-gray-600">Huéspedes</span>
                  <span className="text-lg font-semibold">{property.num_guests}</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-gray-200 p-4">
                  <span className="text-3xl">🛏️</span>
                  <span className="mt-2 text-sm text-gray-600">Habitaciones</span>
                  <span className="text-lg font-semibold">{property.num_rooms}</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-gray-200 p-4">
                  <span className="text-3xl">🛌</span>
                  <span className="mt-2 text-sm text-gray-600">Camas</span>
                  <span className="text-lg font-semibold">{property.num_beds}</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-gray-200 p-4">
                  <span className="text-3xl">🚿</span>
                  <span className="mt-2 text-sm text-gray-600">Baños</span>
                  <span className="text-lg font-semibold">{property.num_bathrooms}</span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="rounded-lg bg-white p-6 shadow-md mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {property.description || "Sin descripción disponible."}
              </p>
            </div>

            {/* Ubicación */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ubicación</h2>
              <p className="text-gray-700">
                <span className="font-semibold">Dirección:</span> {property.address}
              </p>
              <p className="mt-2 text-gray-700">
                <span className="font-semibold">Ciudad:</span> {property.city}
              </p>
            </div>
          </div>

          {/* Columna derecha - Reserva y host */}
          <div className="lg:col-span-1">
            {/* Card de reserva */}
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow-lg border-2 border-gray-200">
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ${property.price_per_night.toString()}
                  </span>
                  <span className="ml-2 text-gray-600">por noche</span>
                </div>
              </div>

              <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 px-4 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition mb-4">
                Reservar
              </button>

              <p className="text-center text-sm text-gray-500">
                No se te cobrará todavía
              </p>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">${property.price_per_night.toString()} × 5 noches</span>
                  <span className="font-semibold">${(parseFloat(property.price_per_night.toString()) * 5).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Tarifa de servicio</span>
                  <span className="font-semibold">$15.00</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">${(parseFloat(property.price_per_night.toString()) * 5 + 15).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Información del host */}
            <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Anfitrión</h3>
              <div className="flex items-center">
                {property.users.avatar_url ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image
                      src={property.users.avatar_url}
                      alt={property.users.name || "Anfitrión"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
                    {property.users.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{property.users.name}</p>
                  <p className="text-sm text-gray-600">
                    Miembro desde{" "}
                    {property.users.created_at
                      ? new Date(property.users.created_at).getFullYear()
                      : "2024"}
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg border-2 border-gray-300 py-2 px-4 font-medium text-gray-700 hover:bg-gray-50 transition">
                Contactar al anfitrión
              </button>
            </div>
          </div>
        </div>

        {/* Aviso legal */}
        <div className="mt-12 rounded-lg bg-yellow-50 border border-yellow-200 p-6">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Nota importante:</strong> Esta es una plataforma de demostración. 
            La funcionalidad de reserva aún no está disponible. Ponte en contacto directamente 
            con el anfitrión para más información.
          </p>
        </div>
      </main>
    </div>
  );
}
