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
    <form onSubmit={handleSearch} className="mx-auto mt-10 max-w-4xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-2xl bg-white p-6 shadow-2xl">
        {/* Provincia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
          <input
            type="text"
            name="province"
            placeholder="Ej: Loja"
            value={filters.province}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
          <input
            type="text"
            name="city"
            placeholder="Ej: Loja"
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tipo de propiedad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de propiedad</label>
          <select
            name="propertyType"
            value={filters.propertyType}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
          <input
            type="number"
            name="numRooms"
            min="1"
            placeholder="Ej: 2"
            value={filters.numRooms}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Número de camas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Camas</label>
          <input
            type="number"
            name="numBeds"
            min="1"
            placeholder="Ej: 2"
            value={filters.numBeds}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Capacidad de huéspedes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Huéspedes</label>
          <input
            type="number"
            name="numGuests"
            min="1"
            placeholder="Ej: 4"
            value={filters.numGuests}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio mínimo</label>
          <input
            type="number"
            name="minPrice"
            min="0"
            step="0.01"
            placeholder="$ Min"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
          <input
            type="number"
            name="maxPrice"
            min="0"
            step="0.01"
            placeholder="$ Max"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Botón Buscar */}
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            🔍 Buscar
          </button>
        </div>
      </div>
    </form>
  );
}
