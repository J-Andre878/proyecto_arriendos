import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    // Login con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    
    // Login con Email/Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email },
          include: { roles: true }
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid || !user.is_active) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.avatar_url,
        }
      }
    })
  ],
  
  callbacks: {
    async signIn({ user, account }) {
      // Si es login con Google, crear/actualizar usuario en BD
      if (account?.provider === "google") {
        const existingUser = await prisma.users.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          // Crear nuevo usuario con Google
          await prisma.users.create({
            data: {
              email: user.email!,
              name: user.name || "",
              avatar_url: user.image,
              auth_provider: "google",
              role_id: 1, // rol usuario normal
            }
          })
        } else if (existingUser.auth_provider === "local") {
          // Vincular cuenta de Google a usuario existente
          await prisma.users.update({
            where: { email: user.email! },
            data: {
              auth_provider: "google",
              avatar_url: user.image || existingUser.avatar_url,
            }
          })
        }
      }
      return true
    },
    
    async session({ session, token }) {
      if (session.user) {
        // Buscar el ID del usuario en nuestra BD por email
        const dbUser = await prisma.users.findUnique({
          where: { email: session.user.email! },
          select: { id: true }
        })
        
        if (dbUser) {
          session.user.id = dbUser.id.toString()
        }
      }
      return session
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    },
    state: {
      name: "next-auth.state",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
