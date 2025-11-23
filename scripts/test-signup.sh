#!/bin/bash

# Script para probar el endpoint de registro (signup) del backend
# Uso: ./scripts/test-signup.sh [vendor|client]

set -e

AUTH_SERVICE_URL="https://medisupply-backend-api-swn62v7z2q-uc.a.run.app"
ROLE="${1:-vendor}"

echo "🧪 Probando registro de cuenta ($ROLE)..."
echo "=========================================="
echo ""

# Generar email único basado en timestamp
TIMESTAMP=$(date +%s)
EMAIL="test.${ROLE}.${TIMESTAMP}@example.com"

if [ "$ROLE" = "vendor" ]; then
  echo "📝 Registrando vendedor..."
  echo "Email: $EMAIL"
  echo ""
  
  USERNAME="testvendor${TIMESTAMP}"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_SERVICE_URL}/api/v1/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"${EMAIL}\",
      \"username\": \"${USERNAME}\",
      \"password\": \"TestPass123!\",
      \"confirm_password\": \"TestPass123!\",
      \"role\": \"vendor\",
      \"name\": \"Test Vendor\",
      \"phone\": \"+57 300 123 4567\",
      \"address\": \"Test Company\"
    }")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
elif [ "$ROLE" = "client" ]; then
  echo "📝 Registrando cliente..."
  echo "Email: $EMAIL"
  echo ""
  
  USERNAME="testclient${TIMESTAMP}"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_SERVICE_URL}/api/v1/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"${EMAIL}\",
      \"username\": \"${USERNAME}\",
      \"password\": \"TestPass123!\",
      \"confirm_password\": \"TestPass123!\",
      \"role\": \"client\",
      \"name\": \"Test Client\",
      \"phone\": \"+57 301 987 6543\",
      \"institutionName\": \"Test Hospital\"
    }")
  
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
else
  echo "❌ Error: Rol inválido. Usa 'vendor' o 'client'"
  echo "Uso: ./scripts/test-signup.sh [vendor|client]"
  exit 1
fi

echo "📊 Respuesta del servidor:"
echo "HTTP Status Code: $HTTP_CODE"
echo ""
echo "Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
  echo "✅ Registro exitoso!"
  echo ""
  echo "📧 Credenciales de prueba:"
  echo "   Email: $EMAIL"
  echo "   Username: $USERNAME"
  echo "   Password: TestPass123!"
  echo ""
  echo "🔑 Puedes usar estas credenciales para iniciar sesión en:"
  if [ "$ROLE" = "vendor" ]; then
    echo "   http://localhost:4200/vendor/login"
  else
    echo "   http://localhost:4200/client/login"
  fi
elif [ "$HTTP_CODE" -eq 409 ]; then
  echo "⚠️  El email ya está registrado (esto es normal si ejecutas el script múltiples veces)"
elif [ "$HTTP_CODE" -eq 400 ]; then
  echo "❌ Error: Datos inválidos"
  echo "Revisa el formato de los datos enviados"
elif [ "$HTTP_CODE" -eq 500 ]; then
  echo "❌ Error: Error interno del servidor"
  echo "El backend puede estar teniendo problemas"
else
  echo "❌ Error inesperado (HTTP $HTTP_CODE)"
fi

echo ""
echo "=========================================="

