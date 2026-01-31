"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function AcceptTermsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user && status === "authenticated") {
      // Verificar si el usuario ya aceptó términos
      const checkTerms = async () => {
        try {
          const response = await fetch("/api/profile");
          const data = await response.json();
          if (data.user?.accepted_terms) {
            // Ya aceptó, redirigir a home
            router.push("/");
          }
        } catch (err) {
          console.error("Error checking terms:", err);
        }
      };
      checkTerms();
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!acceptedPrivacy || !acceptedTerms) {
      setError("Debes aceptar la Política de Privacidad y los Términos y Condiciones");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/profile/accept-terms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        router.push("/");
      } else {
        setError(data.error || "Error al aceptar términos");
      }
    } catch (err) {
      setError("Error al procesar tu solicitud");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const loading = status === "loading";

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
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Bienvenido a Havela</h1>
            <p className="text-gray-400">
              Para continuar, necesitamos que aceptes nuestros documentos legales
            </p>
          </div>

          {/* Formulario */}
          <div className="rounded-2xl bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-8 shadow-xl border border-purple-500/30">
            {error && (
              <div className="rounded-lg bg-red-950/50 border border-red-500/50 p-4 mb-6">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Política de Privacidad */}
              <div className="rounded-lg bg-gray-900/50 border border-purple-500/30 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-2 border-purple-500/50 bg-gray-900 text-purple-600 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">
                    He leído y acepto la{" "}
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline transition-colors"
                    >
                      Política de Privacidad
                    </Link>
                  </span>
                </label>
              </div>

              {/* Términos y Condiciones */}
              <div className="rounded-lg bg-gray-900/50 border border-purple-500/30 p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-2 border-purple-500/50 bg-gray-900 text-purple-600 focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">
                    He leído y acepto los{" "}
                    <Link
                      href="/terms-and-conditions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline transition-colors"
                    >
                      Términos y Condiciones
                    </Link>
                  </span>
                </label>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting || !acceptedPrivacy || !acceptedTerms}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {submitting ? "Procesando..." : "Continuar"}
                </button>
                <Link
                  href="/"
                  className="rounded-xl border border-purple-500/50 px-6 py-3 font-semibold text-purple-300 transition-colors hover:bg-purple-500/10"
                >
                  Cancelar
                </Link>
              </div>
            </form>

            {/* Información */}
            <div className="mt-8 p-4 rounded-lg bg-blue-950/30 border border-blue-500/30">
              <p className="text-xs text-blue-300">
                💡 Esta información se debe aceptar una sola vez. Después podrás acceder directamente a tu cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
