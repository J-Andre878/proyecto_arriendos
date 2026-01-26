"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { validatePhoneNumber } from "@/lib/phoneValidation";

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
    phones: [""],
    num_guests: 1,
    num_rooms: 1,
    num_beds: 1,
    num_bathrooms: 1,
    price_per_night: "",
    property_type: "apartment",
  });
  const [phoneErrors, setPhoneErrors] = useState<string[]>([""]);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [phoneError, setPhoneError] = useState("");

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
            phones: property.property_phones?.map((p: any) => p.phone_number) || [""],
            num_guests: property.num_guests || 1,
            num_rooms: property.num_rooms || 1,
            num_beds: property.num_beds || 1,
            num_bathrooms: property.num_bathrooms || 1,
            price_per_night: property.price_per_night.toString(),
            property_type: property.property_type || "apartment",
          });
          setPhoneErrors(property.property_phones?.map(() => "") || [""]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, idx?: number) => {
    const { name, value } = e.target;
    if (name === "phones" && typeof idx === "number") {
      // Validar teléfono mientras escribe
      const validation = validatePhoneNumber(value);
      setPhoneErrors((prev) => {
        const copy = [...prev];
        copy[idx] = validation.error || "";
        return copy;
      });
      setFormData((prev) => ({
        ...prev,
        phones: prev.phones.map((p, i) => (i === idx ? value : p)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name.startsWith("num_") || name === "price_per_night"
          ? (name === "price_per_night" ? value : parseInt(value) || 0)
          : value,
      }));
    }
  };

  const handleAddPhone = () => {
    if (formData.phones.length < 3) {
      setFormData((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
      setPhoneErrors((prev) => [...prev, ""]);
    }
  };

  const handleRemovePhone = (idx: number) => {
    if (formData.phones.length > 1) {
      setFormData((prev) => ({ ...prev, phones: prev.phones.filter((_, i) => i !== idx) }));
      setPhoneErrors((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar teléfonos
    if (!formData.phones.length || formData.phones.some((p) => !p.trim())) {
      setError("Debes ingresar al menos un número de celular");
      return;
    }
    if (phoneErrors.some((err) => err)) {
      setError("Corrige los errores en los números de celular");
      return;
    }

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
          phone: formData.phones,
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
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
        <div className="mx-auto max-w-4xl px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/my-properties" className="text-purple-400 hover:text-purple-300">
              ← Volver a mis propiedades
            </Link>
            <h1 className="mt-4 text-4xl font-bold text-white">
              Editar Propiedad
            </h1>
            <p className="mt-2 text-gray-400">
              Modifica los datos de tu propiedad y guarda los cambios
            </p>
          </div>

          {/* Formulario */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-950/50 border border-red-500/50 p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Información básica */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Información Básica
                </h2>
              
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Título de la propiedad *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                    placeholder="Ej: Hermoso departamento en el centro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  placeholder="Describe tu propiedad en detalle..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  placeholder="Ej: Calle Principal 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Ciudad *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  >
                    <option value="Loja">Loja</option>
                    <option value="Quito">Quito</option>
                    <option value="Cuenca">Cuenca</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo de propiedad *
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  >
                    <option value="apartment">Departamento</option>
                    <option value="house">Casa</option>
                    <option value="room">Cuarto</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
              </div>
              </div>

              {/* Números de Celular */}
              <div className="border-b border-purple-500/30 pb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Números de Celular (máx. 3)</h2>
                <div className="space-y-2">
                  {formData.phones.map((phone, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="tel"
                        name="phones"
                        required
                        value={phone}
                        onChange={(e) => handleInputChange(e, idx)}
                        className={`w-full rounded-lg border px-4 py-3 text-white bg-white/10 focus:outline-none focus:ring-2 ${
                          phoneErrors[idx]
                            ? "border-red-500/50 focus:border-red-400 focus:ring-red-500/50"
                            : "border-purple-500/50 focus:border-purple-400 focus:ring-purple-500/50"
                        }`}
                        placeholder="Ej: 0987654321"
                      />
                      {formData.phones.length > 1 && (
                        <button type="button" onClick={() => handleRemovePhone(idx)} className="text-red-400 hover:text-red-300 px-2 py-1 rounded-full border border-red-500/50 bg-red-950/50">
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {phoneErrors.map((err, idx) =>
                    err ? (
                      <p key={idx} className="mt-1 text-sm text-red-400">{err}</p>
                    ) : null
                  )}
                  <button
                    type="button"
                    onClick={handleAddPhone}
                    disabled={formData.phones.length >= 3}
                    className="mt-2 px-3 py-1 rounded bg-purple-950/50 text-purple-300 font-semibold hover:bg-purple-900/50 disabled:opacity-50 border border-purple-500/50"
                  >
                    + Agregar otro número
                  </button>
                  <p className="mt-1 text-xs text-gray-500">
                    Formato: 10 dígitos (ej: 0987654321). Estos números se mostrarán a los interesados en tu propiedad para que puedan contactarte.
                  </p>
                </div>
              </div>

            {/* Detalles de Hospedaje */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Detalles de Hospedaje</h2>
              
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Huéspedes máx.
                  </label>
                  <input
                    type="number"
                    name="num_guests"
                    value={formData.num_guests}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Habitaciones
                  </label>
                  <input
                    type="number"
                    name="num_rooms"
                    value={formData.num_rooms}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Camas
                  </label>
                  <input
                    type="number"
                    name="num_beds"
                    value={formData.num_beds}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Baños
                  </label>
                  <input
                    type="number"
                    name="num_bathrooms"
                    value={formData.num_bathrooms}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
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
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-2 text-white placeholder-gray-500 bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Ej: 50.00"
                />
              </div>
            </div>

            {/* Imágenes */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Imágenes</h2>
              
              {/* Imágenes existentes */}
              {existingImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Imágenes actuales</h3>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Añadir más imágenes ({selectedFiles.length} nuevas)
                </label>
                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-purple-500/50 bg-purple-950/50 p-8 transition-colors hover:border-purple-400 hover:bg-purple-900/50">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-300">
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
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Nuevas imágenes</h3>
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
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-semibold text-white transition-colors hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50"
              >
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </button>
              <Link
                href="/my-properties"
                className="flex-1 rounded-lg border border-purple-500/50 px-6 py-3 text-center font-semibold text-gray-300 transition-colors hover:bg-white/10"
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
