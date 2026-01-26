# Guía de Google OAuth en Proyecto Arriendos

## 🔐 Configuración Actual

Tu aplicación está configurada con **NextAuth.js** y Google OAuth Provider. Aquí están los detalles:

### Variables de Entorno Requeridas
```
GOOGLE_CLIENT_ID=562933945016-s6sqr63bqjoeliuba83n5pls4mm28746.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=p85UiUa1KGVXW7UnAu9YtUCVMU1VJUWvpviHG2zXvC8=
DATABASE_URL=postgresql://postgres:28jdch2005pg@localhost:5432/arriendos_loja
```

## 🔄 Flujo de Inicio de Sesión con Google

### 1. **Usuario hace clic en "Continuar con Google"**
   - Navega a `/api/auth/signin/google`
   - Se generan dos cookies importantes:
     - `next-auth.pkce.code_verifier` - Para verificación de seguridad
     - `next-auth.state` - Para validar la respuesta de Google

### 2. **Google redirige al usuario**
   - Google valida las credenciales
   - Redirige a `http://localhost:3000/api/auth/callback/google`

### 3. **NextAuth procesa el callback**
   - Valida el `state` y `pkce.code_verifier` (cookies)
   - Recupera la información del usuario desde Google
   - Ejecuta el callback `signIn` del archivo `app/api/auth/[...nextauth]/route.ts`

### 4. **Lógica del Callback `signIn`**
```typescript
async signIn({ user, account }) {
  if (account?.provider === "google") {
    // Buscar si el usuario ya existe en BD
    const existingUser = await prisma.users.findUnique({
      where: { email: user.email! }
    })

    if (!existingUser) {
      // ✅ CREAR NUEVO USUARIO CON GOOGLE
      await prisma.users.create({
        data: {
          email: user.email!,
          name: user.name || "",
          avatar_url: user.image,
          auth_provider: "google",  // ← Marca como usuario Google
          role_id: 1, // rol usuario normal
        }
      })
    } else if (existingUser.auth_provider === "local") {
      // 🔗 VINCULAR GOOGLE A USUARIO EXISTENTE
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
}
```

### 5. **Crear sesión JWT**
   - Genera un JWT token
   - Almacena en cookie `next-auth.jwt` (httpOnly, secure)
   - Usuario queda autenticado

## 👤 Tipos de Usuarios Después del Login Google

### Usuario Google Nuevo
- **email**: De Google
- **name**: Nombre de Google
- **avatar_url**: Foto de Google
- **auth_provider**: `"google"`
- **password**: `null` (sin contraseña)

### Usuario Google Existente (Registro local anterior)
- Si registró con email/password localmente
- Luego inicia sesión con Google del mismo email
- Se vinculan las cuentas automáticamente
- **password**: Se mantiene (puede cambiarla)
- **auth_provider**: Cambia a `"google"`

## 🔑 Cambiar Contraseña Después de Google Login

Si un usuario se registró con Google:

**Endpoint**: `POST /api/profile/change-password`

**Primer cambio (Crear contraseña):**
```json
{
  "currentPassword": null,  // No requerido
  "newPassword": "MiPassword123",
  "confirmPassword": "MiPassword123"
}
```
- **Respuesta**: "Contraseña creada exitosamente"
- **Efecto**: Ahora puede iniciar sesión con email/password O Google

**Cambios posteriores:**
```json
{
  "currentPassword": "MiPassword123",
  "newPassword": "NuevaPassword456",
  "confirmPassword": "NuevaPassword456"
}
```
- **Respuesta**: "Contraseña actualizada exitosamente"

## ❌ Solución de Problemas

### Error: "State cookie was missing"
**Causa**: Cookies no se guardaron correctamente
**Solución**: Ya está arreglado con la configuración de cookies:
```typescript
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
}
```

### Error: "Error en la configuración del sistema"
**Causa**: El rol "user" no existía en la BD
**Solución**: Ya está arreglado. El endpoint de registro auto-crea el rol si no existe:
```typescript
// En app/api/auth/register/route.ts
const role = await prisma.roles.findUnique({
  where: { name: "user" }
})

if (!role) {
  await prisma.roles.create({
    data: { name: "user", description: "Usuario normal" }
  })
}
```

### Error: "Callback URL mismatch"
**Causa**: URL en Google Cloud Console no coincide con NEXTAUTH_URL
**Solución**: Verificar en Google Cloud Console:
- **Authorized redirect URIs** debe incluir:
  - `http://localhost:3000/api/auth/callback/google` (desarrollo)
  - `https://tudominio.com/api/auth/callback/google` (producción)

### Usuario no puede hacer login
**Pasos de debug**:
1. Verificar que las variables de entorno estén correctas: `echo $env:GOOGLE_CLIENT_ID`
2. Revisar en NextAuth Admin: `http://localhost:3000/api/auth/signin`
3. Buscar en base de datos: `SELECT * FROM users WHERE email = 'usuario@gmail.com'`
4. Ver logs en Google Cloud Console

## 🚀 Flujo de Registro con Google

1. Usuario hace clic en "Continuar con Google" en `/register`
2. Google los redirige con datos personales
3. NextAuth automáticamente:
   - Crea usuario en BD (si no existe)
   - Lo autentifica
   - Lo redirige a `/` (home)
4. Usuario ahora tiene cuenta creada y puede:
   - Crear propiedades
   - Ver favoritos
   - Editar perfil
   - Crear contraseña para email/password login

## 📋 Estructura de Usuarios en BD

```sql
-- Tabla users
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  password VARCHAR,  -- NULL si es usuario Google
  avatar_url VARCHAR,
  phone VARCHAR,
  auth_provider VARCHAR,  -- 'local' o 'google'
  role_id BIGINT REFERENCES roles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Valores posibles de auth_provider
-- 'local' -> Email/Password
-- 'google' -> Inicio sesión con Google
```

## ✅ Verificación de Funcionamiento

### En desarrollo:
1. Ir a `http://localhost:3000/login`
2. Hacer clic en "Continuar con Google"
3. Completar flujo de Google
4. Debería redirigir a `/` (home) autenticado

### Cookies a verificar (DevTools):
1. Abrir DevTools → Application → Cookies
2. Debería haber: `next-auth.jwt`, `next-auth.pkce.code_verifier`, `next-auth.state`

## 🔒 Seguridad

- ✅ httpOnly cookies (no accesibles desde JavaScript)
- ✅ Secure cookies en producción (solo HTTPS)
- ✅ PKCE flow (previene CSRF attacks)
- ✅ State cookie validation
- ✅ JWT con expiración (30 días)

## 📞 Soporte

Si tienes problemas:
1. Revisar que NEXTAUTH_URL sea correcto
2. Verificar Google Client ID y Secret
3. Buscar en logs: `console.error()` en callbacks
4. Revisar base de datos: verificar que usuario fue creado

---

**Última actualización**: 26 de enero de 2026
