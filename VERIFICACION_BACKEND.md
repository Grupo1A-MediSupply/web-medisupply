# ✅ Verificación de Conexión con Backend GCP

## 📋 Resumen de Configuración

### URLs de Servicios Configuradas

Los siguientes servicios están configurados en `environment.ts` y `environment.prod.ts`:

| Servicio | URL | Estado |
|----------|-----|--------|
| **Auth Service** | `https://auth-service-swn62v7z2q-uc.a.run.app` | ⚠️ Verificar |
| **Product Service** | `https://product-service-swn62v7z2q-uc.a.run.app` | ⚠️ Verificar |
| **Order Service** | `https://order-service-swn62v7z2q-uc.a.run.app` | ⚠️ Verificar |
| **Logistics Service** | `https://logistics-service-swn62v7z2q-uc.a.run.app` | ⚠️ Verificar |
| **Notifications Service** | `https://notifications-service-swn62v7z2q-uc.a.run.app` | ⚠️ Verificar |

## 🔍 Verificación Manual

### 1. Verificar desde el Navegador

Abre las siguientes URLs en tu navegador y verifica que respondan:

- **Auth Service**: https://auth-service-swn62v7z2q-uc.a.run.app
- **Product Service**: https://product-service-swn62v7z2q-uc.a.run.app
- **Order Service**: https://order-service-swn62v7z2q-uc.a.run.app
- **Logistics Service**: https://logistics-service-swn62v7z2q-uc.a.run.app
- **Notifications Service**: https://notifications-service-swn62v7z2q-uc.a.run.app

**Respuestas esperadas:**
- `200 OK` - Servicio funcionando
- `401 Unauthorized` - Servicio funcionando pero requiere autenticación (normal)
- `404 Not Found` - Servicio funcionando pero endpoint no existe (normal si no hay endpoint raíz)
- `403 Forbidden` - Servicio funcionando pero acceso restringido
- `Timeout` o `Connection refused` - Servicio no disponible

### 2. Verificar desde la Consola del Navegador

1. Abre la aplicación Angular en el navegador
2. Abre las **DevTools** (F12)
3. Ve a la pestaña **Network**
4. Intenta hacer login o cargar datos
5. Verifica las peticiones HTTP:

```javascript
// Ejemplo de verificación en consola del navegador
fetch('https://auth-service-swn62v7z2q-uc.a.run.app/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123'
  })
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => console.log('Response:', data))
.catch(error => console.error('Error:', error));
```

### 3. Verificar CORS

Si ves errores de CORS en la consola del navegador, los servicios necesitan configurar CORS para permitir el dominio del frontend.

**Error típico:**
```
Access to fetch at 'https://auth-service...' from origin 'http://localhost:4200' 
has been blocked by CORS policy
```

**Solución:** Los servicios backend deben incluir los headers CORS apropiados.

## 📝 Verificación de Código

### Servicios Configurados Correctamente

✅ **ApiService** (`src/app/core/services/api.service.ts`)
- Configurado para usar las URLs base de los servicios
- Incluye headers de autenticación automáticamente
- Maneja errores correctamente

✅ **AuthService** (`src/app/core/services/auth.service.ts`)
- Usa: `https://auth-service-swn62v7z2q-uc.a.run.app`
- Endpoints: `/auth/signup`, `/auth/login`, `/auth/mfa/verify`, etc.

✅ **ProductService** (`src/app/core/services/product.service.ts`)
- Usa: `https://product-service-swn62v7z2q-uc.a.run.app`
- Endpoints: `/products`, `/products/:id`, `/products/bulk-upload`

✅ **OrderService** (`src/app/core/services/order.service.ts`)
- Usa: `https://order-service-swn62v7z2q-uc.a.run.app`
- Endpoints: `/orders`, `/orders/:id`, `/orders/:id/return`

✅ **LogisticsService** (`src/app/core/services/logistics.service.ts`)
- Usa: `https://logistics-service-swn62v7z2q-uc.a.run.app`
- Endpoints: `/routes`, `/routes/:id`, `/routes/generate-optimal`

## 🧪 Pruebas de Integración

### Prueba 1: Login
```typescript
// En la consola del navegador o en un componente
this.authService.login({
  email: 'usuario@ejemplo.com',
  password: 'password123'
}).subscribe({
  next: (response) => console.log('Login exitoso:', response),
  error: (error) => console.error('Error de login:', error)
});
```

### Prueba 2: Obtener Productos
```typescript
this.productService.getProducts().subscribe({
  next: (response) => console.log('Productos:', response),
  error: (error) => console.error('Error:', error)
});
```

### Prueba 3: Obtener Pedidos
```typescript
this.orderService.getOrders().subscribe({
  next: (response) => console.log('Pedidos:', response),
  error: (error) => console.error('Error:', error)
});
```

## ⚠️ Problemas Comunes

### 1. Servicios no responden
**Causa:** Los servicios no están desplegados o las URLs son incorrectas
**Solución:** Verificar en GCP Console que los servicios estén desplegados

### 2. Error 401/403
**Causa:** Servicio requiere autenticación
**Solución:** Normal, hacer login primero

### 3. Error CORS
**Causa:** Servicios no tienen CORS configurado
**Solución:** Configurar CORS en los servicios backend para permitir el origen del frontend

### 4. Timeout
**Causa:** Servicios tardan mucho en responder o están caídos
**Solución:** Verificar estado de los servicios en GCP

## 🔧 Script de Verificación

Ejecuta el script de verificación:

```bash
./scripts/verify-backend-connection.sh
```

Este script prueba la conectividad básica con todos los servicios.

## 📊 Checklist de Verificación

- [ ] URLs de servicios correctas en `environment.ts`
- [ ] URLs de servicios correctas en `environment.prod.ts`
- [ ] Servicios accesibles desde el navegador
- [ ] CORS configurado en los servicios backend
- [ ] Login funciona correctamente
- [ ] Carga de datos funciona (productos, pedidos, rutas)
- [ ] Creación de recursos funciona (pedidos, productos)
- [ ] Actualización de recursos funciona
- [ ] Manejo de errores funciona correctamente

## 🚀 Próximos Pasos

1. **Verificar que los servicios estén desplegados en GCP**
   ```bash
   gcloud run services list --region=us-central1
   ```

2. **Verificar permisos de acceso**
   ```bash
   gcloud run services describe auth-service --region=us-central1
   ```

3. **Probar endpoints específicos**
   - Usar Postman o curl para probar endpoints directamente
   - Verificar que los endpoints respondan correctamente

4. **Revisar logs de los servicios**
   ```bash
   gcloud logging read "resource.type=cloud_run_revision" --limit=50
   ```

## 📞 Soporte

Si los servicios no responden, verifica:
1. Estado de los servicios en GCP Console
2. Logs de Cloud Run
3. Configuración de IAM y permisos
4. Configuración de CORS en los servicios

