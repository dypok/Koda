#!/usr/bin/env node

/**
 * Script de validación de seguridad previa a commits / CI para Koda Academy.
 * 1. Inspecciona staged files en búsqueda de credenciales, llaves privadas o tokens hardcodeados.
 * 2. Verifica la presencia de archivos .env accidentales.
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Ejecutando auditoría de seguridad preventiva en el repositorio...');

// 1. Patrones sospechosos de secretos
const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /eyJhbGciOi[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/, // JWT hardcodeado
  /sbp_[a-zA-Z0-9]{30,}/, // Supabase service tokens
  /AKIA[0-9A-Z]{16}/, // AWS Access Key
];

// Obtener lista de archivos modificados o en staging
let changedFiles = [];
try {
  const output = execSync('git status --porcelain', { encoding: 'utf8' });
  changedFiles = output
    .split('\n')
    .map((line) => line.trim().slice(3))
    .filter(Boolean);
} catch (e) {
  console.warn('⚠️ No se pudo obtener el estado de Git:', e.message);
}

let hasViolations = false;

for (const file of changedFiles) {
  if (file.endsWith('.env') && !file.includes('.example')) {
    console.error(`❌ ALERTA DE SEGURIDAD: Se detectó archivo sensible de entorno: ${file}`);
    hasViolations = true;
    continue;
  }

  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    // Excluir binarios y node_modules
    if (file.includes('node_modules') || file.includes('.next') || file.includes('dist')) {
      continue;
    }

    try {
      const content = fs.readFileSync(file, 'utf8');
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(content) && !file.includes('security-audit.js') && !file.includes('mock')) {
          console.error(`❌ POSIBLE SECRETO EXPUESTO en ${file}: Coincidencia con patrón de credenciales.`);
          hasViolations = true;
        }
      }
    } catch {
      // Ignorar archivos binarios no legibles como utf8
    }
  }
}

if (hasViolations) {
  console.error('\n🚫 La auditoría de seguridad falló. Por favor remueve secretos o archivos sensibles antes de continuar.');
  process.exit(1);
} else {
  console.log('✅ Auditoría de secretos y archivos completada sin hallazgos críticos.');
}
