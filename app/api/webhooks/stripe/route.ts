import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    // Verificar que el webhook viene de Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("⚠️  Webhook signature verification failed.", err);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Manejar el evento de pago exitoso
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("✅ Pago completado:", session.id);

      // Extraer metadata
      const propertyId = parseInt(session.metadata?.propertyId || "0");
      const userId = parseInt(session.metadata?.userId || "0");

      if (!propertyId || !userId) {
        console.error("❌ Metadata incompleta en sesión:", session.metadata);
        return NextResponse.json(
          { error: "Invalid metadata" },
          { status: 400 }
        );
      }

      // Calcular fecha de expiración (30 días desde ahora)
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Actualizar la propiedad
      await prisma.properties.update({
        where: { id: propertyId },
        data: {
          publication_status: "active",
          is_active: true,
          published_at: now,
          expires_at: expiresAt,
        },
      });

      // Crear registro de suscripción
      await prisma.property_subscriptions.create({
        data: {
          property_id: propertyId,
          user_id: userId,
          status: "active",
          plan_price: 3.0,
          starts_at: now,
          expires_at: expiresAt,
          payment_method: "stripe",
          stripe_subscription_id: session.id,
        },
      });

      console.log(`✅ Propiedad ${propertyId} activada hasta ${expiresAt.toISOString()}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}
