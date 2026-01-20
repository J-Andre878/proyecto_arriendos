import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

interface PropertyCardProps {
  id: number;
  title: string;
  description: string | null;
  price_per_night: number;
  city: string | null;
  num_guests: number;
  num_rooms: number;
  num_beds: number;
  num_bathrooms: number;
  images: Array<{ id: number; image_url: string; is_main: boolean | null }>;
}

export default function PropertyCard({
  id,
  title,
  description,
  price_per_night,
  city,
  num_guests,
  num_rooms,
  num_beds,
  num_bathrooms,
  images,
}: PropertyCardProps) {
  const mainImage = images.find((img) => img.is_main) || images[0];

  return (
    <Link
      href={`/property/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-2xl"
    >
      {/* Imagen principal */}
      <div className="relative h-72 w-full overflow-hidden bg-gray-200">
        {/* Botón de favorito */}
        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton propertyId={id} />
        </div>

        {mainImage ? (
          <Image
            src={mainImage.image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <svg
              className="h-20 w-20 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        )}
        
        {/* Badge con cantidad de imágenes */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            {images.length} fotos
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        {/* Ubicación y título */}
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-500">{city || "Loja"}</p>
          <h3 className="mt-1 line-clamp-2 text-xl font-bold text-gray-900">
            {title}
          </h3>
        </div>

        {/* Descripción */}
        {description && (
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {description}
          </p>
        )}

        {/* Características */}
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{num_guests} huéspedes</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>{num_rooms} habitaciones</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21h18M4 18h16M6 15h12M8 12h8M10 9h4M12 6V3"
              />
            </svg>
            <span>{num_beds} camas</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <span>{num_bathrooms} baños</span>
          </div>
        </div>

        {/* Precio */}
        <div className="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              ${parseFloat(price_per_night.toString()).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">por noche</p>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Ver detalles
          </button>
        </div>
      </div>
    </Link>
  );
}
