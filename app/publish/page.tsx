"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function PublishPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "Loja",
    num_guests: 1,
    num_rooms: 1,
    num_beds: 1,
    num_bathrooms: 1,
    price_per_night: "",
    property_type: "apartment",
  });

  // Verificar autenticación
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price_per_night: parseFloat(formData.price_per_night),
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/property/${data.property.id}`);
      } else {
        setError(data.error || "Error al publicar la propiedad");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Volver al inicio
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Publicar Propiedad
          </h1>
          <p className="mt-2 text-gray-600">
            Completa los datos de tu propiedad para publicarla
          </p>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Información básica */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Información Básica
              </h2>

              {/* Título */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la propiedad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Hermoso departamento en el centro de Loja"
                />
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe tu propiedad, servicios incluidos, características especiales, etc."
                />
              </div>

              {/* Tipo de propiedad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de propiedad *
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="apartment">Departamento</option>
                  <option value="house">Casa</option>
                  <option value="room">Habitación</option>
                  <option value="studio">Estudio</option>
                  <option value="villa">Villa</option>
                  <option value="cabin">Cabaña</option>
                </select>
              </div>
            </div>

            {/* Ubicación */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ubicación</h2>

              {/* Dirección */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Calle Principal y Av. Universitaria"
                />
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Loja"
                />
              </div>
            </div>

            {/* Capacidad */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Capacidad y Espacios
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Huéspedes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de huéspedes *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.num_guests}
                    onChange={(e) => setFormData({ ...formData, num_guests: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Habitaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de habitaciones *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.num_rooms}
                    onChange={(e) => setFormData({ ...formData, num_rooms: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Camas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de camas *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.num_beds}
                    onChange={(e) => setFormData({ ...formData, num_beds: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Baños */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de baños *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.num_bathrooms}
                    onChange={(e) => setFormData({ ...formData, num_bathrooms: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Precio */}
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Precio</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio por noche (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 text-lg">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50.00"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Establece un precio competitivo para tu propiedad
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? "Publicando..." : "Publicar Propiedad"}
              </button>
            </div>
          </form>
        </div>

        {/* Nota informativa */}
        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Después de publicar tu propiedad, podrás agregar
            fotos, amenidades y más detalles desde la página de administración.
          </p>
        </div>
      </div>
    </div>
  );
}
