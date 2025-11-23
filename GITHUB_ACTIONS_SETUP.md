# Configuración de GitHub Actions para Despliegue en GCP

Este documento explica cómo configurar los secrets de GitHub necesarios para el despliegue automático en GCP Cloud Run.

## Requisitos Previos

1. Tener un proyecto en Google Cloud Platform
2. Tener una Service Account con permisos para Cloud Run
3. Acceso a la configuración de secrets de GitHub

## Configuración de Secrets en GitHub

### Paso 1: Crear una Service Account en GCP

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto
3. Ve a **IAM & Admin** > **Service Accounts**
4. Haz clic en **Create Service Account**
5. Nombre: `github-actions-deployer`
6. Descripción: `Service account para GitHub Actions`
7. Haz clic en **Create and Continue**

### Paso 2: Asignar Permisos a la Service Account

Asigna los siguientes roles:
- `Cloud Run Admin` (roles/run.admin)
- `Service Account User` (roles/iam.serviceAccountUser)
- `Storage Admin` (roles/storage.admin) - Para push de imágenes Docker

### Paso 3: Crear y Descargar la Key JSON

1. En la Service Account creada, ve a la pestaña **Keys**
2. Haz clic en **Add Key** > **Create new key**
3. Selecciona **JSON**
4. Haz clic en **Create**
5. Se descargará un archivo JSON - **guárdalo de forma segura**

### Paso 4: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** > **Secrets and variables** > **Actions**
3. Haz clic en **New repository secret**

#### Secret 1: `GCP_PROJECT_ID`
- **Name**: `GCP_PROJECT_ID`
- **Value**: El ID de tu proyecto GCP (ejemplo: `project-65436llm`)

#### Secret 2: `GCP_SA_KEY`
- **Name**: `GCP_SA_KEY`
- **Value**: El contenido completo del archivo JSON descargado en el Paso 3
  - Abre el archivo JSON con un editor de texto
  - Copia TODO el contenido (incluyendo las llaves `{` y `}`)
  - Pégalo en el campo Value

### Paso 5: Verificar la Configuración

1. Haz un push a la rama `main`, `master`, `develop` o cualquier rama `feature/*`
2. Ve a la pestaña **Actions** en GitHub
3. Deberías ver el workflow ejecutándose
4. Si hay errores, revisa los logs en la sección **Actions**

## Alternativa: Usar Workload Identity Federation (Recomendado para Producción)

Para mayor seguridad, puedes usar Workload Identity Federation en lugar de Service Account Keys:

1. Ve a **IAM & Admin** > **Workload Identity Federation**
2. Crea un nuevo pool de identidad
3. Configura el provider de GitHub
4. Actualiza el workflow para usar `workload_identity_provider` en lugar de `credentials_json`

Ejemplo de configuración en el workflow:
```yaml
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/providers/PROVIDER_ID
    service_account: SERVICE_ACCOUNT_EMAIL
```

## Troubleshooting

### Error: "the GitHub Action workflow must specify exactly one of 'workload_identity_provider' or 'credentials_json'"

**Causa**: El secret `GCP_SA_KEY` no está configurado o está vacío.

**Solución**:
1. Verifica que el secret `GCP_SA_KEY` existe en GitHub
2. Verifica que el contenido del JSON es válido
3. Asegúrate de que el secret no tiene espacios extra al inicio o final

### Error: "PROJECT_ID is empty"

**Causa**: El secret `GCP_PROJECT_ID` no está configurado.

**Solución**:
1. Verifica que el secret `GCP_PROJECT_ID` existe en GitHub
2. Verifica que el valor es el ID correcto del proyecto (no el nombre)

### Error: "Permission denied" o "Access denied"

**Causa**: La Service Account no tiene los permisos necesarios.

**Solución**:
1. Verifica que la Service Account tiene los roles mencionados en el Paso 2
2. Verifica que el proyecto GCP es correcto
3. Verifica que la Service Account está habilitada

## Verificación Rápida

Para verificar que los secrets están configurados:

```bash
# En GitHub, ve a Settings > Secrets and variables > Actions
# Deberías ver:
# - GCP_PROJECT_ID
# - GCP_SA_KEY
```

## Notas Importantes

- ⚠️ **Nunca** commits el archivo JSON de la Service Account al repositorio
- ⚠️ Los secrets solo están disponibles para workflows en la rama por defecto (no en forks)
- ⚠️ Los secrets no se muestran en los logs (aparecen como `***`)

