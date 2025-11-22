# Guía para Probar la Creación de Cuenta

Esta guía te ayudará a probar el flujo de registro (signup) en la aplicación.

## 📋 Requisitos Previos

1. **Servidor de desarrollo corriendo**: 
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200`

2. **Backend disponible**: 
   - El servicio de autenticación debe estar desplegado en GCP
   - URL: `https://auth-service-swn62v7z2q-uc.a.run.app`
   - Verificar conectividad con: `npm run verify-backend` (si existe el script)

## 🧪 Opción 1: Prueba Manual en el Navegador

### Para Vendedores (Vendor)

1. **Acceder a la página de registro**:
   - URL: `http://localhost:4200/vendor/signup`
   - O navegar desde: `http://localhost:4200/vendor/login` → Click en "Registrarse"

2. **Completar el formulario** con datos válidos:
   ```
   Nombre Completo: Juan Pérez
   Correo Electrónico: juan.perez@example.com
   Teléfono: +57 300 123 4567
   Empresa: Farmacia Central
   Nombre de Usuario: juanperez
   Contraseña: Password123!
   Confirmar Contraseña: Password123!
   ```

3. **Validaciones a verificar**:
   - ✅ Nombre: Solo letras y espacios (mínimo 2 caracteres)
   - ✅ Email: Formato válido de correo
   - ✅ Teléfono: Solo números, +, -, espacios, paréntesis (7-20 caracteres)
   - ✅ Empresa: Mínimo 2 caracteres
   - ✅ Usuario: Solo letras, números y guión bajo (3-50 caracteres)
   - ✅ Contraseña: 
     - Mínimo 8 caracteres
     - Debe contener: mayúsculas, minúsculas, números y caracteres especiales
     - Ejemplo válido: `Password123!`

4. **Resultado esperado**:
   - Si es exitoso: Mensaje verde "Cuenta de vendedor creada exitosamente"
   - Redirección automática a `/vendor/login` después de 1.5 segundos
   - Si hay error: Mensaje rojo con el error específico

### Para Clientes (Client)

1. **Acceder a la página de registro**:
   - URL: `http://localhost:4200/client/signup`
   - O navegar desde: `http://localhost:4200/client/login` → Click en "Registrarse"

2. **Completar el formulario** con datos válidos:
   ```
   Nombre Completo: María González
   Correo Electrónico: maria.gonzalez@hospital.com
   Teléfono: +57 301 987 6543
   Institución: Hospital San José
   Cargo: Directora de Compras
   Nombre de Usuario: mariagonzalez
   Contraseña: SecurePass456!
   Confirmar Contraseña: SecurePass456!
   ```

3. **Validaciones a verificar**:
   - ✅ Nombre: Solo letras y espacios (mínimo 2 caracteres)
   - ✅ Email: Formato válido de correo
   - ✅ Teléfono: Solo números, +, -, espacios, paréntesis (7-20 caracteres)
   - ✅ Institución: Mínimo 2 caracteres
   - ✅ Cargo: Mínimo 2 caracteres
   - ✅ Usuario: Solo letras, números y guión bajo (3-50 caracteres)
   - ✅ Contraseña: Mismo formato que para vendedores

4. **Resultado esperado**:
   - Si es exitoso: Mensaje verde "Cuenta de cliente creada exitosamente"
   - Redirección automática a `/client/login` después de 1.5 segundos
   - Si hay error: Mensaje rojo con el error específico

## 🔧 Opción 2: Prueba con cURL (Backend Directo)

Puedes probar directamente el endpoint del backend usando `curl`:

### Prueba de Registro de Vendedor

```bash
curl -X POST https://auth-service-swn62v7z2q-uc.a.run.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.vendor@example.com",
    "password": "TestPass123!",
    "role": "vendor",
    "name": "Test Vendor",
    "phone": "+57 300 123 4567",
    "address": "Test Company"
  }'
```

### Prueba de Registro de Cliente

```bash
curl -X POST https://auth-service-swn62v7z2q-uc.a.run.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.client@example.com",
    "password": "TestPass123!",
    "role": "client",
    "name": "Test Client",
    "phone": "+57 301 987 6543",
    "institutionName": "Test Hospital"
  }'
```

### Respuesta Esperada (Éxito)

```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890abcdef",
    "email": "test.vendor@example.com",
    "role": "vendor",
    "name": "Test Vendor"
  }
}
```

### Respuesta Esperada (Error - Email duplicado)

```json
{
  "message": "El correo electrónico ya está registrado",
  "error": "DUPLICATE_EMAIL"
}
```

## 🐛 Casos de Prueba a Verificar

### ✅ Casos Exitosos

1. **Registro exitoso de vendedor** con todos los campos válidos
2. **Registro exitoso de cliente** con todos los campos válidos
3. **Redirección automática** después del registro exitoso

### ❌ Casos de Error

1. **Email duplicado**: Intentar registrar con un email ya existente
   - Debe mostrar: "El correo electrónico o usuario ya está registrado"

2. **Campos inválidos**: 
   - Nombre con números → Error de validación
   - Email sin @ → Error de validación
   - Teléfono con letras → Error de validación
   - Contraseña débil (sin mayúsculas/números/caracteres especiales) → Error de validación
   - Contraseñas que no coinciden → Error de validación

3. **Campos vacíos**: Dejar campos requeridos vacíos
   - Debe mostrar: "Por favor, complete todos los campos correctamente"

4. **Error de servidor**: Si el backend no está disponible
   - Debe mostrar: "Error del servidor. Por favor, intente más tarde"

## 🔍 Verificación en la Consola del Navegador

Abre las **DevTools** (F12) y revisa:

1. **Network Tab**: 
   - Verifica que la petición POST se envía a `/auth-service/auth/register`
   - Revisa el status code (200 = éxito, 409 = duplicado, 400 = inválido, 500 = error servidor)
   - Revisa la respuesta del servidor

2. **Console Tab**:
   - No debe haber errores de JavaScript
   - Si hay errores, revisa los mensajes de error

## 📝 Notas Importantes

- **Proxy en desarrollo**: En desarrollo, las peticiones se redirigen a través del proxy configurado en `proxy.conf.json`
- **CORS**: En producción, el backend debe tener CORS configurado para permitir peticiones desde el frontend
- **Token**: Si el registro es exitoso, el token se guarda en `sessionStorage`
- **Validaciones**: Todas las validaciones se ejecutan tanto en el frontend (Angular) como en el backend

## 🚀 Siguiente Paso Después del Registro

Después de crear la cuenta exitosamente:

1. Serás redirigido a la página de login
2. Inicia sesión con el email y contraseña que acabas de registrar
3. El sistema puede requerir MFA (Multi-Factor Authentication)
4. Una vez autenticado, serás redirigido al dashboard correspondiente

