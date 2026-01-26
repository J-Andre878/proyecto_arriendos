# 🚀 Guía Rápida: Verificar que Google Login Funciona

## Paso 1: Verificar Configuración (1 minuto)

Abre en tu navegador: `http://localhost:3000/api/auth/debug`

Debería mostrarte:
```json
{
  "google": {
    "clientId": "✓ Configurado",
    "clientSecret": "✓ Configurado"
  },
  "nextAuth": {
    "secret": "✓ Configurado"
  }
}
```

Si ves ✗ en cualquiera, revisa tu archivo `.env` y asegúrate que tienen valores.

---

## Paso 2: Verificar Base de Datos (1 minuto)

Abre: `http://localhost:3000/api/debug/status`

Debería mostrarte:
```json
{
  "role": {
    "exists": true,
    "id": 1,
    "name": "user"
  },
  "users": {
    "total": 0,
    "list": []
  }
}
```

Si `role.exists` es `false`, el sistema creará el rol automáticamente en el primer login.
Si ves usuarios en `list`, significa que ya hay cuentas creadas.

---

## Paso 3: Prueba de Simulación (30 segundos)

Abre: `http://localhost:3000/test/google-login`

Haz clic en "Simular Google Login"

Debería responder algo como:
```json
{
  "status": "new_user_created",
  "user": {
    "id": 1,
    "email": "test1705068302644@google.com",
    "name": "Test User",
    "auth_provider": "google"
  }
}
```

Si funciona esto, significa que tu BD puede crear usuarios sin problema.

---

## Paso 4: Prueba Real (2 minutos)

### Opción A: Login con Credenciales

1. Ve a `http://localhost:3000/register`
2. Registra un usuario nuevo con:
   - Nombre: `Test User`
   - Email: `test@example.com`
   - Contraseña: `password123`
   - Teléfono: (opcional)
3. Deberías ser redirigido a `/` (home)
4. Si funciona, hace clic en el avatar en la esquina arriba a la derecha → "Cerrar sesión"
5. Ve a `http://localhost:3000/login`
6. Intenta login con el mismo email y contraseña
7. Deberías volver a ser autenticado

### Opción B: Login con Google (Real)

1. Ve a `http://localhost:3000/login`
2. Haz clic en "Continuar con Google"
3. Si no tienes una cuenta de Google abierta, Google te pedirá que inicies sesión
4. Google te mostrará los permisos que necesita (email, nombre, foto)
5. Haz clic en "Continuar" o "Permitir"
6. Deberías ser redirigido a `/` (home) y estar autenticado
7. Haz clic en el avatar (esquina arriba a la derecha) y deberías ver tu nombre

---

## ¿Qué hacer si algo no funciona?

### El botón de Google no funciona
1. Abre DevTools (F12 en Chrome)
2. Ve a Console
3. Busca errores rojos
4. Si hay errores, revisa:
   - ¿GOOGLE_CLIENT_ID está en `.env`?
   - ¿NEXTAUTH_URL es exactamente `http://localhost:3000`?
   - ¿NEXTAUTH_SECRET tiene un valor?

### El Login con email/password no funciona
1. Ve a `http://localhost:3000/api/debug/status`
2. Busca el usuario que registraste en `list`
3. Si no está, probablemente hay error en registro
4. Abre la consola del servidor (terminal donde corre `npm run dev`)
5. Busca mensajes de error rojos

### Google no me redirige a mi app
1. Abre DevTools → Network
2. Busca requests a `localhost:3000/api/auth/callback/google`
3. Si no ves esa request, probablemente el problema es en Google Cloud Console
4. Verifica que agregaste `http://localhost:3000/api/auth/callback/google` en "Authorized redirect URIs"

---

## Verificar Logs en Terminal

Cuando inicias sesión, deberías ver en la terminal (donde corre `npm run dev`):

```
🔐 Google SignIn - Usuario: tu_email@gmail.com
📝 Creando nuevo usuario con Google: tu_email@gmail.com
👤 Creando nuevo usuario con Google
✅ Usuario creado: 1 tu_email@gmail.com
🔑 JWT Callback - user: tu_email@gmail.com account: google
🎯 Token actualizado con ID de usuario: 1
📋 Session creada para: tu_email@gmail.com ID: 1
```

Si ves estos mensajes, significa que **TODO está funcionando correctamente**.

---

## Checklist Final

Marca ✅ cada item:

- [ ] `http://localhost:3000/api/auth/debug` muestra todos ✓
- [ ] `http://localhost:3000/api/debug/status` muestra `"exists": true` para el rol
- [ ] `http://localhost:3000/test/google-login` crea un usuario de prueba
- [ ] Puedo registrarme en `http://localhost:3000/register`
- [ ] Puedo hacer login en `http://localhost:3000/login` con credenciales
- [ ] Puedo cerrar sesión desde el avatar en top-right
- [ ] Puedo hacer login con Google (si Google está configurado correctamente)
- [ ] Los logs en la terminal muestran los mensajes esperados

Si todo está marcado ✅, **tu aplicación está 100% funcionando**.

---

## ¿Necesitas ayuda?

Si algo no funciona, comparte:
1. El error que ves en DevTools → Console
2. Los logs de la terminal (donde corre `npm run dev`)
3. La respuesta de `http://localhost:3000/api/auth/debug`
4. La respuesta de `http://localhost:3000/api/debug/status`

Con esta información podré ayudarte a resolver el problema.
