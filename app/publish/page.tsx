"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { validatePhoneNumber } from "@/lib/phoneValidation";
import { ECUADOR_PROVINCES } from "@/lib/ecuadorProvinces";

export default function PublishPage() {
  const router = useRouter();
  const { data: session, status } = useSession();;
  const loading = status === "loading";
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [phoneErrors, setPhoneErrors] = useState<string[]>([""]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{url: string, public_id: string}[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<{id: number, name: string, category?: string, icon?: string}[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    province: "",
    city: "",
    phones: [""],
    num_guests: 1,
    num_rooms: 1,
    num_beds: 1,
    num_bathrooms: 1,
    price_per_night: "",
    property_type: "apartment",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    // Cargar amenidades disponibles
    const fetchAmenities = async () => {
      try {
        const response = await fetch("/api/amenities");
        const data = await response.json();
        if (data.success && data.amenities) {
          setAvailableAmenities(data.amenities);
        }
      } catch (err) {
        console.error("Error cargando amenidades:", err);
      }
    };
    fetchAmenities();
  }, [status, router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 10) {
      setError("Máximo 10 imágenes permitidas");
      return;
    }

    setSelectedFiles(files);
    
    // Crear previews
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setError("");
  };

  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
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
    setSubmitting(true);

    try {
      // Validar imágenes
      if (selectedFiles.length === 0) {
        setError("Debes subir al menos una imagen para publicar la propiedad");
        setSubmitting(false);
        return;
      }

      // Validar teléfonos
      if (!formData.phones.length || formData.phones.some((p) => !p.trim())) {
        setError("Debes ingresar al menos un número de celular");
        setSubmitting(false);
        return;
      }
      // Validar errores de formato
      if (phoneErrors.some((err) => err)) {
        setError("Corrige los errores en los números de celular");
        setSubmitting(false);
        return;
      }

      // 1. Subir imágenes primero si hay
      let imageUrls: {url: string, public_id: string}[] = [];
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

        imageUrls = uploadData.images;
        setUploadedImages(imageUrls);
        setUploadingImages(false);
      }

      // 2. Crear propiedad con imágenes
      const response = await fetch("/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price_per_night: parseFloat(formData.price_per_night),
          images: imageUrls,
          amenities: selectedAmenities,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir a la página de pago
        router.push(`/publish/${data.property.id}/payment`);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-200">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            ← Volver al inicio
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-white">
            Publicar tu Arriendo
          </h1>
          <p className="mt-2 text-gray-200">
            Comparte tu propiedad con miles de personas en todo Ecuador 🇪🇨
          </p>
        </div>

        {/* Formulario */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-8 shadow-xl border border-purple-500/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="border-b border-purple-500/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Información Básica
              </h2>

              {/* Título */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Título de la propiedad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  placeholder="Ej: Hermoso departamento en el centro de Loja"
                />
              </div>

              {/* Descripción */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Descripción *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  placeholder="Describe tu propiedad, servicios incluidos, características especiales, etc."
                />
              </div>

              {/* Tipo de propiedad */}
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Tipo de propiedad *
                </label>
                <select
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-900/50 appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23d1d5db' d='M1 4l5 5 5-5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value="">Seleccionar tipo...</option>
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
            <div className="border-b border-purple-500/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Ubicación</h2>

              {/* Dirección */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  placeholder="Calle Principal y Av. Universitaria"
                />
              </div>

              {/* Provincia */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Provincia *
                </label>
                <select
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-900/50"
                >
                  <option value="" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Selecciona una provincia</option>
                  {ECUADOR_PROVINCES.map((province) => (
                    <option key={province} value={province} style={{backgroundColor: '#1f2937', color: '#ffffff'}}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ciudad */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Ciudad *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  placeholder="Ej: Loja, Cuenca, Quito..."
                />
              </div>

              {/* Teléfonos */}
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Números de Celular * (máx. 3)
                </label>
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
                    className="mt-2 px-3 py-1 rounded bg-purple-950/50 text-purple-400 font-semibold hover:bg-purple-900/50 disabled:opacity-50 border border-purple-500/50"
                  >
                    + Agregar otro número
                  </button>
                  <p className="mt-1 text-xs text-gray-200">
                    Formato: 10 dígitos (ej: 0987654321). Estos números se mostrarán a los interesados en tu propiedad para que puedan contactarte.
                  </p>
                </div>
              </div>
            </div>

            {/* Capacidad */}
            <div className="border-b border-purple-500/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Capacidad y Espacios
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Huéspedes */}
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    Número de huéspedes *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.num_guests || ''}
                    onChange={(e) => setFormData({ ...formData, num_guests: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  />
                </div>

                {/* Habitaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    Número de habitaciones *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.num_rooms || ''}
                    onChange={(e) => setFormData({ ...formData, num_rooms: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  />
                </div>

                {/* Camas */}
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    Número de camas *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.num_beds || ''}
                    onChange={(e) => setFormData({ ...formData, num_beds: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  />
                </div>

                {/* Baños */}
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-2">
                    Número de baños *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.num_bathrooms || ''}
                    onChange={(e) => setFormData({ ...formData, num_bathrooms: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                  />
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div className="border-b border-purple-500/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Amenidades</h2>

              {availableAmenities.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-200 mb-4">
                    Selecciona las amenidades que incluye tu propiedad
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {availableAmenities.map((amenity) => (
                      <label
                        key={amenity.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-purple-500/50 bg-purple-950/30 hover:bg-purple-950/50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAmenities([...selectedAmenities, amenity.id]);
                            } else {
                              setSelectedAmenities(selectedAmenities.filter(id => id !== amenity.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-purple-500/50 bg-white/10 text-purple-600 cursor-pointer"
                        />
                        <span className="text-gray-100 text-sm">
                          {amenity.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm">Cargando amenidades...</p>
              )}
            </div>

            {/* Imágenes */}
            <div className="border-b border-purple-500/30 pb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Imágenes</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Fotos de la propiedad
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="w-full rounded-lg border border-purple-500/50 px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                />
                <p className="mt-2 text-sm text-gray-200">
                  Puedes subir hasta 10 imágenes. Formatos: JPG, PNG, WEBP
                </p>
              </div>

              {/* Preview de imágenes */}
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-100 mb-3">
                    {previewUrls.length} imagen{previewUrls.length > 1 ? 'es' : ''} seleccionada{previewUrls.length > 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Precio */}
            <div className="pb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Precio</h2>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Precio por noche (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-300 text-lg">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                    className="w-full rounded-lg border border-purple-500/50 pl-10 pr-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white/10"
                    placeholder="50.00"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-200">
                  Establece un precio competitivo para tu propiedad
                </p>
              </div>
            </div>

            {/* Mensaje de error prominente */}
            {error && (
              <div className="rounded-lg bg-red-950/70 border-2 border-red-500/70 p-5 shadow-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <p className="font-semibold text-red-300 mb-1">No se puede publicar la propiedad</p>
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 rounded-lg border-2 border-purple-500/50 px-6 py-3 font-semibold text-gray-100 transition-colors hover:bg-purple-950/30"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting || uploadingImages}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-semibold text-white transition-colors hover:from-purple-700 hover:to-cyan-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploadingImages ? "Subiendo imágenes..." : submitting ? "Publicando..." : "Publicar Propiedad"}
              </button>
            </div>
          </form>
        </div>

        {/* Nota informativa */}
        <div className="mt-6 rounded-lg bg-purple-950/50 border border-purple-500/30 p-4">
          <p className="text-sm text-purple-300">
            <strong>Nota:</strong> Después de publicar tu propiedad, podrás agregar
            fotos, amenidades y más detalles desde la página de administración.
          </p>
        </div>
      </div>
    </div>
  );
}
