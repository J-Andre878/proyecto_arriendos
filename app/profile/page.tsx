"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [tab, setTab] = useState<"profile" | "password">("profile");
  const [hasPassword, setHasPassword] = useState(false);
  const [authProvider, setAuthProvider] = useState<string>("local");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as any).phone || "",
      });
      setProfileImage((session.user as any).image || null);
      
      // Cargar información de si tiene contraseña
      const fetchProfileInfo = async () => {
        try {
          const response = await fetch("/api/profile");
          const data = await response.json();
          if (data.user) {
            setHasPassword(data.user.hasPassword);
            setAuthProvider(data.user.auth_provider);
          }
        } catch (err) {
          console.error("Error fetching profile info:", err);
        }
      };
      
      fetchProfileInfo();
    }
  }, [status, session, router]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe superar 5MB");
      return;
    }

    setUploadingImage(true);
    setError("");

    try {
      const formDataImage = new FormData();
      formDataImage.append("file", file);

      const response = await fetch("/api/upload/images", {
        method: "POST",
        body: formDataImage,
      });

      const data = await response.json();

      if (response.ok && data.urls && data.urls[0]) {
        setProfileImage(data.urls[0]);
        setSuccess("Foto de perfil actualizada");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Error al cargar la imagen");
      }
    } catch (err) {
      setError("Error al cargar la imagen");
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: profileImage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Perfil actualizado exitosamente");
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || "Error al actualizar perfil");
      }
    } catch (err) {
      setError("Error al actualizar perfil");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Contraseña actualizada exitosamente");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.error || "Error al cambiar contraseña");
      }
    } catch (err) {
      setError("Error al cambiar contraseña");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 py-12 px-4">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
            <p className="text-gray-400">Gestiona tu información personal y contraseña</p>
          </div>

          {/* Formulario Principal */}
          <div className="rounded-2xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-8 shadow-xl border border-purple-500/30">
            
            {/* Tabs */}
            <div className="mb-8 border-b border-purple-500/30">
              <div className="flex gap-8">
                <button
                  onClick={() => {
                    setTab("profile");
                    setError("");
                    setSuccess("");
                  }}
                  className={`pb-4 font-semibold transition-colors ${
                    tab === "profile"
                      ? "border-b-2 border-purple-500 text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Información Personal
                </button>
                <button
                  onClick={() => {
                    setTab("password");
                    setError("");
                    setSuccess("");
                  }}
                  className={`pb-4 font-semibold transition-colors ${
                    tab === "password"
                      ? "border-b-2 border-purple-500 text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Cambiar Contraseña
                </button>
              </div>
            </div>

            {/* Tab: Información Personal */}
            {tab === "profile" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-950/50 border border-red-500/50 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-green-950/50 border border-green-500/50 p-4">
                    <p className="text-sm text-green-400">{success}</p>
                  </div>
                )}

                {/* Foto de Perfil */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center gap-6">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Foto de perfil"
                        width={120}
                        height={120}
                        className="h-32 w-32 rounded-full border-2 border-purple-500/50 object-cover"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white border-2 border-purple-500/50">
                        {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="profile-image"
                        className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 font-semibold text-white cursor-pointer transition-all hover:from-purple-700 hover:to-cyan-600"
                      >
                        {uploadingImage ? "Cargando..." : "Cambiar Foto"}
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Máximo 5MB. Formatos: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-purple-500/50 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-lg border border-purple-500/30 bg-gray-900/30 px-4 py-3 text-gray-400 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">El email no puede ser modificado</p>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-purple-500/50 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="+593 99 123 4567"
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {submitting ? "Guardando..." : "Guardar Cambios"}
                  </button>
                  <Link
                    href="/my-properties"
                    className="rounded-xl border border-purple-500/50 px-6 py-3 font-semibold text-purple-300 transition-colors hover:bg-purple-500/10"
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            )}

            {/* Tab: Cambiar Contraseña */}
            {tab === "password" && (
              <form onSubmit={handlePasswordChange} className="space-y-6">
                {error && (
                  <div className="rounded-lg bg-red-950/50 border border-red-500/50 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-green-950/50 border border-green-500/50 p-4">
                    <p className="text-sm text-green-400">{success}</p>
                  </div>
                )}

                {/* Info si se registró con Google */}
                {authProvider === "google" && !hasPassword && (
                  <div className="rounded-lg bg-blue-950/50 border border-blue-500/50 p-4">
                    <p className="text-sm text-blue-300">
                      ℹ️ Te registraste con Google. Puedes crear una contraseña aquí para iniciar sesión también con email y contraseña.
                    </p>
                  </div>
                )}

                {/* Contraseña Actual - Solo mostrar si ya tiene contraseña */}
                {hasPassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contraseña Actual *
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-purple-500/50 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="Tu contraseña actual"
                    />
                  </div>
                )}

                {/* Nueva Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {hasPassword ? "Nueva Contraseña *" : "Contraseña *"}
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-purple-500/50 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Mínimo 6 caracteres. Usa mayúsculas, minúsculas y números para mayor seguridad.
                  </p>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {hasPassword ? "Confirmar Nueva Contraseña *" : "Confirmar Contraseña *"}
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-purple-500/50 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Repite tu contraseña"
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {submitting ? "Procesando..." : hasPassword ? "Actualizar Contraseña" : "Crear Contraseña"}
                  </button>
                  <Link
                    href="/my-properties"
                    className="rounded-xl border border-purple-500/50 px-6 py-3 font-semibold text-purple-300 transition-colors hover:bg-purple-500/10"
                  >
                    Cancelar
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
