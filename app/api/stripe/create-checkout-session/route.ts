import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

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

    // Verificar que no esté ya pagada
    if (property.publication_status === "active") {
      return NextResponse.json(
        { success: false, error: "Esta propiedad ya está activa" },
        { status: 400 }
      );
    }

    // Crear sesión de pago en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Publicación de Propiedad - 30 días",
              description: `Publicación: ${property.title}`,
            },
            unit_amount: 300, // $3.00 en centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Pago único
      success_url: `${process.env.NEXTAUTH_URL}/publish/${propertyId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/publish/${propertyId}/payment?canceled=true`,
      metadata: {
        propertyId: propertyId.toString(),
        userId: user.userId.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error al crear sesión de pago:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear sesión de pago" },
      { status: 500 }
    );
  }
}
