# 🎭 ¿Para qué se usan los datos Mock en este proyecto?

## 📋 Definición

Los **datos mock** (también llamados "datos de prueba" o "datos simulados") son datos falsos o de ejemplo que se usan en lugar de hacer llamadas reales a una API o base de datos.

## 🎯 Propósitos en este Proyecto

### 1. **Desarrollo Frontend Independiente** 🚀
Permite desarrollar y probar la interfaz de usuario (UI) **sin depender del backend**.

**Ejemplo:**
```typescript
// vendor-dashboard.component.ts
orders = [
  {id: 'ORD-1001', product: 'Insulina - Lote A1', status: 'Creado'},
  {id: 'ORD-1000', product: 'Equipo de monitoreo', status: 'Programado'},
  // ... más pedidos mock
];
```

**Ventajas:**
- ✅ Puedes desarrollar el frontend mientras el backend aún no está listo
- ✅ No necesitas servidor corriendo para trabajar
- ✅ Desarrollo más rápido de la UI

### 2. **Demostración y Prototipado** 🎨
Permite mostrar cómo se verá la aplicación completa con datos realistas.

**Ejemplo:**
```typescript
// client-dashboard.component.ts
orders = [
  {
    id: 'PED-1001', 
    product: 'Insulina - Lote A1', 
    status: 'Pendiente',
    institutionName: 'Hospital San Rafael',
    deliveryAddress: 'Calle 10 #20-30, Bogotá',
    contact: 'Dr. María González',
    // ... datos completos y realistas
  }
];
```

**Ventajas:**
- ✅ Puedes mostrar la aplicación completa a stakeholders
- ✅ Visualización de cómo funcionará la UI
- ✅ Pruebas de usabilidad con datos realistas

### 3. **Testing y Validación** 🧪
Permite probar la funcionalidad del frontend sin necesidad de un backend real.

**Ejemplo:**
```typescript
// order-create.component.ts
availableProducts = [
  {name: 'Insulina', stock: 45, price: 25.50, category: 'Medicamento'},
  {name: 'Jeringas', stock: 8, price: 0.50, category: 'Equipo Médico'},
  // ... productos para probar el formulario de pedidos
];
```

**Ventajas:**
- ✅ Probar formularios y validaciones
- ✅ Probar diferentes estados (loading, error, success)
- ✅ Probar interacciones del usuario

### 4. **Desarrollo Paralelo** 👥
Permite que frontend y backend se desarrollen al mismo tiempo sin bloqueos.

**Flujo:**
```
Frontend Developer (con mocks)        Backend Developer
      ↓                                        ↓
Desarrolla UI                        Desarrolla API
Prueba componentes                   Implementa endpoints
Diseña interacciones                 Configura base de datos
      ↓                                        ↓
              Cuando backend está listo:
      ↓                                        ↓
        Reemplazar mocks con llamadas reales
```

### 5. **Estados de Ejemplo** 📊
Permite mostrar diferentes estados de la aplicación (vacío, con datos, errores).

**Ejemplo:**
```typescript
// vendor-dashboard.component.ts
inventory = [
  {name: 'Insulina', stock: 45, ...},        // Stock normal
  {name: 'Jeringas', stock: 8, ...},         // Stock bajo
  {name: 'Mascarillas', stock: 5, ...}       // Stock muy bajo
];
```

**Ventajas:**
- ✅ Probar alertas de stock bajo
- ✅ Probar estados de pedidos (Creado, En Tránsito, Completado)
- ✅ Probar diferentes escenarios de negocio

## 📍 Dónde se Usan los Mocks en este Proyecto

### ✅ Componentes que Usan Mocks Actualmente:

#### **1. VendorDashboardComponent**
```typescript
orders = [...]      // Array de pedidos mock
inventory = [...]   // Array de inventario mock
routes = [...]      // Array de rutas mock
reportData = {...}  // Datos de reportes mock
```

**Razón:** Permite mostrar el dashboard completo con todas sus funcionalidades sin necesidad del backend.

#### **2. ClientDashboardComponent**
```typescript
orders = [...]      // Array de pedidos del cliente mock
```

**Razón:** Muestra cómo los clientes verán sus pedidos y pueden hacer seguimiento.

#### **3. OrderCreateComponent**
```typescript
availableProducts = [...]  // Lista de productos disponibles mock
```

**Razón:** Permite probar el formulario de creación de pedidos con productos disponibles.

#### **4. RoutesComponent**
```typescript
orders = [...]        // Pedidos sin ruta asignada mock
routes = [...]        // Rutas activas mock
suggestedRoutes = [...]  // Rutas sugeridas mock
```

