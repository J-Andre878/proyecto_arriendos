"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{id: number, image_url: string, is_main: boolean}>>([]);
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
  const [loadingProperty, setLoadingProperty] = useState(true);

  // Cargar propiedad existente
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${propertyId}`);
        const data = await response.json();

        if (data.success) {
          const property = data.property;
          setFormData({
            title: property.title,
            description: property.description || "",
            address: property.address,
            city: property.city || "Loja",
            num_guests: property.num_guests || 1,
            num_rooms: property.num_rooms || 1,
            num_beds: property.num_beds || 1,
            num_bathrooms: property.num_bathrooms || 1,
            price_per_night: property.price_per_night.toString(),
            property_type: property.property_type || "apartment",
          });
          setExistingImages(property.property_images || []);
        } else {
          setError("No se pudo cargar la propiedad");
        }
      } catch (error) {
        console.error("Error al cargar propiedad:", error);
        setError("Error al cargar la propiedad");
      } finally {
        setLoadingProperty(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const totalImages = files.length + existingImages.length;
    if (totalImages > 10) {
      setError(`Máximo 10 imágenes permitidas (tienes ${existingImages.length} actuales)`);
      return;
    }

    setSelectedFiles(files);
    
    // Crear previews
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setError("");
  };

  const removeNewImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages(existingImages.filter(img => img.id !== imageId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.startsWith("num_") || name === "price_per_night" 
        ? (name === "price_per_night" ? value : parseInt(value) || 0)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // 1. Subir nuevas imágenes si hay
      let newImageUrls: {url: string}[] = [];
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        const formDataImages = new FormData();
        selectedFiles.forEach(file => {
          formDataImages.append("images", file);
        });

        const uploadResponse = await fetch("/api/upload/images", {
          method: "POST",
          body: formDataImages,
        });

        const uploadData = await uploadResponse.json();
        
        if (!uploadData.success) {
          throw new Error(uploadData.error || "Error al subir imágenes");
        }

        newImageUrls = uploadData.images;
        setUploadingImages(false);
      }

      // 2. Combinar imágenes existentes con nuevas
      const allImages = [
        ...existingImages.map(img => ({ url: img.image_url })),
        ...newImageUrls,
      ];

      // 3. Actualizar propiedad
      const response = await fetch(`/api/properties/${propertyId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price_per_night: parseFloat(formData.price_per_night.toString()),
          images: allImages,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Propiedad actualizada exitosamente");
        // Limpiar formulario
        setSelectedFiles([]);
        setPreviewUrls([]);
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push("/my-properties");
        }, 2000);
      } else {
        setError(data.error || "Error al actualizar la propiedad");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingProperty) {
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
          <Link href="/my-properties" className="text-blue-600 hover:text-blue-700">
            ← Volver a mis propiedades
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Editar Propiedad
          </h1>
          <p className="mt-2 text-gray-600">
            Actualiza los datos de tu propiedad
          </p>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-red-800">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg bg-green-50 p-4 text-green-800">
                {success}
              </div>
            )}

            {/* Información Básica */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título de la propiedad *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Hermoso departamento en el centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe tu propiedad en detalle..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Calle Principal 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Loja">Loja</option>
                    <option value="Quito">Quito</option>
                    <option value="Cuenca">Cuenca</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de propiedad *
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="apartment">Departamento</option>
                    <option value="house">Casa</option>
                    <option value="room">Cuarto</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Detalles de Hospedaje */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Detalles de Hospedaje</h2>
              
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Huéspedes máx.
                  </label>
                  <input
                    type="number"
                    name="num_guests"
                    value={formData.num_guests}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Habitaciones
                  </label>
                  <input
                    type="number"
                    name="num_rooms"
                    value={formData.num_rooms}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Camas
                  </label>
                  <input
                    type="number"
                    name="num_beds"
                    value={formData.num_beds}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Baños
                  </label>
                  <input
                    type="number"
                    name="num_bathrooms"
                    value={formData.num_bathrooms}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio por noche (USD) *
                </label>
                <input
                  type="number"
                  name="price_per_night"
                  value={formData.price_per_night}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 50.00"
                />
              </div>
            </div>

            {/* Imágenes */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Imágenes</h2>
              
              {/* Imágenes existentes */}
              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Imágenes actuales</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {existingImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt="Propiedad"
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.id)}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subir nuevas imágenes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Añadir más imágenes ({selectedFiles.length} nuevas)
                </label>
                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-8 transition-colors hover:border-blue-500 hover:bg-blue-100">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Arrastra imágenes aquí o haz clic para seleccionar
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF hasta 5MB. Máximo 10 imágenes totales.
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview de nuevas imágenes */}
              {previewUrls.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Nuevas imágenes</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting || uploadingImages}
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
              >
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </button>
              <Link
                href="/my-properties"
                className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-900 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
