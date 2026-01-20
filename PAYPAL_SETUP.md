# Configuración de PayPal - Sistema de Pagos

## ✅ Sistema de Pagos Implementado

Se ha implementado un sistema completo de pagos con PayPal que incluye:

### 📦 Flujo Implementado

1. **Usuario crea propiedad** → Se guarda como `pending_payment`
2. **Redirección a pago** → `/publish/[propertyId]/payment`
3. **Usuario paga $3 USD** → PayPal Checkout
4. **PayPal confirma pago** → Propiedad se activa por 30 días
5. **Página de éxito** → Usuario ve confirmación

### 🔑 Cómo Obtener las Claves de PayPal

#### Paso 1: Crear Cuenta en PayPal Developer
1. Ve a https://developer.paypal.com
2. Inicia sesión con tu cuenta de PayPal (o crea una)
3. Acepta los términos de desarrollador

#### Paso 2: Crear una App en Sandbox (Modo Prueba)
1. En el menú, ve a **"Dashboard"**
2. Click en **"Apps & Credentials"**
3. Asegúrate de estar en modo **"Sandbox"** (toggle arriba)
4. Click en **"Create App"**
5. Nombre: "Arriendos Loja"
6. Click **"Create App"**

#### Paso 3: Obtener las Credenciales
Verás dos claves:
- **Client ID** (Empieza con algo como `AQk...`)
- **Secret** (Click en "Show" para verla)

#### Paso 3: Configurar Variables de Entorno
Abre el archivo `.env` y reemplaza las claves de PayPal:

```bash
# PayPal - Claves de prueba (Sandbox Mode)
PAYPAL_CLIENT_ID=tu_client_id_del_sandbox
PAYPAL_CLIENT_SECRET=tu_secret_del_sandbox
```

### 🧪 Probar Pagos en Modo Sandbox

PayPal Sandbox te permite hacer pagos de prueba sin dinero real:

**Cuentas de Prueba:**

1. En PayPal Developer → **"Sandbox" → "Accounts"**
2. Verás cuentas de prueba creadas automáticamente:
   - **Personal (Comprador)**: Para hacer el pago
   - **Business (Vendedor)**: Tu cuenta que recibe el dinero

**Credenciales de Prueba:**
- Email: `sb-xxxxx@personal.example.com`
- Password: (Click en "..." → "View/Edit Account" para ver la contraseña)

**Flujo de Prueba:**
1. Usuario crea propiedad en tu app
2. Click en "Proceder al Pago"
3. Se abre PayPal Checkout
4. Inicia sesión con la cuenta **Personal** de prueba
5. Confirma el pago
6. Regresa a tu app y verifica que la propiedad se activó

### 📊 Monitorear Pagos

Puedes ver todos los pagos en:
- Sandbox Transactions: https://developer.paypal.com/developer/accounts/
- Selecciona tu cuenta Business → Ver transacciones

### 🚀 Pasar a Producción

Cuando estés listo para cobros reales:

1. Completa la verificación de tu cuenta de PayPal Business
2. En PayPal Developer, cambia de **Sandbox** a **Live**
3. Crea una nueva App en modo Live
4. Obtén las nuevas credenciales (Client ID y Secret de producción)
5. Actualiza el `.env`:
   ```bash
   PAYPAL_CLIENT_ID=tu_client_id_live
   PAYPAL_CLIENT_SECRET=tu_secret_live
   ```

### 💰 Comisiones de PayPal

- **Pagos dentro del país**: 3.4% + tarifa fija
- **Pagos internacionales**: 4.4% + tarifa fija
- **Tarifa fija**: Varía por país (~$0.30 USD)

Para $3.00 USD:
- Recibes: ~$2.60 USD (después de comisión)

### 🌎 PayPal en Ecuador

PayPal funciona en Ecuador y acepta:
- ✅ **Tarjetas de crédito/débito** locales e internacionales
- ✅ **Cuenta PayPal** (si el usuario tiene una)
- ✅ **Visa, Mastercard, American Express**

**Nota**: PayPal es más popular que Stripe en Latinoamérica

### 🔒 Seguridad

- ✅ Las claves secretas NUNCA deben exponerse en el frontend
- ✅ El `.env` está en `.gitignore` (no se sube a Git)
- ✅ Stripe maneja la información de tarjetas (PCI compliance)
- ✅ El webhook valida que los pagos vengan realmente de Stripe

### 📝 Archivos Creados

```
app/
  api/
    paypal/
      create-order/route.ts          # Crea orden de pago en PayPal
      capture-order/route.ts         # Captura y confirma el pago
    properties/
      [id]/route.ts                  # Obtener detalles de propiedad
  publish/
    [propertyId]/
      payment/page.tsx               # Página de pago
      success/page.tsx               # Confirmación exitosa
```

### 🎯 Estado Actual

✅ Flujo completo implementado con PayPal
✅ Páginas de pago y éxito creadas
✅ Base de datos actualizada con `property_subscriptions`
⏳ **PENDIENTE: Agregar tus claves de PayPal al .env**

### 🐛 Troubleshooting

**Error: "Authentication failed"**
- Verifica que las credenciales de PayPal estén correctas en `.env`
- Asegúrate de estar usando las claves del Sandbox

**El pago funciona pero la propiedad no se activa**
- Verifica los logs del servidor: `console.log` en `/api/paypal/capture-order`
- Confirma que el status de la orden es "COMPLETED"

**Error al redirigir a PayPal**
- Verifica que `NEXTAUTH_URL` esté configurado correctamente
- Asegúrate de que las URLs de retorno sean accesibles

### 📞 Soporte

Si necesitas ayuda:
- Documentación: https://stripe.com/docs
- Soporte: https://support.stripe.com