**Razón:** Muestra la funcionalidad de generación y gestión de rutas.

#### **5. OrdersComponent**
```typescript
orders = [...]  // Lista simple de pedidos mock
```

**Razón:** Componente simple para mostrar pedidos.

## 🔄 Transición: De Mocks a Backend Real

### Estado Actual del Proyecto:

| Componente | Estado | Mock/Backend |
|-----------|--------|--------------|
| `VendorLoginComponent` | ✅ Actualizado | Backend real |
| `ClientLoginComponent` | ✅ Actualizado | Backend real |
| `VendorMfaComponent` | ✅ Actualizado | Backend real |
| `ClientMfaComponent` | ✅ Actualizado | Backend real |
| `ChangePasswordComponent` | ✅ Actualizado | Backend real |
| `VendorDashboardComponent` | ⚠️ Pendiente | **Mock** |
| `ClientDashboardComponent` | ⚠️ Pendiente | **Mock** |
| `OrderCreateComponent` | ⚠️ Pendiente | **Mock** |
| `InventoryComponent` | ⚠️ Pendiente | **Mock** |
| `RoutesComponent` | ⚠️ Pendiente | **Mock** |

### Cómo Reemplazar Mocks por Backend Real:

**Antes (Mock):**
```typescript
export class VendorDashboardComponent {
  orders = [
    {id: 'ORD-1001', product: 'Insulina', status: 'Creado'},
    // ... más datos mock
  ];
  
  ngOnInit() {
    // Los datos ya están aquí, no se cargan
  }
}
```

**Después (Backend Real):**
```typescript
export class VendorDashboardComponent implements OnInit {
  orders: Order[] = [];
  isLoading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }
}
```

## 💡 ¿Cuándo Usar Mocks?

### ✅ **Usa Mocks cuando:**
- El backend aún no está desarrollado
- Estás haciendo prototipos rápidos
- Quieres demostrar la UI sin dependencias
- Necesitas datos para pruebas unitarias
- Desarrollas componentes aislados

### ❌ **NO uses Mocks cuando:**
- El backend ya está disponible
- Necesitas datos reales y actualizados
- Estás en producción
- La funcionalidad requiere persistencia

## 🎯 Próximos Pasos para este Proyecto

### 1. **Mantener Mocks para:**
- ✅ Desarrollo inicial de nuevos componentes
- ✅ Pruebas unitarias
- ✅ Demostraciones de UI

### 2. **Reemplazar Mocks con Backend Real para:**
- ⚠️ `VendorDashboardComponent` → Usar `OrderService`, `ProductService`, `LogisticsService`
- ⚠️ `ClientDashboardComponent` → Usar `OrderService`
- ⚠️ `OrderCreateComponent` → Usar `ProductService` y `OrderService`
- ⚠️ Componentes de inventario → Usar `ProductService`
- ⚠️ Componentes de rutas → Usar `LogisticsService`

## 📝 Ejemplo Práctico: Transición de Mock a Real

### Escenario: Cargar Pedidos

**Con Mock (Actual):**
```typescript
orders = [
  {id: 'ORD-1001', product: 'Insulina', status: 'Creado'},
  {id: 'ORD-1000', product: 'Equipo', status: 'Programado'}
];
// Los datos siempre están disponibles, no hay carga
```

**Con Backend Real (Recomendado):**
```typescript
orders: Order[] = [];
isLoading = true;

ngOnInit() {
  this.loadOrders();
}

loadOrders() {
  this.isLoading = true;
  this.orderService.getOrders().subscribe({
    next: (response) => {
      this.orders = response.orders;
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = 'Error al cargar pedidos';
      this.isLoading = false;
    }
  });
}
```

**Beneficios:**
- ✅ Datos siempre actualizados
- ✅ Sincronización con otros usuarios
- ✅ Persistencia real
- ✅ Validaciones del backend

## 🔍 Resumen

Los datos mock en este proyecto se usan principalmente para:

1. **Desarrollo Independiente** - Permitir trabajar sin backend
2. **Prototipado** - Mostrar cómo funcionará la aplicación
3. **Testing** - Probar componentes aislados
4. **Demostración** - Mostrar funcionalidades con datos realistas

**Estado Actual:**
- ✅ Autenticación: **Ya usa backend real**
- ⚠️ Dashboards y gestión: **Aún usan mocks** (pendiente migrar)

Los mocks fueron útiles para desarrollar rápidamente la UI, pero ahora que el backend está disponible, se deben reemplazar gradualmente por llamadas reales a los servicios.





