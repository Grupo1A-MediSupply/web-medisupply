# 🔧 Configuración de Microservicios

Este proyecto está configurado para trabajar con microservicios desplegados en Google Cloud Run.

## 📡 Endpoints Configurados

### 1. **Auth Service**
```
https://auth-service-swn62v7z2q-uc.a.run.app
```
**Responsabilidades:**
- Registro de usuarios (`/auth/signup`)
- Inicio de sesión (`/auth/login`)
- Verificación MFA (`/auth/mfa/verify`)
- Cambio de contraseña (`/auth/change-password`)
- Perfil de usuario (`/auth/profile`)

### 2. **Product Service**
```
https://product-service-swn62v7z2q-uc.a.run.app
```
**Responsabilidades:**
- Gestión de productos (`/products`)
- Inventario
- Carga masiva de productos (`/products/bulk-upload`)

### 3. **Order Service**
```
https://order-service-swn62v7z2q-uc.a.run.app
```
**Responsabilidades:**
- Gestión de pedidos (`/orders`)
- Devoluciones (`/orders/:id/return`)
- Reportes de pedidos (`/reports`)

### 4. **Logistics Service**
```
https://logistics-service-swn62v7z2q-uc.a.run.app
```
**Responsabilidades:**
- Gestión de rutas (`/routes`)
- Generación de rutas optimizadas (`/routes/generate-optimal`)
- Seguimiento de entregas

### 5. **Notifications Service**
```
https://notifications-service-swn62v7z2q-uc.a.run.app
```
**Responsabilidades:**
- Notificaciones (`/notifications`)
- Gestión de alertas

## 🔑 Autenticación

Todos los servicios requieren autenticación mediante JWT token obtenido del **Auth Service**.

El token se almacena en `sessionStorage` después del login y se incluye automáticamente en todas las peticiones:

```
Authorization: Bearer <token>
```

## 📦 Servicios Angular Creados

### AuthService
```typescript
import { AuthService } from './core/services/auth.service';

constructor(private authService: AuthService) {}

// Login
this.authService.login({ email, password }).subscribe(...);

// Signup
this.authService.signup({ email, password, role, name }).subscribe(...);
```

### ProductService
```typescript
import { ProductService } from './core/services/product.service';

constructor(private productService: ProductService) {}

// Obtener productos
this.productService.getProducts().subscribe(...);

// Crear producto
this.productService.createProduct(product).subscribe(...);
```

### OrderService
```typescript
import { OrderService } from './core/services/order.service';

constructor(private orderService: OrderService) {}

// Obtener pedidos
this.orderService.getOrders().subscribe(...);

// Crear pedido
this.orderService.createOrder(order).subscribe(...);
```

### LogisticsService
```typescript
import { LogisticsService } from './core/services/logistics.service';

constructor(private logisticsService: LogisticsService) {}

// Obtener rutas
this.logisticsService.getRoutes().subscribe(...);

// Generar rutas optimizadas
this.logisticsService.generateOptimalRoutes(orderIds).subscribe(...);
```

### NotificationService
```typescript
import { NotificationService } from './core/services/notification.service';

constructor(private notificationService: NotificationService) {}

// Obtener notificaciones
this.notificationService.getNotifications().subscribe(...);

// Marcar como leída
this.notificationService.markAsRead(id).subscribe(...);
```

## ⚙️ Configuración

Los endpoints están configurados en:

### Development
`src/environments/environment.ts`
```typescript
services: {
  auth: 'https://auth-service-swn62v7z2q-uc.a.run.app',
  product: 'https://product-service-swn62v7z2q-uc.a.run.app',
  order: 'https://order-service-swn62v7z2q-uc.a.run.app',
  logistics: 'https://logistics-service-swn62v7z2q-uc.a.run.app',
  notifications: 'https://notifications-service-swn62v7z2q-uc.a.run.app'
}
```

### Production
`src/environments/environment.prod.ts`
```typescript
// Misma configuración o URLs diferentes según tu setup
```

## 🔄 Flujo de Uso

1. **Usuario inicia sesión** → `AuthService.login()` → Token guardado en sessionStorage
2. **Solicitudes a otros servicios** → Token incluido automáticamente en headers
3. **Si token expira** → Usuario debe volver a iniciar sesión

## 🛠️ ApiService Base

El `ApiService` base ha sido actualizado para soportar múltiples endpoints:

```typescript
// Usar servicio específico
this.api.get('/products', environment.services.product);

// O usar URL por defecto (si existe)
this.api.get('/api/products');
```

## 🐛 Troubleshooting

### Error: CORS
Si recibes errores de CORS, verifica que los servicios tengan configurado CORS para permitir tu dominio.

### Error: 401 Unauthorized
- Verifica que el token esté guardado en `sessionStorage`
- Verifica que el token no haya expirado
- Vuelve a iniciar sesión si es necesario

### Error: 403 Forbidden
- Verifica que el usuario tenga los permisos necesarios para la acción
- Verifica el rol del usuario (vendor/client)

### Error: Network Error
- Verifica que los servicios estén disponibles
- Verifica la conectividad a internet
- Verifica las URLs en `environment.ts`

## 📝 Notas

- Todos los servicios deben seguir el mismo formato de autenticación JWT
- Los tokens se comparten entre servicios
- Los servicios son independientes y pueden escalarse por separado
- Cada servicio tiene su propia base de datos o almacenamiento

## 🔒 Seguridad

- Los tokens JWT se almacenan en `sessionStorage` (se eliminan al cerrar el navegador)
- El token se incluye automáticamente en todas las peticiones autenticadas
- No se debe almacenar el token en `localStorage` por seguridad

## 📚 Próximos Pasos

1. **Actualizar componentes** para usar los servicios específicos
2. **Implementar manejo de errores** más robusto
3. **Agregar interceptors** para manejar tokens expirados
4. **Implementar refresh tokens** si los servicios lo soportan
5. **Agregar guards** para proteger rutas según roles

