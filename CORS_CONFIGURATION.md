# 🔧 Configuración de CORS

## ❌ Problema

Al intentar hacer peticiones desde el frontend Angular (`http://localhost:4200`) a los servicios backend en GCP, aparece el siguiente error:

```
Access to fetch at 'https://auth-service-swn62v7z2q-uc.a.run.app/auth/login' 
from origin 'http://localhost:4200' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Soluciones

### Solución 1: Proxy de Angular (Desarrollo Rápido) ⚡

**Ya implementada** - El proyecto incluye un proxy configurado que evita problemas de CORS durante el desarrollo.

#### Cómo funciona:

1. **Archivo de configuración:** `proxy.conf.json`
   - Configura rutas proxy para cada servicio
   - El servidor de desarrollo de Angular redirige las peticiones

2. **Configuración en `angular.json`:**
   ```json
   "serve": {
     "options": {
       "proxyConfig": "proxy.conf.json"
     }
   }
   ```

3. **Environment configurado:**
   - `environment.ts` tiene `useProxy: true` para desarrollo
   - Los servicios usan rutas relativas (`/auth-service`, `/product-service`, etc.)

#### Uso:

```bash
# Iniciar servidor de desarrollo (el proxy se activa automáticamente)
npm run dev
```

Las peticiones se harán a:
- `http://localhost:4200/auth-service/auth/login` → Proxied a → `https://auth-service-swn62v7z2q-uc.a.run.app/auth/login`

**Ventajas:**
- ✅ No requiere cambios en el backend
- ✅ Funciona inmediatamente
- ✅ Solo para desarrollo

**Desventajas:**
- ❌ Solo funciona en desarrollo
- ❌ En producción necesitas CORS configurado

---

### Solución 2: Configurar CORS en los Servicios Backend (Recomendado) 🎯

Esta es la solución correcta para producción. Los servicios backend deben configurar CORS para permitir peticiones desde el frontend.

#### Para Node.js/Express:

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Configurar CORS
const corsOptions = {
  origin: [
    'http://localhost:4200',           // Desarrollo local
    'https://medisupply-web-*.run.app', // Producción (Cloud Run)
    'https://*.medisupply.com'         // Dominio de producción
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));

// O para permitir todos los orígenes (solo desarrollo):
// app.use(cors());
```

#### Para Python/Flask:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# Configurar CORS
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:4200",
            "https://medisupply-web-*.run.app",
            "https://*.medisupply.com"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
```

#### Para Python/FastAPI:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "https://medisupply-web-*.run.app",
        "https://*.medisupply.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Para Go/Gin:

```go
package main

import (
    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default()
    
    // Configurar CORS
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{
        "http://localhost:4200",
        "https://medisupply-web-*.run.app",
        "https://*.medisupply.com",
    }
    config.AllowCredentials = true
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Content-Type", "Authorization"}
    
    r.Use(cors.New(config))
    
    // ... rutas
}
```

#### Headers CORS Manuales (si no usas librería):

```javascript
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:4200',
    'https://medisupply-web-*.run.app'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

---

## 🔍 Verificar CORS

### Desde el navegador (DevTools):

1. Abre la aplicación
2. Abre DevTools (F12) → Network
3. Intenta hacer una petición
4. Revisa los headers de respuesta:

**Headers esperados:**
```
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

### Desde curl:

```bash
# Verificar preflight (OPTIONS)
curl -X OPTIONS https://auth-service-swn62v7z2q-uc.a.run.app/auth/login \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v

# Deberías ver:
# < Access-Control-Allow-Origin: http://localhost:4200
# < Access-Control-Allow-Methods: POST, GET, OPTIONS
# < Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## 📝 Configuración por Ambiente

### Desarrollo:
- **Frontend:** `http://localhost:4200`
- **Backend:** URLs de GCP Cloud Run
- **Solución:** Proxy de Angular (ya configurado) O CORS en backend

### Producción:
- **Frontend:** `https://medisupply-web-*.run.app` (Cloud Run)
- **Backend:** URLs de GCP Cloud Run
- **Solución:** CORS configurado en backend (obligatorio)

---

## ⚠️ Notas Importantes

1. **Seguridad:**
   - No uses `Access-Control-Allow-Origin: *` en producción
   - Especifica los orígenes permitidos explícitamente
   - Usa HTTPS en producción

2. **Credenciales:**
   - Si usas cookies o tokens, necesitas `Access-Control-Allow-Credentials: true`
   - No puedes usar `*` en `Allow-Origin` si usas credenciales

3. **Preflight (OPTIONS):**
   - El navegador envía una petición OPTIONS antes de peticiones complejas
   - Asegúrate de manejar OPTIONS correctamente

4. **Cloud Run:**
   - Los servicios en Cloud Run deben tener CORS configurado
   - Verifica que los servicios estén desplegados con la configuración correcta

---

## 🚀 Pasos para Configurar CORS en los Servicios

1. **Identificar el framework del servicio:**
   - Node.js/Express
   - Python/Flask
   - Python/FastAPI
   - Go/Gin
   - Otro

2. **Agregar middleware/librería de CORS:**
   ```bash
   # Node.js
   npm install cors
   
   # Python/Flask
   pip install flask-cors
   
   # Python/FastAPI
   pip install fastapi[all]
   ```

3. **Configurar CORS con los orígenes permitidos:**
   - Desarrollo: `http://localhost:4200`
   - Producción: URL del frontend en Cloud Run

4. **Probar la configuración:**
   - Desde el navegador
   - Desde curl
   - Desde la aplicación Angular

5. **Redesplegar los servicios:**
   ```bash
   gcloud run deploy auth-service --source . --region us-central1
   ```

---

## 📚 Referencias

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Angular: Proxy Configuration](https://angular.io/guide/build#proxying-to-a-backend-server)
- [Express CORS](https://expressjs.com/en/resources/middleware/cors.html)
- [Flask CORS](https://flask-cors.readthedocs.io/)

---

## ✅ Estado Actual

- ✅ Proxy de Angular configurado para desarrollo
- ⚠️ CORS debe configurarse en los servicios backend para producción
- ✅ Environment configurado para usar proxy en desarrollo
- ✅ Servicios Angular actualizados para usar proxy cuando está habilitado

