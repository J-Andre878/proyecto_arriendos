import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu-secret-key-muy-seguro-cambiar-en-produccion";

export interface UserPayload {
  userId: number;
  email: string;
  roleId: number;
  roleName: string;
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error("Error al verificar token:", error);
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
