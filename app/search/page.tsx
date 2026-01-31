"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import PropertyCard from "@/app/components/PropertyCard";

interface Property {
  id: number;
  title: string;
  description: string | null;
  price_per_night: number;
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

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Estado del formulario
  const [filters, setFilters] = useState({
    province: searchParams.get("province") || "",
    city: searchParams.get("city") || "",
    propertyType: searchParams.get("propertyType") || "",
    numGuests: searchParams.get("numGuests") || "",
    numRooms: searchParams.get("numRooms") || "",
    numBeds: searchParams.get("numBeds") || "",
    numBathrooms: searchParams.get("numBathrooms") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Realizar búsqueda al cambiar los parámetros
  useEffect(() => {
    if (searchParams.get("search") === "true") {
      performSearch();
    }
  }, [searchParams]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filters.province) queryParams.append("province", filters.province);
      if (filters.city) queryParams.append("city", filters.city);
      if (filters.propertyType) queryParams.append("propertyType", filters.propertyType);
      if (filters.numGuests) queryParams.append("numGuests", filters.numGuests);
      if (filters.numRooms) queryParams.append("numRooms", filters.numRooms);
      if (filters.numBeds) queryParams.append("numBeds", filters.numBeds);
      if (filters.numBathrooms) queryParams.append("numBathrooms", filters.numBathrooms);
      if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);

      const response = await fetch(`/api/properties/search?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProperties(data.data || []);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error al buscar propiedades:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    // Actualizar URL con los parámetros
    const queryParams = new URLSearchParams();

    if (filters.province) queryParams.append("province", filters.province);
    if (filters.city) queryParams.append("city", filters.city);
    if (filters.propertyType) queryParams.append("propertyType", filters.propertyType);
    if (filters.numGuests) queryParams.append("numGuests", filters.numGuests);
    if (filters.numRooms) queryParams.append("numRooms", filters.numRooms);
    if (filters.numBeds) queryParams.append("numBeds", filters.numBeds);
    if (filters.numBathrooms) queryParams.append("numBathrooms", filters.numBathrooms);
    if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
    queryParams.append("search", "true");

    router.push(`/search?${queryParams.toString()}`);
  };

  const handleReset = () => {
    setFilters({
      province: "",
      city: "",
      propertyType: "",
      numGuests: "",
      numRooms: "",
      numBeds: "",
      numBathrooms: "",
      minPrice: "",
      maxPrice: "",
    });
    setProperties([]);
    setHasSearched(false);
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-gray-900/50">
      <Navbar />

      <main className="mx-auto max-w-[92.5rem] px-3 py-24 sm:px-4 lg:px-6">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Buscar Propiedades</h1>
          <p className="mt-2 text-lg text-gray-400">🌎 Encuentra tu arriendo perfecto en todo el Ecuador</p>
        </div>

        {/* Formulario de filtros */}
        <form
          onSubmit={handleSearch}
          className="mb-12 rounded-2xl bg-white/10 backdrop-blur-sm p-6 lg:p-8 shadow-lg"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Provincia */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Provincia
              </label>
              <input
                type="text"
                name="province"
                placeholder="Ej: Loja"
                value={filters.province}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                name="city"
                placeholder="Ej: Loja"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Tipo de propiedad */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Tipo de Propiedad
              </label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-900/50 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23d1d5db' d='M1 4l5 5 5-5'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  paddingRight: '2.5rem',
                }}
              >
                <option value="">Todos</option>
                <option value="apartment">Departamento</option>
                <option value="house">Casa</option>
                <option value="room">Habitación</option>
                <option value="studio">Estudio</option>
                <option value="villa">Villa</option>
                <option value="cabin">Cabaña</option>
              </select>
            </div>

            {/* Número de huéspedes */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Huéspedes
              </label>
              <input
                type="number"
                name="numGuests"
                placeholder="Ej: 4"
                min="1"
                value={filters.numGuests}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Número de habitaciones */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Habitaciones
              </label>
              <input
                type="number"
                name="numRooms"
                placeholder="Ej: 2"
                min="1"
                value={filters.numRooms}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Número de camas */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Camas
              </label>
              <input
                type="number"
                name="numBeds"
                placeholder="Ej: 2"
                min="1"
                value={filters.numBeds}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Número de baños */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Baños
              </label>
              <input
                type="number"
                name="numBathrooms"
                placeholder="Ej: 1"
                min="1"
                value={filters.numBathrooms}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Precio mínimo */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Precio Mínimo
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="Ej: $20"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Precio máximo */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Precio Máximo
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Ej: $500"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? "Buscando..." : "🔍 Buscar Propiedades"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-lg border-2 border-purple-500/50 px-6 py-3 text-base font-semibold text-gray-300 transition-colors hover:bg-white/5"
            >
              Limpiar Filtros
            </button>
          </div>
        </form>

        {/* Resultados */}
        {hasSearched && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
                  <p className="text-gray-400">Buscando propiedades...</p>
                </div>
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {properties.length} propiedades encontradas
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {properties.map((property) => (
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
                      images={property.property_images.map((img) => ({
                        id: img.id,
                        image_url: img.image_url,
                        is_main: img.is_main,
                      }))}
                    />
                  ))}
                </div>
              </>
            ) : (
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.5 5.5a7.5 7.5 0 0010.5 10.5z"
                  />
                </svg>
                <h3 className="mb-2 text-2xl font-bold text-white">
                  No se encontraron propiedades
                </h3>
                <p className="text-gray-400">
                  Intenta ajustar tus filtros para encontrar lo que buscas
                </p>
              </div>
            )}
          </>
        )}

        {/* Mensaje inicial */}
        {!hasSearched && (
          <div className="text-center">
            <p className="text-lg text-gray-400">
              Completa los filtros y haz clic en "Buscar" para encontrar propiedades
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
