/**
 * Script para reemplazar placeholders en environment.prod.ts con variables de entorno
 * Este script se ejecuta antes del build de producción
 * 
 * IMPORTANTE: Este script guarda el contenido original y lo restaura después del build
 * para evitar que el archivo fuente quede modificado en el repositorio
 * 
 * Uso:
 * node scripts/replace-env-vars.js
 * 
 * Variables de entorno requeridas:
 * - PROD_AUTH_URL
 * - PROD_PRODUCT_URL
 * - PROD_ORDER_URL
 * - PROD_LOGISTICS_URL
 * - PROD_NOTIFICATIONS_URL
 */

const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/config/environments/environment.prod.ts');
const backupFilePath = path.join(__dirname, '../src/config/environments/environment.prod.ts.backup');

// Función para restaurar el archivo original (solo en caso de error)
function restoreOriginal() {
  if (fs.existsSync(backupFilePath)) {
    fs.copyFileSync(backupFilePath, envFilePath);
    fs.unlinkSync(backupFilePath);
    console.log('✓ Archivo environment.prod.ts restaurado a su estado original');
  }
}

// Manejar señales de terminación para restaurar el archivo solo en caso de error
process.on('SIGINT', () => {
  restoreOriginal();
  process.exit(0);
});

process.on('SIGTERM', () => {
  restoreOriginal();
  process.exit(0);
});

// Solo restaurar en exit si hay un error (el script restore-env.js se encargará de la restauración normal)
process.on('uncaughtException', () => {
  restoreOriginal();
  process.exit(1);
});

// Guardar el contenido original antes de modificar
if (fs.existsSync(envFilePath)) {
  fs.copyFileSync(envFilePath, backupFilePath);
  console.log('✓ Archivo original guardado como backup');
}

// Leer el archivo
let content = fs.readFileSync(envFilePath, 'utf8');

// Mapeo de placeholders a variables de entorno
const envVarMap = {
  'PROD_AUTH_URL': process.env.PROD_AUTH_URL || '',
  'PROD_PRODUCT_URL': process.env.PROD_PRODUCT_URL || '',
  'PROD_ORDER_URL': process.env.PROD_ORDER_URL || '',
  'PROD_LOGISTICS_URL': process.env.PROD_LOGISTICS_URL || '',
  'PROD_NOTIFICATIONS_URL': process.env.PROD_NOTIFICATIONS_URL || ''
};

// Reemplazar placeholders (en constantes y en las URLs completas)
Object.keys(envVarMap).forEach(placeholder => {
  const value = envVarMap[placeholder];
  if (value) {
    // Escapar comillas simples en el valor si es necesario
    const escapedValue = value.replace(/'/g, "\\'");
    
    // Reemplazar el placeholder en las URLs base (ej: authUrl: 'PROD_AUTH_URL')
    const baseRegex = new RegExp(`'${placeholder}'`, 'g');
    content = content.replace(baseRegex, `'${escapedValue}'`);
    
    // Reemplazar el placeholder en las URLs completas (ej: authApiUrl: 'PROD_AUTH_URL/api/v1/auth')
    const fullUrlRegex = new RegExp(`${placeholder}(/[^']*)`, 'g');
    content = content.replace(fullUrlRegex, `${escapedValue}$1`);
    
    console.log(`✓ Reemplazado ${placeholder} con: ${value}`);
  } else {
    console.warn(`⚠ Advertencia: ${placeholder} no está definido en las variables de entorno`);
    console.warn(`  El build continuará pero puede fallar si se intenta usar esta URL`);
  }
});

// Escribir el archivo actualizado (temporalmente, se restaurará después del build)
fs.writeFileSync(envFilePath, content, 'utf8');
console.log('✓ Archivo environment.prod.ts actualizado temporalmente para el build');
console.log('⚠ NOTA: El archivo se restaurará automáticamente después del build');

