#!/bin/bash

# Script de despliegue manual para GCP Cloud Run
# Uso: ./scripts/deploy-gcp.sh [environment]
# environment: dev, staging, prod (default: dev)

set -e

ENVIRONMENT=${1:-dev}
PROJECT_ID=""
REGION="us-central1"
SERVICE_NAME="medisupply-web"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Iniciando despliegue en GCP${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"

# Verificar que gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi

# Obtener PROJECT_ID actual si no está configurado
if [ -z "$PROJECT_ID" ]; then
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}❌ No se encontró PROJECT_ID. Configúralo con: gcloud config set project YOUR_PROJECT_ID${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Project ID: ${PROJECT_ID}${NC}"

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado. Por favor instálalo primero.${NC}"
    exit 1
fi

# Construir la imagen localmente
echo -e "${YELLOW}📦 Construyendo imagen Docker...${NC}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
docker build -t "${IMAGE_NAME}" -t "gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${ENVIRONMENT}-latest" .

# Autenticar Docker con GCP
echo -e "${YELLOW}🔐 Autenticando Docker con GCP...${NC}"
gcloud auth configure-docker --quiet

# Subir la imagen a Container Registry
echo -e "${YELLOW}⬆️  Subiendo imagen a Container Registry...${NC}"
docker push "${IMAGE_NAME}"
docker push "gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${ENVIRONMENT}-latest"

# Desplegar en Cloud Run
echo -e "${YELLOW}🚀 Desplegando en Cloud Run...${NC}"
gcloud run deploy "${SERVICE_NAME}-${ENVIRONMENT}" \
    --image "${IMAGE_NAME}" \
    --region "${REGION}" \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars "NODE_ENV=production" \
    --quiet

# Obtener la URL del servicio
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}-${ENVIRONMENT}" \
    --region "${REGION}" \
    --format 'value(status.url)')

echo -e "${GREEN}✅ Despliegue completado exitosamente!${NC}"
echo -e "${GREEN}🌐 URL del servicio: ${SERVICE_URL}${NC}"

