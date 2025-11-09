/**
 * Script para restaurar el archivo environment.prod.ts a su estado original
 * Este script se ejecuta después del build para restaurar los placeholders
 * 
 * Uso:
 * node scripts/restore-env.js
 */

const fs = require('fs');
const path = require('path');

const envFilePath = path.join(__dirname, '../src/config/environments/environment.prod.ts');
const backupFilePath = path.join(__dirname, '../src/config/environments/environment.prod.ts.backup');

// Restaurar el archivo original
if (fs.existsSync(backupFilePath)) {
  fs.copyFileSync(backupFilePath, envFilePath);
  fs.unlinkSync(backupFilePath);
  console.log('✓ Archivo environment.prod.ts restaurado a su estado original');
} else {
  console.warn('⚠ No se encontró el archivo de backup. El archivo puede no haberse modificado.');
}

