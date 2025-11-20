
# MediSupply
Plataforma de gestion de productos web.

## Requisitos Previos

- Node.js (versión 18.x o superior)
- npm (versión 9.x o superior)
- Angular CLI

## Instalación y Configuración

### Paso 1: Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd web-medisupply
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Ejecutar el proyecto
```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:4200`

## Estructura del Proyecto

### Componentes de Autenticación
- **LoginComponent**: Formulario de inicio de sesión con validaciones
- **SignupComponent**: Formulario de registro de nuevos usuarios
- **MfaComponent**: Verificación de autenticación de dos factores
- **ChangePasswordComponent**: Cambio de contraseña

### Usuarios de Prueba
- **vendedor**: Acceso como vendedor
- **cliente**: Acceso como cliente institucional

## Pruebas Unitarias

### Ejecutar Pruebas
```bash
npm test
```

### Pruebas End-to-End (Playwright)

```bash
# Instalar navegadores de Playwright (una sola vez)
npx playwright install

# Ejecutar todas las suites en modo headless
npm run test:e2e

# Ejecutar en modo headed
npm run test:e2e:headed

# Explorar con el Trace Viewer
npm run test:e2e:ui
```

### Ejecutar Pruebas en Modo Watch
```bash
npm run test:watch
```

### Cobertura de Pruebas
Las pruebas unitarias cubren:

#### LoginComponent
- ✅ Validación de campos requeridos
- ✅ Validación de longitud mínima
- ✅ Asignación de roles (vendor/client)
- ✅ Navegación correcta
- ✅ Manejo de usuarios case-insensitive

#### SignupComponent
- ✅ Validación de formulario completo
- ✅ Validación de formato de email
- ✅ Validación de formato de teléfono
- ✅ Validación de contraseñas coincidentes
- ✅ Asignación de roles basada en username

#### MfaComponent
- ✅ Validación de código de 6 dígitos
- ✅ Validación de formato numérico
- ✅ Navegación basada en rol almacenado
- ✅ Manejo de códigos inválidos

#### ChangePasswordComponent
- ✅ Validación de longitud mínima de contraseña
- ✅ Validación de contraseñas coincidentes
- ✅ Navegación después de cambio exitoso

### Estadísticas de Pruebas
- **Total de pruebas**: 40+
- **Cobertura**: 100% de los métodos públicos
- **Componentes cubiertos**: 4/4 (100%)

## Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm test             # Ejecutar pruebas unitarias
npm run test:watch   # Ejecutar pruebas en modo watch
npm start            # Ejecutar servidor de producción
```

## Tecnologías Utilizadas

- **Angular 16**: Framework principal
- **Angular Material**: Componentes UI
- **Reactive Forms**: Manejo de formularios
- **Jasmine**: Framework de testing
- **Karma**: Test runner
- **TypeScript**: Lenguaje de programación

## Características

- ✅ Formularios reactivos con validaciones
- ✅ Autenticación mock con roles
- ✅ MFA (Multi-Factor Authentication) simulado
- ✅ Navegación basada en roles
- ✅ Interfaz responsive con Material Design
- ✅ Pruebas unitarias completas
- ✅ Validaciones de seguridad en frontend

## Notas de Desarrollo

Este es un prototipo de sistema de autenticación que simula:
- Login con validación de credenciales
- Registro de nuevos usuarios
- Verificación MFA
- Cambio de contraseñas
- Asignación automática de roles

Para un entorno de producción, se requeriría integración con un backend real y servicios de autenticación seguros.
