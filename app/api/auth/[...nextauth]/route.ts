import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    // Login con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
      try {
        // Si es login con Google, crear/actualizar usuario en BD
        if (account?.provider === "google") {
          console.log("🔐 Google SignIn - Usuario:", user.email);

          // Asegurar que el rol "user" existe
          let userRole = await prisma.roles.findUnique({
            where: { name: "user" }
          })

          if (!userRole) {
            console.log("📝 Creando rol 'user'");
            userRole = await prisma.roles.create({
              data: {
                name: "user",
                description: "Usuario normal"
              }
            })
          }

          const existingUser = await prisma.users.findUnique({
            where: { email: user.email! }
          })

          if (!existingUser) {
            // Crear nuevo usuario con Google
            console.log("👤 Creando nuevo usuario con Google:", user.email);
            const newUser = await prisma.users.create({
              data: {
                email: user.email!,
                name: user.name || "Usuario",
                surname: null,
                avatar_url: user.image || null,
                auth_provider: "google",
                role_id: userRole.id,
                is_active: true,
              }
            })
            console.log("✅ Usuario creado:", newUser.id, newUser.email);
          } else {
            console.log("👤 Usuario existente encontrado:", existingUser.id);
            if (existingUser.auth_provider === "local") {
              // Vincular cuenta de Google a usuario existente
              console.log("🔗 Vinculando Google a usuario local");
              await prisma.users.update({
                where: { email: user.email! },
                data: {
                  auth_provider: "google",
                  avatar_url: user.image || existingUser.avatar_url,
                }
              })
            }
          }
        }
        return true
      } catch (error) {
        console.error("❌ Error en signIn callback:", error)
        return false
      }
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        console.log("📋 Session creada para:", session.user.email, "ID:", token.id);
      }
      return session
    },
    
    async jwt({ token, user, account }) {
      console.log("🔑 JWT Callback - user:", user?.email, "account:", account?.provider);
      
      if (user) {
        token.id = user.id
        console.log("🎯 Token actualizado con ID de usuario:", user.id);
      }
      
      // Si es Google login sin user (refresh), buscar el usuario en BD
      if (account?.provider === "google" && !token.id && token.email) {
        console.log("🔍 Buscando usuario Google en BD:", token.email);
        const dbUser = await prisma.users.findUnique({
          where: { email: token.email },
          select: { id: true }
        })
        if (dbUser) {
          token.id = dbUser.id.toString()
          console.log("✅ Usuario encontrado en BD, ID:", dbUser.id);
        }
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

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("✅ signIn event:", { 
        email: user?.email, 
        provider: account?.provider,
        isNewUser 
      });
    },
    async session({ session, token }) {
      console.log("📋 session event:", session.user?.email);
    },
    async error({ error }) {
      console.error("❌ NextAuth error:", error);
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
