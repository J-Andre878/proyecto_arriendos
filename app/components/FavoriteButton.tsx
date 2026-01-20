"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  propertyId: number;
  className?: string;
}

export default function FavoriteButton({
  propertyId,
  className = "",
}: FavoriteButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar si está en favoritos al cargar
  useEffect(() => {
    if (status === "authenticated") {
      checkFavorite();
    }
  }, [status, propertyId]);

  const checkFavorite = async () => {
    try {
      const response = await fetch(
        `/api/favorites/check?propertyId=${propertyId}`
      );
      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error("Error al verificar guardado:", error);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir navegación si está dentro de un Link
    e.stopPropagation();

    console.log("Click en favorito - propertyId:", propertyId, "isFavorite:", isFavorite, "status:", status);

    // Si no está autenticado, redirigir a login
    if (status !== "authenticated") {
      console.log("Usuario no autenticado, redirigiendo a login");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Eliminar de guardados
        console.log("Eliminando de guardados...");
        const response = await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });

        const data = await response.json();
        console.log("Respuesta DELETE:", data);

        if (response.ok) {
          setIsFavorite(false);
          console.log("✓ Eliminado de guardados");
        } else {
          alert(data.error || "Error al eliminar de guardados");
        }
      } else {
        // Agregar a guardados
        console.log("Agregando a guardados...");
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });

        const data = await response.json();
        console.log("Respuesta POST:", data);

        if (response.ok) {
          setIsFavorite(true);
          console.log("✓ Agregado a guardados");
        } else {
          alert(data.error || "Error al agregar a guardados");
        }
      }
    } catch (error) {
      console.error("Error al cambiar guardado:", error);
      alert("Error al guardar la propiedad. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`group flex items-center justify-center rounded-full bg-white/90 p-2 shadow-lg transition-all hover:scale-110 hover:bg-white disabled:opacity-50 ${className}`}
      title={isFavorite ? "Quitar de guardados" : "Guardar propiedad"}
    >
      {/* Ícono de bookmark/guardado */}
      <svg
        className={`h-6 w-6 transition-colors ${
          isFavorite
            ? "fill-blue-600 text-blue-600"
            : "fill-none text-gray-700 group-hover:text-blue-600"
        }`}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  );
}
