import { NextResponse } from "next/server";
import axios from "axios";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// Función para obtener access token de PayPal
async function getPayPalAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    `${process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { orderId, propertyId } = await request.json();

    if (!orderId || !propertyId) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Obtener access token
    const accessToken = await getPayPalAccessToken();

    // Capturar el pago en PayPal
    const response = await axios.post(
      `${process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const capture = response.data;

    console.log("✅ Pago capturado:", capture);

    // Verificar que el pago fue exitoso
    if (capture.status === "COMPLETED") {
      // Calcular fecha de expiración (30 días desde ahora)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Actualizar la propiedad
      await prisma.$executeRaw`
        UPDATE properties 
        SET publication_status = 'active',
            is_active = true,
            published_at = ${now},
            expires_at = ${expiresAt}
        WHERE id = ${parseInt(propertyId)}
      `;

      // Crear registro de suscripción
      await prisma.$executeRaw`
        INSERT INTO property_subscriptions 
          (property_id, user_id, status, plan_price, starts_at, expires_at, payment_method, payment_transaction_id)
        VALUES 
          (${parseInt(propertyId)}, ${user.userId}, 'active', 3.0, ${now}, ${expiresAt}, 'paypal', ${orderId})
      `;

      console.log(`✅ Propiedad ${propertyId} activada hasta ${expiresAt.toISOString()}`);

      return NextResponse.json({
        success: true,
        message: "Pago procesado exitosamente",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "El pago no se completó" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("❌ Error al capturar pago:", error.response?.data || error);
    return NextResponse.json(
      { success: false, error: "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
