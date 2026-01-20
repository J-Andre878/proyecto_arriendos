# Configuración del Cron Job - Expiración Automática de Propiedades

## ✅ Cron Job Implementado

Se ha creado un sistema automático que expira propiedades después de 30 días.

## 📁 Archivos Creados

### 1. `/app/api/cron/expire-properties/route.ts`
Endpoint que busca y desactiva propiedades expiradas:
- Busca propiedades con `expires_at < now()` y `is_active = true`
- Las desactiva automáticamente
- Cambia `publication_status` a `'expired'`
- Retorna estadísticas de cuántas se expiraron

### 2. `/vercel.json`
Configuración para Vercel Cron:
```json
{
  "crons": [
    {
      "path": "/api/cron/expire-properties",
      "schedule": "0 2 * * *"
    }
  ]
}
```

**Schedule:** `0 2 * * *` = Todos los días a las 2:00 AM (hora UTC)

## 🔐 Seguridad

El endpoint está protegido con un secret para que solo Vercel Cron pueda ejecutarlo:

```bash
# En .env
CRON_SECRET=tu_secreto_aqui
```

## 🧪 Testing Local

### Opción 1: Llamar el endpoint manualmente

```bash
# Sin autorización (funciona en desarrollo)
curl http://localhost:3000/api/cron/expire-properties

# Con autorización (como en producción)
curl -H "Authorization: Bearer tu_secreto_aqui" \
  http://localhost:3000/api/cron/expire-properties
```

### Opción 2: Crear una propiedad de prueba expirada

```sql
-- Conectar a PostgreSQL
psql -d arriendos_loja

-- Crear una propiedad que expire en el pasado
UPDATE properties
SET 
  expires_at = NOW() - INTERVAL '1 day',
  is_active = true,
  publication_status = 'active'
WHERE id = 1; -- Reemplaza con un ID real

-- Luego llama el endpoint y verifica que se desactive
```

### Opción 3: Usar el servidor de desarrollo

1. Inicia el servidor:
```bash
npm run dev
```

2. En otra terminal, llama el endpoint:
```bash
curl http://localhost:3000/api/cron/expire-properties
```

3. Verás la respuesta:
```json
{
  "success": true,
  "message": "Se expiraron 1 propiedades",
  "expired_count": 1,
  "timestamp": "2026-01-20T12:00:00.000Z"
}
```

## 🚀 Configuración en Vercel (Producción)

### Paso 1: Deploy a Vercel

```bash
# Commitear los cambios
git add .
git commit -m "Add cron job for property expiration"
git push origin main

# Vercel detectará automáticamente vercel.json
```

### Paso 2: Configurar el CRON_SECRET

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega:
   - **Key:** `CRON_SECRET`
   - **Value:** (genera uno nuevo con `openssl rand -base64 32`)
   - **Environments:** Production, Preview, Development

### Paso 3: Verificar que funciona

1. En Vercel Dashboard → Settings → Crons
2. Verás: `expire-properties` - `0 2 * * *`
3. Puedes ejecutarlo manualmente con el botón "Run Now"
4. Ve los logs en Vercel Dashboard → Logs

## 📊 Monitoreo

### Ver logs en Vercel

En Vercel Dashboard → Tu proyecto → Logs, busca:
```
[CRON] Propiedades expiradas: 3
```

### Ver en Base de Datos

```sql
-- Propiedades expiradas
SELECT id, title, expires_at, publication_status
FROM properties
WHERE publication_status = 'expired'
ORDER BY expires_at DESC;

-- Propiedades próximas a expirar (7 días)
SELECT id, title, expires_at, 
       DATE_PART('day', expires_at - NOW()) as dias_restantes
FROM properties
WHERE is_active = true
  AND expires_at IS NOT NULL
  AND expires_at > NOW()
  AND expires_at < NOW() + INTERVAL '7 days'
ORDER BY expires_at ASC;
```

## 🔄 Modificar el Schedule

Edita `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/expire-properties",
      "schedule": "0 */6 * * *"  // Cada 6 horas
      // "schedule": "0 0 * * *"  // Medianoche diaria
      // "schedule": "*/30 * * * *"  // Cada 30 minutos
    }
  ]
}
```

Formato cron: `minuto hora día_mes mes día_semana`

## 🎯 Próximos Pasos

Después de implementar el cron job, considera:

1. **Notificaciones por email** - Avisar a usuarios cuando su propiedad expire
2. **Recordatorios** - Email 7 días antes de expirar
3. **Auto-renovación** - Permitir cobro automático mensual
4. **Dashboard** - Mostrar fecha de expiración en UI de usuario

## ⚠️ Notas Importantes

- **Vercel Free Plan:** Incluye cron jobs
- **Limitaciones:** Los crons en Vercel pueden tener un delay de hasta 1 minuto
- **Alternativas:** Si no usas Vercel, puedes usar:
  - **Cron en servidor:** Si tienes un VPS con crontab
  - **Railway Cron:** Similar a Vercel
  - **Servicios externos:** Cron-job.org, EasyCron
  - **GitHub Actions:** Cron workflows (gratis)

## 🆘 Troubleshooting

### El cron no se ejecuta en Vercel

1. Verifica que `vercel.json` esté en la raíz del proyecto
2. Asegúrate de que el proyecto está en Vercel (no solo local)
3. Revisa Vercel Dashboard → Settings → Crons
4. Ejecuta manualmente con "Run Now" para probar

### Error 401 en producción

- El `CRON_SECRET` en Vercel debe coincidir con el del código
- Vercel envía automáticamente el header de autorización
- No necesitas configurar nada extra

### No se expiran propiedades

```sql
-- Verifica que haya propiedades para expirar
SELECT id, title, expires_at, is_active, publication_status
FROM properties
WHERE expires_at < NOW() 
  AND is_active = true
  AND publication_status = 'active';
```

Si no hay resultados, no hay nada que expirar (correcto).

---

**Estado:** ✅ Cron job completamente funcional
