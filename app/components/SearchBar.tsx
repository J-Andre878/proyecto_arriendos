"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    province: "",
    city: "",
    propertyType: "",
    numGuests: "",
    numRooms: "",
    numBeds: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    if (filters.province) queryParams.append("province", filters.province);
    if (filters.city) queryParams.append("city", filters.city);
    if (filters.propertyType) queryParams.append("propertyType", filters.propertyType);
    if (filters.numGuests) queryParams.append("numGuests", filters.numGuests);
    if (filters.numRooms) queryParams.append("numRooms", filters.numRooms);
    if (filters.numBeds) queryParams.append("numBeds", filters.numBeds);
    if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice);
    queryParams.append("search", "true");

    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto mt-8 w-full px-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur p-6 shadow-xl dark:shadow-2xl border border-purple-100 dark:border-purple-900">
        {/* Provincia */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Provincia</label>
          <input
            type="text"
            name="province"
            placeholder="Ej: Loja"
            value={filters.province}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ciudad</label>
          <input
            type="text"
            name="city"
            placeholder="Ej: Loja"
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Tipo de propiedad */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipo de Propiedad</label>
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
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

        {/* Número de habitaciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Habitaciones</label>
          <input
            type="number"
            name="numRooms"
            min="1"
            placeholder="Ej: 2"
            value={filters.numRooms}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Número de camas */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Camas</label>
          <input
            type="number"
            name="numBeds"
            min="1"
            placeholder="Ej: 2"
            value={filters.numBeds}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Capacidad de huéspedes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Huéspedes</label>
          <input
            type="number"
            name="numGuests"
            min="1"
            placeholder="Ej: 4"
            value={filters.numGuests}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Precio Mínimo</label>
          <input
            type="number"
            name="minPrice"
            min="0"
            step="0.01"
            placeholder="Ej: $50"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Precio Máximo</label>
          <input
            type="number"
            name="maxPrice"
            min="0"
            step="0.01"
            placeholder="Ej: $500"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Botón Buscar */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 dark:from-violet-500 dark:via-purple-500 dark:to-cyan-400 px-6 py-2.5 text-base font-semibold text-white transition-all hover:shadow-lg dark:hover:shadow-purple-500/50 whitespace-nowrap h-fit"
          >
            🔍 Buscar Propiedades
          </button>
        </div>
      </div>
    </form>
  );
}
