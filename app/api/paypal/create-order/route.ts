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

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: "ID de propiedad requerido" },
        { status: 400 }
      );
    }

    // Verificar que la propiedad existe y pertenece al usuario
    const property = await prisma.properties.findUnique({
      where: { id: parseInt(propertyId) },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Propiedad no encontrada" },
        { status: 404 }
      );
    }

    if (property.user_id !== user.userId) {
      return NextResponse.json(
        { success: false, error: "No tienes permiso para esta propiedad" },
        { status: 403 }
      );
    }

    // Obtener access token
    const accessToken = await getPayPalAccessToken();

    // Crear orden en PayPal
    const response = await axios.post(
      `${process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com"}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: "3.00",
            },
            description: `Publicación: ${property.title}`,
            custom_id: `${propertyId}`,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/publish/${propertyId}/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/publish/${propertyId}/payment?canceled=true`,
          brand_name: "Arriendos Loja",
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const order = response.data;

    // Buscar el link de aprobación
    const approvalUrl = order.links?.find((link: any) => link.rel === "approve")?.href;

    if (!approvalUrl) {
      throw new Error("No se pudo crear la orden de PayPal");
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      url: approvalUrl,
    });
  } catch (error: any) {
    console.error("Error al crear orden de PayPal:", error.response?.data || error);
    return NextResponse.json(
      { success: false, error: "Error al crear orden de pago" },
      { status: 500 }
    );
  }
}
