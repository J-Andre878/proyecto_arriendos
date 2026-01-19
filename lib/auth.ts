import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export interface UserPayload {
  userId: number;
  email: string;
  name?: string;
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return null;
    }

    return {
      userId: parseInt(session.user.id),
      email: session.user.email!,
      name: session.user.name || undefined,
    };
  } catch (error) {
    console.error("Error al obtener sesión:", error);
    return null;
  }
}

export async function requireAuth(): Promise<UserPayload> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("No autenticado");
  }
  
  return user;
}
