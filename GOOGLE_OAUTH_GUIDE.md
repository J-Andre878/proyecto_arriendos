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
**Para verificar**: Abre DevTools → Application → Cookies → Busca `next-auth.state` y `next-auth.pkce.code_verifier`

### Error: "Error en la configuración del sistema"
**Causa**: El rol "user" no existía en la BD
**Solución**: Ya está arreglado. El callback de signIn auto-crea el rol si no existe
**Para verificar**: Ve a `http://localhost:3000/api/debug/status` y verifica que `role.exists` es `true`

### Error: "Callback URL mismatch"
**Causa**: URL en Google Cloud Console no coincide con NEXTAUTH_URL
**Solución**: Verificar en Google Cloud Console:
1. Ve a https://console.cloud.google.com/
2. Selecciona tu proyecto
3. Ve a "OAuth consent screen"
4. Haz clic en "Authorized domains" y asegúrate que `localhost` está agregado (para desarrollo)
5. Ve a "Credentials"
6. Haz clic en tu OAuth 2.0 Client ID
7. En "Authorized redirect URIs", verifica:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tudominio.com/api/auth/callback/google` (producción)

**Para verificar en desarrollo**:
- NEXTAUTH_URL debe ser exactamente: `http://localhost:3000`
- GOOGLE_CLIENT_ID: `562933945016-s6sqr63bqjoeliuba83n5pls4mm28746.apps.googleusercontent.com`
- GOOGLE_CLIENT_SECRET: (debe estar en tu .env)

### Usuario no puede hacer login después de registrarse
**Síntomas**: 
- Usuario se registra correctamente
- Intenta hacer login con sus credenciales y recibe "Credenciales inválidas"

**Posibles causas**:
1. **La contraseña no se guardó correctamente**
   - Solución: Verificar que `bcryptjs` está instalado: `npm list bcryptjs`
   - Verificar en BD: `SELECT password FROM users WHERE email='test@example.com';` (debe ser hash, no texto)

2. **El usuario está inactivo**
   - Solución: Verificar `is_active` en BD: `SELECT is_active FROM users WHERE email='test@example.com';`
   - Debe ser `true`

3. **El email no coincide exactamente**
   - Solución: Verificar que el email en registro y login son idénticos (case-sensitive)

**Para verificar**:
```bash
# Ir a http://localhost:3000/api/debug/status y revisar la lista de usuarios
# Asegúrate que:
# 1. El usuario existe
# 2. is_active es true
# 3. El email está correcto
```

### Login con Google no redirige correctamente
**Síntomas**: 
- Hace clic en "Continuar con Google"
- Google autentica pero no vuelve a tu app

**Posibles causas**:
1. **Falta el NEXTAUTH_SECRET**
   - Solución: Genera uno: `openssl rand -base64 32` (en Linux/Mac)
   - O usa: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - Luego agrega a `.env`: `NEXTAUTH_SECRET=<el_valor_generado>`

2. **NEXTAUTH_URL es incorrecto**
   - Solución: Verifica que sea exactamente tu URL (sin trailing slash)
   - Desarrollo: `http://localhost:3000`
   - Producción: `https://tudominio.com`

3. **Google Credentials son inválidos o están rotados**
   - Solución: Verifica en Google Cloud Console que todavía son válidos
   - Descarga nuevos si es necesario

### Database connection error
**Error**: "Can't reach database server"
**Solución**:
1. Verifica que PostgreSQL está corriendo: `pg_isready -h localhost -p 5432`
2. Verifica el DATABASE_URL en `.env` es correcto
3. Verifica credenciales: usuario, contraseña, nombre de BD

---

## 🔍 Debugging - Revisar Logs

Para ver logs de NextAuth en desarrollo:

1. **En servidor (terminal)**: Busca logs con emoji:
   - 🔐 Google SignIn
   - 👤 Usuario creado/existente
   - 🔑 JWT Callback
   - ❌ Errores

2. **En navegador**: Abre DevTools → Console
   - Busca errores rojos
   - Busca warnings

3. **Flujo completo**:
   ```
   1. Haz clic en "Continuar con Google"
   2. Revisa terminal - deberías ver: 🔐 Google SignIn
   3. Google abre en nueva ventana
   4. Después de autenticar en Google, regresa a tu app
   5. Revisa terminal - deberías ver: 👤 Usuario creado o existente
   6. Revisa terminal - deberías ver: 🔑 JWT Callback
   7. Deberías ser redirigido a home (/)
   8. En DevTools → Application → Cookies, verifica next-auth.jwt existe
   ```

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

### Endpoints de Debug (Desarrollo solamente)

Para verificar que todo está configurado correctamente:

**1. Verificar configuración:**
```
GET http://localhost:3000/api/auth/debug
```
Respuesta esperada:
```json
{
  "environment": "development",
  "google": {
    "clientId": "✓ Configurado",
    "clientSecret": "✓ Configurado"
  },
  "nextAuth": {
    "url": "http://localhost:3000",
    "secret": "✓ Configurado"
  },
  "database": {
    "url": "✓ Configurado"
  }
}
```

**2. Verificar estado de BD:**
```
GET http://localhost:3000/api/debug/status
```
Respuesta esperada:
```json
{
  "role": {
    "exists": true,
    "id": 1,
    "name": "user"
  },
  "users": {
    "total": 5,
    "list": [
      {
        "id": 1,
        "name": "Test User",
        "email": "test@example.com",
        "auth_provider": "google",
        "is_active": true
      }
    ]
  }
}
```

**3. Simular Google Login:**
```
POST http://localhost:3000/api/test/google-login
```
Body:
```json
{
  "email": "user@gmail.com",
  "name": "Test User",
  "image": "https://example.com/photo.jpg"
}
```

O visita: `http://localhost:3000/test/google-login` y haz clic en "Simular Google Login"

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
