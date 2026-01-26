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
          phone: true,
          avatar_url: true,
          created_at: true,
        },
      },
      property_phones: {
        orderBy: [{ is_primary: "desc" }, { id: "asc" }],
      },
    },
  });

  if (!property || !property.is_active) {
    notFound();
  }

  const mainImage = property.property_images.find((img: typeof property.property_images[0]) => img.is_main) || property.property_images[0];
  const otherImages = property.property_images.filter((img: typeof property.property_images[0]) => !img.is_main);

  return (
    <div className="min-h-screen bg-gray-900/50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white">{property.title}</h1>
            <p className="mt-2 text-lg text-gray-300">
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
            <div className="rounded-lg bg-white/10 p-6 shadow-md mb-6">
              <h2 className="text-2xl font-bold text-white mb-4\">
                {property.property_type === "apartment" ? "Apartamento" : 
                 property.property_type === "house" ? "Casa" : 
                 property.property_type}
              </h2>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col items-center rounded-lg border border-purple-500/30 p-4 bg-gradient-to-br from-purple-950 to-purple-900">
                  <span className="text-3xl">👥</span>
                  <span className="mt-2 text-base font-bold text-gray-300">Huéspedes</span>
                  <span className="text-2xl font-bold text-white">{property.num_guests}</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-green-500/30 p-4 bg-gradient-to-br from-green-950 to-green-900">
                  <span className="text-3xl">🛏️</span>
                  <span className="mt-2 text-base font-bold text-gray-300">Habitaciones</span>
                  <span className="text-2xl font-bold text-white">{property.num_rooms}</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-purple-500/30 p-4 bg-gradient-to-br from-purple-950 to-purple-900">
                  <span className="text-3xl">🛌</span>
                  <span className="mt-2 text-base font-bold text-gray-300">Camas</span>
                  <span className="text-2xl font-bold text-white">{property.num_beds}</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-orange-500/30 p-4 bg-gradient-to-br from-orange-950 to-orange-900">
                  <span className="text-3xl">🚿</span>
                  <span className="mt-2 text-base font-bold text-gray-300">Baños</span>
                  <span className="text-2xl font-bold text-white">{property.num_bathrooms}</span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="rounded-lg bg-white/10 p-6 shadow-md mb-6\">
              <h2 className="text-2xl font-bold text-white mb-4">Descripción</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {property.description || "Sin descripción disponible."}
              </p>
            </div>

            {/* Ubicación */}
            <div className="rounded-lg bg-white/10 p-6 shadow-md">
              <h2 className="text-2xl font-bold text-white mb-4">Ubicación</h2>
              <p className="text-gray-300">
                <span className="font-semibold">Dirección:</span> {property.address}
              </p>
              <p className="mt-2 text-gray-300">
                <span className="font-semibold">Ciudad:</span> {property.city}
              </p>
            </div>
          </div>

          {/* Columna derecha - Información de contacto */}
          <div className="lg:col-span-1">
            {/* Card de contacto */}
            <div className="rounded-lg bg-white/10 p-6 shadow-lg border-2 border-purple-500/30">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  ${property.price_per_night.toString()}
                </h3>
                <p className="text-gray-300">por noche</p>
              </div>

              {/* Teléfonos de contacto */}
              {property.property_phones && property.property_phones.length > 0 && (
                <div className="space-y-2 mb-3">
                  {property.property_phones.map((phoneObj, idx) => (
                    <div key={phoneObj.id} className="flex flex-col gap-1 border border-purple-500/30 rounded-lg p-2 bg-purple-950/50">
                      <span className="text-xs text-purple-400 font-semibold">
                        {phoneObj.is_primary ? "Teléfono principal" : `Teléfono ${idx + 1}`}
                      </span>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${phoneObj.phone_number}`}
                          className="flex-1 flex items-center justify-center rounded bg-gradient-to-r from-green-600 to-emerald-600 py-2 px-3 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition"
                        >
                          📞 Llamar
                        </a>
                        <a
                          href={`https://wa.me/593${phoneObj.phone_number.replace(/^0/, '')}?text=Hola, estoy interesado en tu propiedad: ${property.title}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center rounded bg-gradient-to-r from-green-500 to-teal-500 py-2 px-3 text-white font-semibold hover:from-green-600 hover:to-teal-600 transition"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                      <span className="text-purple-300 font-mono text-sm text-center">{phoneObj.phone_number}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón Email */}
              {property.users.email && (
                <a 
                  href={`mailto:${property.users.email}?subject=Consulta sobre: ${property.title}`}
                  className="flex items-center justify-center w-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 py-3 px-4 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition"
                >
                  ✉️ Enviar Email
                </a>
              )}

              <p className="mt-4 text-center text-sm text-gray-300 bg-purple-950/50 p-3 rounded">
                ℹ️ Contacta directamente con el propietario para conocer disponibilidad y detalles.
              </p>
            </div>

            {/* Información del host */}
            <div className="mt-6 rounded-lg bg-white/10 p-6 shadow-md">
              <h3 className="text-xl font-bold text-white mb-4">Anfitrión</h3>
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white text-2xl font-bold">
                    {property.users.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
                <div className="ml-4">
                  <p className="font-semibold text-white">{property.users.name}</p>
                  <p className="text-sm text-gray-300">
                    Miembro desde{" "}
                    {property.users.created_at
                      ? new Date(property.users.created_at).getFullYear()
                      : "2024"}
                  </p>
                </div>
              </div>
              
              {/* Información de contacto */}
              <div className="mt-4 space-y-3">
                {property.users.email && (
                  <div className="flex items-center rounded-lg bg-gray-800/50 p-3">
                    <span className="mr-3 text-lg">✉️</span>
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="font-medium text-white">{property.users.email}</p>
                    </div>
                  </div>
                )}
                
                {property.property_phones && property.property_phones.length > 0 && (
                  <div className="space-y-2">
                    {property.property_phones.map((phoneObj, idx) => (
                      <div key={phoneObj.id} className="flex items-center rounded-lg bg-purple-950/50 p-3 border border-purple-500/30">
                        <span className="mr-3 text-lg">📱</span>
                        <div>
                          <p className="text-xs text-purple-400 font-semibold">
                            {phoneObj.is_primary ? "Teléfono principal" : `Teléfono ${idx + 1}`}
                          </p>
                          <a
                            href={`tel:${phoneObj.phone_number}`}
                            className="font-medium text-purple-400 hover:text-purple-300 hover:underline"
                          >
                            {phoneObj.phone_number}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Aviso legal */}
        <div className="mt-12 rounded-lg bg-purple-950/50 border border-purple-500/30 p-6">
          <p className="text-sm text-purple-300">
            ℹ️ <strong>Información importante:</strong> Esta plataforma conecta a propietarios e interesados. 
            Puedes contactar directamente al propietario usando los números de teléfono o email disponibles. 
            Asegúrate de acordar los términos directamente con el anfitrión.
          </p>
        </div>
      </main>
    </div>
  );
}
