"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";

interface Property {
  id: number;
  title: string;
  description: string | null;
  price_per_night: string;
  city: string | null;
  is_active: boolean | null;
  publication_status: string | null;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  property_images: Array<{
    id: number;
    image_url: string;
    is_main: boolean | null;
  }>;
  property_subscriptions: Array<{
    id: number;
    status: string | null;
    expires_at: string | null;
  }>;
}

export default function MyPropertiesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      loadProperties();
    }
  }, [status, router]);

  const loadProperties = async () => {
    try {
      const response = await fetch("/api/properties/my-properties");
      const data = await response.json();

      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Error al cargar propiedades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (propertyId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta propiedad?")) {
      return;
    }

    setDeletingId(propertyId);

    try {
      const response = await fetch(`/api/properties/${propertyId}/delete`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        // Recargar la lista
        loadProperties();
      } else {
        alert(data.error || "Error al eliminar propiedad");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar propiedad");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (property: Property) => {
    const now = new Date();
    const expiresAt = property.expires_at ? new Date(property.expires_at) : null;

    if (!property.is_active && property.publication_status === "draft") {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
          📝 Borrador - Pendiente de pago
        </span>
      );
    }

    if (expiresAt && expiresAt < now) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
          ⏰ Expirada
        </span>
      );
    }

    if (property.is_active && property.publication_status === "active") {
      const daysLeft = expiresAt
        ? Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
          ✅ Activa {daysLeft && `(${daysLeft} días restantes)`}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
        Inactiva
      </span>
    );
  };

  if (status === "loading" || isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-400">Cargando propiedades...</p>
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">
                Mis Propiedades
              </h1>
              <p className="text-gray-400">
                Administra tus publicaciones y verifica su estado
              </p>
            </div>
            <Link
              href="/publish"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-semibold text-white transition-colors hover:from-purple-700 hover:to-cyan-600"
            >
              + Nueva Propiedad
            </Link>
          </div>

          {/* Contenido */}
          {properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-12 text-center shadow-lg">
              <svg
                className="mb-4 h-24 w-24 text-gray-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <h2 className="mb-2 text-2xl font-semibold text-white">
                No tienes propiedades publicadas
              </h2>
              <p className="mb-6 text-gray-400">
                Crea tu primera propiedad y comienza a recibir reservas
              </p>
              <Link
                href="/publish"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-3 font-semibold text-white transition-colors hover:from-purple-700 hover:to-cyan-600"
              >
                Publicar Propiedad
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-400">
                {properties.length}{" "}
                {properties.length === 1 ? "propiedad" : "propiedades"}
              </div>

              {/* Lista de propiedades */}
              <div className="space-y-6">
                {properties.map((property) => {
                  const mainImage =
                    property.property_images.find((img) => img.is_main) ||
                    property.property_images[0];

                  return (
                    <div
                      key={property.id}
                      className="flex flex-col overflow-hidden rounded-2xl bg-white/10 shadow-lg transition-shadow hover:shadow-xl md:flex-row"
                    >
                      {/* Imagen */}
                      <div className="relative h-64 w-full md:h-auto md:w-80">
                        {mainImage ? (
                          <Image
                            src={mainImage.image_url}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <svg
                              className="h-20 w-20 text-gray-400"
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
                      </div>

                      {/* Contenido */}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="mb-2 text-2xl font-bold text-white">
                              {property.title}
                            </h3>
                            <p className="mb-2 text-gray-400">
                              📍 {property.city || "Sin ubicación"}
                            </p>
                            <p className="text-2xl font-bold text-purple-400">
                              ${parseFloat(property.price_per_night).toFixed(2)}
                              <span className="text-sm font-normal text-gray-400">
                                {" "}
                                / noche
                              </span>
                            </p>
                          </div>
                          <div>{getStatusBadge(property)}</div>
                        </div>

                        {/* Descripción */}
                        {property.description && (
                          <p className="mb-4 line-clamp-2 text-gray-300">
                            {property.description}
                          </p>
                        )}

                        {/* Fechas */}
                        <div className="mb-4 text-sm text-gray-400">
                          <p>
                            Creada:{" "}
                            {new Date(property.created_at).toLocaleDateString(
                              "es-ES"
                            )}
                          </p>
                          {property.published_at && (
                            <p>
                              Publicada:{" "}
                              {new Date(property.published_at).toLocaleDateString(
                                "es-ES"
                              )}
                            </p>
                          )}
                          {property.expires_at && (
                            <p>
                              Expira:{" "}
                              {new Date(property.expires_at).toLocaleDateString(
                                "es-ES"
                              )}
                            </p>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="mt-auto flex flex-wrap gap-3">
                          {/* Botón editar */}
                          <Link
                            href={`/property/${property.id}/edit`}
                            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
                          >
                            ✏️ Editar
                          </Link>

                          {/* Botón según estado */}
                          {!property.is_active &&
                          property.publication_status === "draft" ? (
                            <Link
                              href={`/publish/${property.id}/payment`}
                              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                            >
                              💳 Pagar y Publicar
                            </Link>
                          ) : property.is_active ? (
                            <Link
                              href={`/property/${property.id}`}
                              className="rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 font-semibold text-white transition-colors hover:from-purple-700 hover:to-cyan-600"
                            >
                              👁️ Ver Publicación
                            </Link>
                          ) : (
                            <Link
                              href={`/publish/${property.id}/payment`}
                              className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-yellow-700"
                            >
                              🔄 Renovar Publicación
                            </Link>
                          )}

                          {/* Botón eliminar */}
                          <button
                            onClick={() => handleDelete(property.id)}
                            disabled={deletingId === property.id}
                            className="rounded-lg border border-red-500/50 px-4 py-2 font-semibold text-red-400 transition-colors hover:bg-red-950/50 disabled:opacity-50"
                          >
                            {deletingId === property.id ? "..." : "🗑️ Eliminar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
