#!/bin/bash

# Script para verificar la conectividad con los servicios backend en GCP
# Este script prueba que todos los microservicios estén accesibles

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Verificando conectividad con servicios backend en GCP..."
echo ""

# URL del backend monolítico
BACKEND_URL="https://medisupply-backend-api-swn62v7z2q-uc.a.run.app"
AUTH_SERVICE="$BACKEND_URL"
PRODUCT_SERVICE="$BACKEND_URL"
ORDER_SERVICE="$BACKEND_URL"
LOGISTICS_SERVICE="$BACKEND_URL"
NOTIFICATIONS_SERVICE="$BACKEND_URL"

# Función para verificar un servicio
check_service() {
    local service_name=$1
    local service_url=$2
    local endpoint=$3
    
    echo -n "Verificando ${service_name}... "
    
    # Hacer petición HTTP y capturar código de estado
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${service_url}${endpoint}" 2>&1)
    
    if [ "$response" = "200" ] || [ "$response" = "401" ] || [ "$response" = "403" ] || [ "$response" = "404" ]; then
        echo -e "${GREEN}✓${NC} Accesible (HTTP $response)"
        return 0
    elif [ "$response" = "000" ]; then
        echo -e "${RED}✗${NC} No accesible (timeout o conexión fallida)"
        return 1
    else
        echo -e "${YELLOW}⚠${NC} Respuesta inesperada (HTTP $response)"
        return 1
    fi
}

# Contador de servicios exitosos
success_count=0
total_services=5

# Verificar cada servicio
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Auth Service
if check_service "Auth Service" "$AUTH_SERVICE" "/health" || check_service "Auth Service" "$AUTH_SERVICE" "/"; then
    ((success_count++))
fi
echo "   URL: $AUTH_SERVICE"
echo ""

# 2. Product Service
if check_service "Product Service" "$PRODUCT_SERVICE" "/health" || check_service "Product Service" "$PRODUCT_SERVICE" "/"; then
    ((success_count++))
fi
echo "   URL: $PRODUCT_SERVICE"
echo ""

# 3. Order Service
if check_service "Order Service" "$ORDER_SERVICE" "/health" || check_service "Order Service" "$ORDER_SERVICE" "/"; then
    ((success_count++))
fi
echo "   URL: $ORDER_SERVICE"
echo ""

# 4. Logistics Service
if check_service "Logistics Service" "$LOGISTICS_SERVICE" "/health" || check_service "Logistics Service" "$LOGISTICS_SERVICE" "/"; then
    ((success_count++))
fi
echo "   URL: $LOGISTICS_SERVICE"
echo ""

# 5. Notifications Service
if check_service "Notifications Service" "$NOTIFICATIONS_SERVICE" "/health" || check_service "Notifications Service" "$NOTIFICATIONS_SERVICE" "/"; then
    ((success_count++))
fi
echo "   URL: $NOTIFICATIONS_SERVICE"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Resumen
if [ $success_count -eq $total_services ]; then
    echo -e "${GREEN}✅ Todos los servicios están accesibles ($success_count/$total_services)${NC}"
    exit 0
elif [ $success_count -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Algunos servicios no están accesibles ($success_count/$total_services)${NC}"
    echo ""
    echo "Nota: Si un servicio responde con 401/403, significa que está funcionando"
    echo "      pero requiere autenticación, lo cual es normal."
    exit 1
else
    echo -e "${RED}❌ Ningún servicio está accesible (0/$total_services)${NC}"
    echo ""
    echo "Posibles causas:"
    echo "  - Los servicios no están desplegados en GCP"
    echo "  - Problemas de red o firewall"
    echo "  - Las URLs están incorrectas"
    exit 1
fi

