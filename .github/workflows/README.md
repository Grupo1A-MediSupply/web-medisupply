# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para CI/CD.

## Configuración de Secrets

Para que los workflows funcionen, necesitas configurar los siguientes secrets en GitHub:

1. Ve a Settings > Secrets and variables > Actions
2. Agrega los siguientes secrets:

### `GCP_PROJECT_ID`
Tu Project ID de Google Cloud Platform
```
Ejemplo: medisupply-production
```

### `GCP_SA_KEY`
La clave JSON de una Service Account con permisos para:
- Cloud Build
- Cloud Run Admin
- Container Registry

Para crear la Service Account:

```bash
# Crear Service Account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions Service Account"

# Dar permisos necesarios
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Crear y descargar la clave
gcloud iam service-accounts keys create key.json \
    --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com

# Copiar el contenido de key.json al secret GCP_SA_KEY en GitHub
```

## Workflows Disponibles

### `deploy-gcp.yml`
- Se ejecuta en push a `main` o `master`
- Ejecuta tests
- Construye y despliega en Cloud Run
- No se ejecuta en Pull Requests (solo tests)

