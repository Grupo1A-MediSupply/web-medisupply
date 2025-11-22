# 🚀 Guía de Configuración del Backend

Esta guía te ayudará a configurar y ejecutar el backend de MediSupply.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** 18.x o superior
2. **MongoDB** (local o MongoDB Atlas)
3. **npm** 9.x o superior

### Instalar MongoDB Local

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Windows:**
Descarga e instala desde [MongoDB Download Center](https://www.mongodb.com/try/download/community)

## 🔧 Configuración Paso a Paso

### 1. Instalar Dependencias del Backend

```bash
cd backend
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```bash
cd backend
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Puerto del servidor
PORT=3000

# Base de datos MongoDB
# Opción 1: MongoDB local
MONGODB_URI=mongodb://localhost:27017/medisupply

# Opción 2: MongoDB Atlas (nube)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medisupply?retryWrites=true&w=majority

# JWT Secret (CAMBIAR EN PRODUCCIÓN)
JWT_SECRET=tu_secret_key_super_segura_aqui_cambiar_en_produccion

# Duración del token JWT
JWT_EXPIRES_IN=7d

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:4200

# Entorno
NODE_ENV=development

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE:** Cambia `JWT_SECRET` por una clave secreta fuerte en producción.

### 3. Iniciar MongoDB

**Si usas MongoDB local:**

```bash
# macOS/Linux
mongod

# O con Homebrew (macOS)
brew services start mongodb-community

# Verificar que está corriendo
mongo --eval "db.version()"
```

**Si usas MongoDB Atlas:**
- Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crea un cluster gratuito
- Obtén la connection string
- Actualiza `MONGODB_URI` en `.env`

### 4. Ejecutar el Backend

**Modo Desarrollo (con hot-reload):**
```bash
cd backend
npm run dev
```

**Modo Producción:**
```bash
cd backend
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

## ✅ Verificar que Funciona

1. **Health Check:**
```bash
curl http://localhost:3000/health
```

Deberías recibir:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

2. **Registrar un usuario:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vendor@test.com",
    "password": "password123",
    "role": "vendor",
    "name": "Test Vendor"
  }'
```

## 🔗 Integración con Frontend

El frontend Angular ya está configurado para conectarse al backend:

1. **URL del API:** Configurada en `src/environments/environment.ts`
   ```typescript
   apiUrl: 'http://localhost:3000/api'
   ```

2. **Servicios HTTP:** Ya creados en `src/app/core/services/`

3. **Para usar los servicios en tus componentes:**
   ```typescript
   import { AuthService } from '../core/services/auth.service';
   
   constructor(private authService: AuthService) {}
   
   login() {
     this.authService.login({ email: '...', password: '...' })
       .subscribe(response => {
         // Manejar respuesta
       });
   }
   ```

## 📚 Endpoints Disponibles

### Autenticación
- `POST /api/auth/signup` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/mfa/verify` - Verificar código MFA
- `POST /api/auth/change-password` - Cambiar contraseña
- `GET /api/auth/profile` - Obtener perfil

### Productos (Vendor)
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `POST /api/products/bulk-upload` - Carga masiva

### Pedidos
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/:id` - Obtener pedido
- `POST /api/orders` - Crear pedido (client)
- `PUT /api/orders/:id` - Actualizar pedido (vendor)
- `DELETE /api/orders/:id` - Eliminar pedido
- `POST /api/orders/:id/return` - Solicitar devolución (client)

### Rutas (Vendor)
- `GET /api/routes` - Listar rutas
- `GET /api/routes/:id` - Obtener ruta
- `POST /api/routes` - Crear ruta
- `POST /api/routes/generate-optimal` - Generar rutas optimizadas
- `PUT /api/routes/:id` - Actualizar ruta
- `DELETE /api/routes/:id` - Eliminar ruta

### Reportes
- `GET /api/reports` - Obtener reportes

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT:

```typescript
headers: {
  'Authorization': 'Bearer <token>'
}
```

El token se guarda automáticamente después del login/MFA.

## 🐛 Troubleshooting

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté corriendo: `mongo --eval "db.version()"`
- Verifica la URI en `.env`
- Si usas Atlas, verifica las credenciales y whitelist de IPs

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001

# O terminar el proceso
lsof -ti:3000 | xargs kill -9
```

### Error: "Module not found"
```bash
cd backend
npm install
```

### Error: "CORS"
Verifica que `FRONTEND_URL` en `.env` coincida con la URL del frontend Angular.

## 📝 Próximos Pasos

1. **Actualizar componentes de Angular** para usar los servicios HTTP
2. **Configurar interceptor** para manejar errores automáticamente
3. **Agregar guards** para proteger rutas en Angular
4. **Implementar refresh token** para mejorar seguridad
5. **Configurar variables de entorno** para producción

## 🔒 Seguridad en Producción

1. Cambiar `JWT_SECRET` por una clave fuerte y única
2. Configurar HTTPS
3. Usar variables de entorno para secrets
4. Configurar rate limiting apropiado
5. Validar y sanitizar todas las entradas
6. Usar MongoDB Atlas con autenticación
7. Implementar logs y monitoreo

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica la conexión a MongoDB
3. Consulta el README.md en `backend/`
4. Revisa los errores en la consola del navegador

---

¡Listo! 🎉 Tu backend está configurado y listo para usar.

