# 🚀 Guía de Despliegue en Google Cloud Platform (GCP)

Esta guía explica cómo desplegar la aplicación MediSupply en GCP usando Cloud Build y Cloud Run.

## 📋 Prerrequisitos

1. **Cuenta de Google Cloud Platform** con facturación habilitada
2. **Google Cloud SDK (gcloud)** instalado
3. **Docker** instalado (para builds locales)
4. **Permisos necesarios** en el proyecto GCP:
   - Cloud Build Editor
   - Cloud Run Admin
   - Service Account User
   - Storage Admin (para Container Registry)

## 🏗️ Arquitectura

La aplicación se despliega usando:
- **Cloud Build**: Para CI/CD automático
- **Cloud Run**: Para servir la aplicación Angular
- **Container Registry**: Para almacenar las imágenes Docker

## 🔧 Configuración Inicial

### 1. Configurar el proyecto GCP

```bash
# Autenticarse en GCP
gcloud auth login

# Configurar el proyecto
gcloud config set project YOUR_PROJECT_ID

# Habilitar APIs necesarias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Configurar Cloud Build

```bash
# Dar permisos a Cloud Build para desplegar en Cloud Run
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

## 🚀 Opción 1: Despliegue Automático con Cloud Build

### Configurar Trigger en Cloud Build

1. Ve a [Cloud Build Triggers](https://console.cloud.google.com/cloud-build/triggers)
2. Click en "Create Trigger"
3. Configura:
   - **Name**: `medisupply-web-deploy`
   - **Event**: Push to a branch
   - **Source**: Conecta tu repositorio (GitHub, GitLab, etc.)
   - **Branch**: `^main$` (o la rama que uses)
   - **Configuration**: Cloud Build configuration file
   - **Location**: `cloudbuild.yaml`

### El pipeline automáticamente:

1. ✅ Instala dependencias
2. ✅ Ejecuta tests unitarios
3. ✅ Construye la aplicación Angular
4. ✅ Construye la imagen Docker
5. ✅ Sube la imagen a Container Registry
6. ✅ Despliega en Cloud Run

## 🛠️ Opción 2: Despliegue Manual

### Usando el script de despliegue

```bash
# Dar permisos de ejecución
chmod +x scripts/deploy-gcp.sh

# Desplegar en desarrollo
./scripts/deploy-gcp.sh dev

# Desplegar en producción
./scripts/deploy-gcp.sh prod
```

### Usando Cloud Build directamente

```bash
# Enviar build a Cloud Build
gcloud builds submit --config cloudbuild.yaml

# O construir y desplegar manualmente
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/medisupply-web

gcloud run deploy medisupply-web \
    --image gcr.io/YOUR_PROJECT_ID/medisupply-web \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated
```

## 📝 Variables de Entorno

Puedes configurar variables de entorno en Cloud Run:

```bash
gcloud run services update medisupply-web \
    --region us-central1 \
    --set-env-vars "NODE_ENV=production,API_URL=https://api.example.com"
```

## 🔍 Verificar el Despliegue

### Ver logs en tiempo real

```bash
gcloud run services logs read medisupply-web --region us-central1 --limit 50
```

### Obtener la URL del servicio

```bash
gcloud run services describe medisupply-web \
    --region us-central1 \
    --format 'value(status.url)'
```

### Probar el servicio

```bash
SERVICE_URL=$(gcloud run services describe medisupply-web \
    --region us-central1 \
    --format 'value(status.url)')

curl $SERVICE_URL
```

## 🎯 Configuración de Dominio Personalizado

### 1. Mapear dominio a Cloud Run

```bash
gcloud run domain-mappings create \
    --service medisupply-web \
    --domain medisupply.com \
    --region us-central1
```

### 2. Configurar DNS

Sigue las instrucciones que aparecen después del comando anterior para configurar los registros DNS.

## 🔐 Seguridad

### Autenticación (opcional)

Si quieres que el servicio requiera autenticación:

```bash
gcloud run services update medisupply-web \
    --region us-central1 \
    --no-allow-unauthenticated
```

Luego, para invocar el servicio necesitarás un token:

```bash
TOKEN=$(gcloud auth print-identity-token)
curl -H "Authorization: Bearer $TOKEN" $SERVICE_URL
```

## 📊 Monitoreo

### Ver métricas en Cloud Console

1. Ve a [Cloud Run Services](https://console.cloud.google.com/run)
2. Selecciona tu servicio
3. Ve a la pestaña "Metrics"

### Configurar alertas

```bash
# Crear política de alerta para errores
gcloud alpha monitoring policies create \
    --notification-channels=CHANNEL_ID \
    --display-name="High Error Rate" \
    --condition-display-name="Error rate > 5%" \
    --condition-threshold-value=5 \
    --condition-threshold-duration=300s
```

## 💰 Optimización de Costos

### Configurar auto-scaling

```bash
gcloud run services update medisupply-web \
    --region us-central1 \
    --min-instances 0 \
    --max-instances 10 \
    --cpu 1 \
    --memory 512Mi
```

### Usar Cloud CDN (opcional)

Para mejor rendimiento, puedes configurar Cloud CDN detrás de un Load Balancer.

## 🐛 Troubleshooting

### Problema: Build falla en tests

**Solución**: Verifica que las dependencias estén correctas:
```bash
npm ci
npm run test:ci
```

### Problema: Imagen muy grande

**Solución**: Usa multi-stage build (ya implementado en Dockerfile)

### Problema: Cloud Run no inicia

**Solución**: Verifica los logs:
```bash
gcloud run services logs read medisupply-web --region us-central1
```

### Problema: CORS errors

**Solución**: Asegúrate de que los servicios backend tengan CORS configurado correctamente.

## 📚 Recursos Adicionales

- [Documentación de Cloud Run](https://cloud.google.com/run/docs)
- [Documentación de Cloud Build](https://cloud.google.com/build/docs)
- [Container Registry](https://cloud.google.com/container-registry/docs)

## 🔄 Actualizar el Despliegue

Cada vez que hagas push a la rama principal, Cloud Build automáticamente:
1. Detecta el cambio
2. Ejecuta el pipeline
3. Despliega la nueva versión

Para forzar un nuevo despliegue manualmente:

```bash
gcloud builds submit --config cloudbuild.yaml
```

## 📞 Soporte

Si encuentras problemas, revisa:
1. Los logs de Cloud Build
2. Los logs de Cloud Run
3. La configuración en `cloudbuild.yaml`
4. Las variables de entorno configuradas

