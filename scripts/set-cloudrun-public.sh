#!/bin/bash

# Script para hacer público un servicio de Cloud Run (permitir acceso sin autenticación)
# Uso:
#   ./scripts/set-cloudrun-public.sh <SERVICE_NAME> [REGION]
# Ejemplo:
#   ./scripts/set-cloudrun-public.sh medisupply-web us-central1

set -e

SERVICE_NAME="$1"
REGION="${2:-us-central1}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ -z "$SERVICE_NAME" ]; then
  echo -e "${RED}❌ Debes pasar el nombre del servicio de Cloud Run${NC}"
  echo "Uso: $0 <SERVICE_NAME> [REGION]"
  exit 1
fi

echo -e "${YELLOW}🔍 Obteniendo PROJECT_ID...${NC}"
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}❌ No se encontró PROJECT_ID. Ejecuta: gcloud config set project TU_PROYECTO ${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Project ID: ${PROJECT_ID}${NC}"

echo -e "${YELLOW}🔐 Asignando rol 'Cloud Run Invoker' a allUsers para el servicio ${SERVICE_NAME} en ${REGION}...${NC}"

gcloud run services add-iam-policy-binding "$SERVICE_NAME" \
  --region "$REGION" \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --platform managed

echo -e "${GREEN}✅ Listo. El servicio ahora es público.${NC}"

echo -e "${YELLOW}🌐 URL del servicio:${NC}"
gcloud run services describe "$SERVICE_NAME" \
  --region "$REGION" \
  --format 'value(status.url)'
