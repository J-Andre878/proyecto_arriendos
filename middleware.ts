import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // Si el usuario está autenticado pero no está en la página de aceptar términos
  if (token && !pathname.startsWith("/accept-terms")) {
    // Verificar si necesita aceptar términos (esto se hace en el cliente)
    // El cliente se encargará de redirigir si es necesario
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluir rutas estáticas y públicas
    "/((?!_next|api|public|favicon.ico).*)",
  ],
};
