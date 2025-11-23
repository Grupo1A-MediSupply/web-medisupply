#!/bin/bash

# Script para configurar GCP para el proyecto MediSupply
# Este script configura los permisos y APIs necesarias para Cloud Build y Cloud Run

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Configurando GCP para MediSupply${NC}"

# Obtener PROJECT_ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No se encontró PROJECT_ID. Configúralo con:${NC}"
    echo -e "${YELLOW}   gcloud config set project YOUR_PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project ID: ${PROJECT_ID}${NC}"

# Obtener PROJECT_NUMBER
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

if [ -z "$PROJECT_NUMBER" ]; then
    echo -e "${RED}❌ No se pudo obtener el Project Number${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project Number: ${PROJECT_NUMBER}${NC}"

# Habilitar APIs necesarias
echo -e "${YELLOW}📡 Habilitando APIs necesarias...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    artifactregistry.googleapis.com \
    --quiet

echo -e "${GREEN}✓ APIs habilitadas${NC}"

# Configurar permisos para Cloud Build
echo -e "${YELLOW}🔐 Configurando permisos para Cloud Build...${NC}"

# Rol para desplegar en Cloud Run
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/run.admin" \
    --quiet

# Rol para usar Service Accounts
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser" \
    --quiet

# Rol para acceder a Container Registry
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/storage.admin" \
    --quiet

echo -e "${GREEN}✓ Permisos configurados${NC}"

# Verificar configuración
echo -e "${YELLOW}🔍 Verificando configuración...${NC}"

# Verificar que Cloud Build tiene los permisos
ROLES=$(gcloud projects get-iam-policy $PROJECT_ID \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --format="value(bindings.role)")

if echo "$ROLES" | grep -q "roles/run.admin"; then
    echo -e "${GREEN}✓ Cloud Build tiene permisos de Cloud Run Admin${NC}"
else
    echo -e "${RED}⚠️  Advertencia: Cloud Build podría no tener todos los permisos necesarios${NC}"
fi

echo -e "${GREEN}✅ Configuración completada exitosamente!${NC}"
echo ""
echo -e "${BLUE}📝 Próximos pasos:${NC}"
echo -e "   1. Crea un trigger en Cloud Build conectando tu repositorio"
echo -e "   2. O ejecuta un build manual: ${YELLOW}gcloud builds submit --config cloudbuild.yaml${NC}"
echo -e "   3. O usa el script de despliegue: ${YELLOW}./scripts/deploy-gcp.sh${NC}"

