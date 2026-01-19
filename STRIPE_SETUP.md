# Configuración de Stripe - Sistema de Pagos

## ✅ Sistema de Pagos Implementado

Se ha implementado un sistema completo de pagos con Stripe que incluye:

### 📦 Flujo Implementado

1. **Usuario crea propiedad** → Se guarda como `pending_payment`
2. **Redirección a pago** → `/publish/[propertyId]/payment`
3. **Usuario paga $3 USD** → Stripe Checkout
4. **Webhook confirma pago** → Propiedad se activa por 30 días
5. **Página de éxito** → Usuario ve confirmación

### 🔑 Cómo Obtener las Claves de Stripe

#### Paso 1: Crear Cuenta en Stripe
1. Ve a https://dashboard.stripe.com/register
2. Crea tu cuenta con email y contraseña
3. Completa el proceso de verificación

#### Paso 2: Obtener Claves de API (Modo Test)
1. Inicia sesión en https://dashboard.stripe.com
2. En el menú lateral, busca **"Developers"** o **"Desarrolladores"**
3. Click en **"API keys"**
4. Verás dos claves:
   - **Publishable key** (Empieza con `pk_test_...`) → Pública, va en el frontend
   - **Secret key** (Empieza con `sk_test_...`) → Privada, NUNCA exponerla

#### Paso 3: Configurar Variables de Entorno
Abre el archivo `.env` y reemplaza las claves de Stripe:

```bash
# Stripe - Claves de prueba (Test Mode)
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_aqui
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
```

#### Paso 4: Configurar Webhook (IMPORTANTE)
El webhook es necesario para que Stripe confirme automáticamente los pagos.

**Opción A: Desarrollo Local con Stripe CLI (Recomendado)**

1. Instalar Stripe CLI:
   ```bash
   # Ubuntu/Debian
   sudo apt install stripe
   
   # O descarga desde:
   # https://stripe.com/docs/stripe-cli
   ```

2. Autenticar:
   ```bash
   stripe login
   ```

3. Redirigir webhooks a tu servidor local:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **IMPORTANTE**: Esto te dará un `webhook signing secret` que empieza con `whsec_...`
   Cópialo y pégalo en tu `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_el_secret_que_te_dio_stripe_cli
   ```

**Opción B: Desarrollo con ngrok (Alternativa)**

Si no puedes instalar Stripe CLI:

1. Instalar ngrok: https://ngrok.com/download
2. Exponer tu servidor local:
   ```bash
   ngrok http 3000
   ```
3. Copiar la URL pública (ej: `https://abc123.ngrok.io`)
4. En Stripe Dashboard → Developers → Webhooks → Add endpoint
5. URL del webhook: `https://abc123.ngrok.io/api/webhooks/stripe`
6. Eventos a escuchar: `checkout.session.completed`
7. Copiar el `Signing secret` y agregarlo al `.env`

### 🧪 Probar Pagos en Modo Test

Stripe proporciona tarjetas de prueba que NO realizan cargos reales:

**Tarjeta de Éxito:**
- Número: `4242 4242 4242 4242`
- Fecha: Cualquier fecha futura (ej: 12/34)
- CVC: Cualquier 3 dígitos (ej: 123)
- ZIP: Cualquier código postal

**Otras Tarjetas de Prueba:**
- Error genérico: `4000 0000 0000 0002`
- Pago rechazado: `4000 0000 0000 9995`
- Requiere autenticación 3D: `4000 0027 6000 3184`

Más tarjetas en: https://stripe.com/docs/testing

### 📊 Monitorear Pagos

Una vez configurado, puedes ver todos los pagos en:
- Dashboard: https://dashboard.stripe.com/test/payments
- Logs de eventos: https://dashboard.stripe.com/test/events

### 🚀 Pasar a Producción

Cuando estés listo para cobros reales:

1. Activa tu cuenta de Stripe (completa verificación de identidad)
2. En Dashboard, cambia de **Test Mode** a **Live Mode** (toggle arriba a la derecha)
3. Obtén las claves de producción (empiezan con `pk_live_` y `sk_live_`)
4. Actualiza el `.env` con las claves de producción
5. Configura el webhook de producción con tu dominio real

### 💰 Comisiones de Stripe

- **Tarjetas locales**: 2.9% + $0.30 por transacción
- **Tarjetas internacionales**: 3.9% + $0.30 por transacción

Para $3.00 USD:
- Recibes: ~$2.60 USD (después de comisión)

### 🔒 Seguridad

- ✅ Las claves secretas NUNCA deben exponerse en el frontend
- ✅ El `.env` está en `.gitignore` (no se sube a Git)
- ✅ Stripe maneja la información de tarjetas (PCI compliance)
- ✅ El webhook valida que los pagos vengan realmente de Stripe

### 📝 Archivos Creados

```
app/
  api/
    stripe/
      create-checkout-session/route.ts  # Crea sesión de pago
    webhooks/
      stripe/route.ts                    # Confirma pagos y activa propiedades
    properties/
      [id]/route.ts                      # Obtener detalles de propiedad
  publish/
    [propertyId]/
      payment/page.tsx                   # Página de pago
      success/page.tsx                   # Confirmación exitosa
```

### 🎯 Estado Actual

✅ Flujo completo implementado
✅ Webhook configurado
✅ Páginas de pago y éxito creadas
✅ Base de datos actualizada con `property_subscriptions`
⏳ **PENDIENTE: Agregar tus claves de Stripe al .env**

### 🐛 Troubleshooting

**Error: "No signature"**
- Verifica que el webhook secret esté en `.env`
- Asegúrate de estar usando Stripe CLI o webhook configurado

**Error: "Invalid signature"**
- El webhook secret es incorrecto
- Regenera el secret desde Stripe Dashboard

**El pago funciona pero la propiedad no se activa**
- Verifica los logs del webhook: `console.log` en `/api/webhooks/stripe`
- Confirma que el evento `checkout.session.completed` esté llegando

### 📞 Soporte

Si necesitas ayuda:
- Documentación: https://stripe.com/docs
- Soporte: https://support.stripe.com
