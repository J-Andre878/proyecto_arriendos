"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertyCard";

interface Property {
  id: number;
  title: string;
  description: string | null;
  price_per_night: string;
  province: string | null;
  city: string | null;
  num_guests: number;
  num_rooms: number;
  num_beds: number;
  num_bathrooms: number;
  property_images: Array<{
    id: number;
    image_url: string;
    is_main: boolean | null;
  }>;
}

interface Favorite {
  id: number;
  property: Property;
  created_at: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Si no está autenticado, redirigir a login
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadFavorites();
    }
  }, [status, router]);

  const loadFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      const data = await response.json();

      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error("Error al cargar guardados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600">Cargando guardados...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-900/50 pb-20 pt-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-white">
              Guardados
            </h1>
            <p className="text-gray-400">
              Propiedades que has guardado para ver más tarde
            </p>
          </div>

          {/* Contenido */}
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm p-12 text-center shadow-lg">
              <svg
                className="mb-4 h-24 w-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
              <h2 className="mb-2 text-2xl font-semibold text-white">
                No tienes propiedades guardadas aún
              </h2>
              <p className="mb-6 text-gray-400">
                Explora propiedades y guarda las que te gusten haciendo clic en
                el ícono de guardado
              </p>
              <button
                onClick={() => router.push("/")}
                className="rounded-xl bg-purple-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-purple-700"
              >
                Explorar Propiedades
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">
                {favorites.length}{" "}
                {favorites.length === 1 ? "propiedad guardada" : "propiedades guardadas"}
              </div>

              {/* Grid de propiedades favoritas */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favorites.map((favorite) => (
                  <PropertyCard
                    key={favorite.id}
                    id={favorite.property.id}
                    title={favorite.property.title}
                    description={favorite.property.description}
                    price_per_night={parseFloat(favorite.property.price_per_night)}
                    province={favorite.property.province}
                    city={favorite.property.city}
                    num_guests={favorite.property.num_guests}
                    num_rooms={favorite.property.num_rooms}
                    num_beds={favorite.property.num_beds}
                    num_bathrooms={favorite.property.num_bathrooms}
                    images={favorite.property.property_images}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
