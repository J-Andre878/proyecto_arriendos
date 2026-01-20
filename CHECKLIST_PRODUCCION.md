# ✅ Checklist para Producción - Arriendos Loja

## 🔴 CRÍTICO - Debe hacerse ANTES de producción

### 1. Seguridad y Credenciales

- [ ] **Cambiar PayPal de Sandbox a Producción**
  - Ir a https://developer.paypal.com
  - Cambiar de modo "Sandbox" a "Live"
  - Obtener nuevas credenciales de PRODUCCIÓN
  - Actualizar en `.env`:
    ```bash
    PAYPAL_CLIENT_ID=tu_client_id_de_produccion
    PAYPAL_CLIENT_SECRET=tu_secret_de_produccion
    PAYPAL_API_URL=https://api-m.paypal.com
    ```

- [ ] **Generar nueva NEXTAUTH_SECRET para producción**
  ```bash
  openssl rand -base64 32
  ```
  - Actualizar `NEXTAUTH_SECRET` en `.env` de producción
  - Nunca reutilizar el secret de desarrollo

- [ ] **Configurar NEXTAUTH_URL para producción**
  ```bash
  NEXTAUTH_URL=https://tu-dominio.com
  ```

- [ ] **Verificar que .env NO esté en git**
  - ✅ Ya está en `.gitignore`
  - Confirmar que no se haya subido accidentalmente al repositorio

### 2. Base de Datos

- [ ] **Usar base de datos de producción separada**
  - Crear nueva base de datos PostgreSQL en producción
  - NO usar la misma DB de desarrollo
  - Actualizar `DATABASE_URL` en producción

- [ ] **Ejecutar migraciones en producción**
  ```bash
  npx prisma migrate deploy
  npx prisma generate
  ```

- [ ] **Backups automáticos**
  - Configurar backups diarios de PostgreSQL
  - Probar restauración de backups

### 3. Google OAuth - Producción

- [ ] **Actualizar Google Cloud Console**
  - Ir a https://console.cloud.google.com
  - En tu proyecto OAuth, agregar URLs autorizadas:
    - JavaScript origins: `https://tu-dominio.com`
    - Redirect URIs: `https://tu-dominio.com/api/auth/callback/google`
  - Las credenciales actuales solo funcionan para `http://localhost:3000`

### 4. Cloudinary

- [ ] **Verificar límites del plan gratuito**
  - Plan Free: 25 créditos/mes = ~500 imágenes
  - Considerar upgrade si hay muchos usuarios
  - Monitorear uso en https://cloudinary.com/console

## 🟠 IMPORTANTE - Recomendado antes de producción

### 5. Funcionalidades Faltantes

- [ ] **Sistema de Reservas/Bookings**
  - Actualmente solo muestra "No disponible" en la UI
  - Implementar calendario de disponibilidad
  - Procesar reservas reales
  - Emails de confirmación

- [ ] **Cron Job para Expiración de Publicaciones**
  - Las publicaciones expiran a los 30 días
  - Crear job que revise `expires_at` diariamente
  - Desactivar propiedades expiradas automáticamente
  - Notificar a usuarios sobre renovación
  ```bash
  # Ejemplo con Vercel Cron o similar
  # GET /api/cron/expire-properties
  ```

- [ ] **Dashboard de Usuario**
  - Mis publicaciones activas
  - Historial de pagos
  - Editar/eliminar propiedades
  - Ver estadísticas (vistas, favoritos)
  - Renovar publicaciones

- [ ] **Sistema de Notificaciones**
  - Emails cuando:
    - Pago exitoso
    - Publicación próxima a expirar (7 días antes)
    - Publicación expirada
    - Nueva reserva (cuando se implemente)

- [ ] **Búsqueda y Filtros**
  - Filtrar por precio, número de huéspedes, ciudad
  - Búsqueda por ubicación/mapa
  - Ordenar por precio, fecha, popularidad

### 6. SEO y Performance

- [ ] **Metadata de Next.js**
  - Agregar `metadata` en cada página:
    ```tsx
    export const metadata = {
      title: 'Arriendos Loja - Alquiler de propiedades',
      description: '...',
      openGraph: { ... }
    }
    ```

- [ ] **Sitemap y robots.txt**
  ```bash
  # Crear public/robots.txt
  # Crear app/sitemap.ts para sitemap dinámico
  ```

- [ ] **Optimización de imágenes**
  - ✅ Ya usa Next.js Image con Cloudinary
  - Verificar que todas las imágenes usen `<Image>`

- [ ] **Google Analytics / Plausible**
  - Agregar tracking de visitas
  - Medir conversiones de pago

### 7. Error Handling y Logging

- [ ] **Manejo de errores mejorado**
  - Agregar `app/error.tsx` para errores globales
  - Agregar `app/not-found.tsx` personalizado
  - Capturar errores de API en un servicio (ej: Sentry)

- [ ] **Logging en producción**
  - Integrar Sentry, LogRocket, o similar
  - Monitorear errores de PayPal
  - Logs de transacciones

