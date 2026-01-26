"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Property {
  id: number;
  title: string;
  description: string;
  city: string;
  price_per_night: string;
  publication_status: string;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && params.propertyId) {
      fetchProperty();
    }
  }, [status, params.propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.propertyId}`);
      const data = await response.json();

      if (data.success) {
        setProperty(data.property);
      } else {
        setError("Propiedad no encontrada");
      }
    } catch (err) {
      setError("Error al cargar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: params.propertyId }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirigir a PayPal
        window.location.href = data.url;
      } else {
        setError(data.error || "Error al crear orden de pago");
        setProcessing(false);
      }
    } catch (err) {
      setError("Error de conexión. Intenta nuevamente.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Propiedad no encontrada</h1>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-purple-400 hover:underline"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Completa tu Publicación
          </h1>
          <p className="mt-2 text-gray-400">
            Tu propiedad está casi lista. Solo falta el pago para activarla.
          </p>
        </div>

        {/* Mensaje de cancelación */}
        {canceled && (
          <div className="mb-6 bg-yellow-950/50 border border-yellow-500/50 rounded-lg p-4">
            <p className="text-yellow-300">
              El pago fue cancelado. Puedes intentarlo de nuevo cuando estés listo.
            </p>
          </div>
        )}

        {/* Resumen de la propiedad */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Resumen de tu Publicación
          </h2>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Título</p>
              <p className="font-medium text-white">{property.title}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Ubicación</p>
              <p className="font-medium text-white">{property.city}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Precio por noche</p>
              <p className="font-medium text-white">${property.price_per_night}</p>
            </div>
          </div>
        </div>

        {/* Plan de pago */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Plan de Publicación
          </h2>
          
          <div className="border-2 border-purple-500/50 rounded-lg p-6 bg-purple-950/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Plan Mensual</h3>
                <p className="text-sm text-gray-400">Publicación por 30 días</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-400">$3.00</p>
                <p className="text-sm text-gray-500">USD</p>
              </div>
            </div>
            
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Publicación visible por 30 días</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Recibe solicitudes de reserva</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Gestión de calendario</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Soporte al cliente</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-950/50 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/")}
            disabled={processing}
            className="flex-1 px-6 py-3 border-2 border-purple-500/50 rounded-lg font-medium text-gray-300 hover:bg-white/5 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            onClick={handlePayment}
            disabled={processing || property.publication_status === "active"}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              "Proceder al Pago"
            )}
          </button>
        </div>

        {/* Información de seguridad */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            🔒 Pago seguro procesado por{" "}
            <span className="font-semibold">PayPal</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Tus datos de pago están encriptados y protegidos
          </p>
        </div>
      </div>
    </div>
  );
}
