import { NextResponse } from "next/server";

export async function GET() {
  // Solo para desarrollo - NO expongas esto en producción
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "No permitido en producción" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ? "✓ Configurado" : "✗ NO configurado",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "✓ Configurado" : "✗ NO configurado",
    },
    nextAuth: {
      url: process.env.NEXTAUTH_URL || "no definido",
      secret: process.env.NEXTAUTH_SECRET ? "✓ Configurado" : "✗ NO configurado",
    },
    database: {
      url: process.env.DATABASE_URL ? "✓ Configurado" : "✗ NO configurado",
    },
  });
}
