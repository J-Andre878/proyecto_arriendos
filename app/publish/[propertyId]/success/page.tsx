"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && sessionId) {
      // Pequeño delay para asegurar que el webhook se procesó
      setTimeout(() => {
        setVerified(true);
        setLoading(false);
      }, 2000);
    }
  }, [status, sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Verificando tu pago...</p>
          <p className="mt-2 text-sm text-gray-500">Esto tomará solo unos segundos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icono de éxito */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg
              className="h-12 w-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            ¡Pago Exitoso!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Tu propiedad ha sido publicada exitosamente y ahora está visible para todos los usuarios.
          </p>

          {/* Detalles */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold text-gray-900">Mensual (30 días)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Monto pagado:</span>
              <span className="font-semibold text-gray-900">$3.00 USD</span>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              📅 Tu publicación expirará en 30 días. Te enviaremos un recordatorio antes de que expire.
            </p>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <button
              onClick={() => router.push(`/property/${params.propertyId}`)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition"
            >
              Ver mi Publicación
            </button>
            
            <button
              onClick={() => router.push("/")}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Volver al Inicio
            </button>
          </div>

          {/* Footer */}
          <p className="mt-6 text-xs text-gray-500">
            Recibirás un correo de confirmación con los detalles de tu pago
          </p>
        </div>
      </div>
    </div>
  );
}
