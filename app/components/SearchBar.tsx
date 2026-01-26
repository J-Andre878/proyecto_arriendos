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
      <div className="flex items-end gap-1.5 rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur p-3 shadow-xl dark:shadow-2xl border border-purple-100 dark:border-purple-900">
        {/* Provincia */}
        <div className="flex-1 min-w-[70px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Provincia</label>
          <input
            type="text"
            name="province"
            placeholder="Ej: Pichincha"
            value={filters.province}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Ciudad */}
        <div className="flex-1 min-w-[70px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Ciudad</label>
          <input
            type="text"
            name="city"
            placeholder="Ej: Quito"
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Tipo de propiedad */}
        <div className="flex-1 min-w-[70px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Tipo</label>
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
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
        <div className="flex-1 min-w-[60px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Hab.</label>
          <input
            type="number"
            name="numRooms"
            min="1"
            placeholder="2"
            value={filters.numRooms}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Número de camas */}
        <div className="flex-1 min-w-[60px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Camas</label>
          <input
            type="number"
            name="numBeds"
            min="1"
            placeholder="2"
            value={filters.numBeds}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Capacidad de huéspedes */}
        <div className="flex-1 min-w-[60px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">Huésp.</label>
          <input
            type="number"
            name="numGuests"
            min="1"
            placeholder="4"
            value={filters.numGuests}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Precio mínimo */}
        <div className="flex-1 min-w-[60px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">P. Min</label>
          <input
            type="number"
            name="minPrice"
            min="0"
            step="0.01"
            placeholder="$"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Precio máximo */}
        <div className="flex-1 min-w-[60px]">
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">P. Max</label>
          <input
            type="number"
            name="maxPrice"
            min="0"
            step="0.01"
            placeholder="$"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-1.5 py-1.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          />
        </div>

        {/* Botón Buscar */}
        <button
          type="submit"
          className="flex-1 min-w-[70px] rounded-lg bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 dark:from-violet-500 dark:via-purple-500 dark:to-cyan-400 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:shadow-lg dark:hover:shadow-purple-500/50 h-fit whitespace-nowrap"
        >
          🔍 Buscar
        </button>
      </div>
    </form>
  );
}