### 8. Legal y Compliance

- [ ] **Política de Privacidad**
  - Crear página `/legal/privacy`
  - Explicar uso de datos, Google OAuth, cookies
  - Cumplir con GDPR si aplica

- [ ] **Términos y Condiciones**
  - Crear página `/legal/terms`
  - Definir reglas de cancelación
  - Responsabilidades de anfitriones/huéspedes

- [ ] **Aviso de cookies**
  - Banner de consentimiento si usas cookies de tracking

### 9. Testing

- [ ] **Testing de pago real**
  - Hacer un pago de prueba de $3 USD real con PayPal Live
  - Verificar que la propiedad se active correctamente
  - Verificar que expire después de 30 días

- [ ] **Testing de flujo completo**
  - Registro → Login → Crear propiedad → Pagar → Ver publicación
  - Probar en móvil y desktop
  - Probar diferentes navegadores

- [ ] **Testing de seguridad**
  - Verificar que usuarios no puedan:
    - Ver propiedades de otros en estado borrador
    - Editar propiedades de otros
    - Acceder a APIs sin autenticación

## 🟡 MEJORAS - Pueden hacerse después de lanzar

### 10. Mejoras de UX

- [ ] **Cargas con Skeleton/Loading states**
  - Mostrar skeletons mientras cargan propiedades
  - Indicadores de progreso en uploads

- [ ] **Mensajería entre usuarios**
  - Chat anfitrión ↔ huésped
  - Tabla `messages` ya existe en BD

- [ ] **Sistema de Favoritos**
  - Tabla `favorites` ya existe
  - Implementar UI para guardar/ver favoritos

- [ ] **Sistema de Reviews**
  - Tabla `reviews` ya existe
  - Permitir calificaciones después de estancia

### 11. Panel de Administración

- [ ] **Dashboard Admin**
  - Ver todas las propiedades
  - Aprobar/rechazar publicaciones
  - Ver usuarios y pagos
  - Estadísticas generales

### 12. Optimizaciones

- [ ] **Caché de consultas frecuentes**
  - Usar Redis para listados de propiedades
  - Caché de imágenes de Cloudinary

- [ ] **Rate Limiting**
  - Limitar requests a APIs (ej: 100/hora por IP)
  - Prevenir spam en registro/login

- [ ] **Internacionalización (i18n)**
  - Soporte para inglés además de español
  - Usar next-intl o similar

## 📋 Fixes Técnicos Pendientes

### 13. Prisma

- [ ] **Resolver problemas de tipos de Prisma**
  - Actualmente usa `$executeRaw` como workaround
  - Limpiar caché y regenerar:
    ```bash
    rm -rf node_modules/.prisma
    rm -rf .next
    npx prisma generate
    npm run build
    ```
  - Re-agregar filtro `publication_status` en [app/page.tsx](app/page.tsx#L10)

### 14. Deployment

- [ ] **Elegir plataforma de hosting**
  - **Opción 1: Vercel** (Recomendado para Next.js)
    - Fácil deployment con git push
    - Serverless functions automáticas
    - Variables de entorno en UI
    - Free tier generoso
  
  - **Opción 2: Railway/Render**
    - Hosting de PostgreSQL incluido
    - Más control sobre configuración

- [ ] **Variables de entorno en producción**
  - Configurar TODAS las variables en la plataforma:
    - `DATABASE_URL`
    - `NEXTAUTH_URL`
    - `NEXTAUTH_SECRET`
    - `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_API_URL`
    - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
    - `CLOUDINARY_*`

- [ ] **Configurar dominio personalizado**
  - Comprar dominio (ej: arriendosloja.com)
  - Configurar DNS
  - Habilitar HTTPS (automático en Vercel)

## 🎯 Resumen de Prioridades

### AHORA (Antes de lanzar):
1. ✅ Cambiar PayPal a modo Live
2. ✅ Configurar URLs de producción
3. ✅ Nueva base de datos
4. ✅ Actualizar Google OAuth URLs
5. ✅ Testing de pago real

### PRONTO (Primera semana):
6. Dashboard de usuario
7. Cron job de expiración
8. Sistema de notificaciones por email
9. Búsqueda y filtros básicos

### DESPUÉS (Roadmap):
10. Sistema de reservas completo
11. Mensajería y reviews
12. Panel de administración

## 📊 Estado Actual

✅ **Completado:**
- Autenticación con NextAuth + Google OAuth
- CRUD de propiedades con imágenes (Cloudinary)
- Sistema de pagos con PayPal (Sandbox)
- Publicación y expiración a 30 días
- Vista de detalle de propiedades
- Homepage con listado

⏳ **En progreso:**
- Migración a PayPal Live
- Testing de producción

❌ **Pendiente:**
- Sistema de reservas
- Dashboard de usuario
- Notificaciones
- Panel admin

---

**Nota importante:** El proyecto está funcional para demo/desarrollo, pero necesita los puntos marcados como 🔴 CRÍTICO antes de aceptar pagos reales de usuarios.
