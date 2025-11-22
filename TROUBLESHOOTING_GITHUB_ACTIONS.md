# Troubleshooting: Error de GitHub Actions con GCP

## Error: "must specify exactly one of 'workload_identity_provider' or 'credentials_json'"

Este error indica que el secret `GCP_SA_KEY` no está configurado o está vacío en GitHub.

## Solución Paso a Paso

### 1. Verificar que los Secrets están Configurados

1. Ve a tu repositorio en GitHub
2. **Settings** > **Secrets and variables** > **Actions**
3. Verifica que existen estos dos secrets:
   - `GCP_PROJECT_ID`
   - `GCP_SA_KEY`

### 2. Verificar el Contenido de GCP_PROJECT_ID

- **Name**: `GCP_PROJECT_ID`
- **Value**: Debe ser exactamente `project-65436llm` (sin espacios, sin comillas)

### 3. Verificar el Contenido de GCP_SA_KEY

El secret `GCP_SA_KEY` debe contener el JSON completo de la Service Account.

**Formato correcto:**
```json
{
  "type": "service_account",
  "project_id": "project-65436llm",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "github-actions-deployer@project-65436llm.iam.gserviceaccount.com",
  ...
}
```

**Errores comunes:**
- ❌ Tener espacios extra al inicio o final
- ❌ Tener comillas alrededor del JSON
- ❌ Tener saltos de línea incorrectos
- ❌ Copiar solo parte del JSON

**Formato correcto al pegar:**
1. Abre el archivo: `~/github-actions-deployer-key.json`
2. Selecciona TODO el contenido (Cmd+A)
3. Copia (Cmd+C)
4. Pega directamente en el campo Value del secret (sin editar)

### 4. Verificar que el JSON es Válido

Puedes validar el JSON localmente:

```bash
# Verificar que el archivo existe y es válido
cat ~/github-actions-deployer-key.json | python3 -m json.tool
```

Si hay errores de sintaxis, el JSON no es válido.

### 5. Eliminar y Recrear el Secret

Si el secret está mal configurado:

1. Ve a **Settings** > **Secrets and variables** > **Actions**
2. Encuentra `GCP_SA_KEY`
3. Haz clic en el ícono de **eliminar** (🗑️)
4. Crea un nuevo secret con el mismo nombre
5. Copia TODO el contenido del archivo JSON
6. Pega en el campo Value
7. Guarda

### 6. Verificar que el Workflow se Ejecuta en la Rama Correcta

Los secrets solo están disponibles para:
- Workflows en la rama por defecto
- Workflows en otras ramas del mismo repositorio
- **NO** están disponibles en forks

Si estás trabajando en un fork, necesitas configurar los secrets en el fork también.

### 7. Verificar los Logs del Workflow

1. Ve a la pestaña **Actions** en GitHub
2. Selecciona el workflow que falló
3. Revisa el paso "Verify secrets are configured"
   - Si dice "✅ Secrets are configured" → Los secrets están bien
   - Si dice "❌ Error: GCP_SA_KEY secret is not configured" → El secret no está configurado

## Comandos Útiles

### Ver el contenido del archivo JSON localmente:
```bash
cat ~/github-actions-deployer-key.json
```

### Copiar al portapapeles:
```bash
cat ~/github-actions-deployer-key.json | pbcopy
```

### Validar el JSON:
```bash
cat ~/github-actions-deployer-key.json | python3 -m json.tool
```

## Verificación Final

Después de configurar los secrets correctamente:

1. Haz un push a la rama `main`, `develop` o cualquier `feature/*`
2. Ve a **Actions** en GitHub
3. El workflow debería ejecutarse sin errores
4. El paso "Verify secrets are configured" debería mostrar: ✅ Secrets are configured

## Si el Problema Persiste

1. **Verifica que el archivo JSON local es válido:**
   ```bash
   python3 -m json.tool ~/github-actions-deployer-key.json
   ```

2. **Verifica que la Service Account existe:**
   ```bash
   gcloud iam service-accounts describe github-actions-deployer@project-65436llm.iam.gserviceaccount.com
   ```

3. **Recrea la key si es necesario:**
   ```bash
   # Eliminar la key anterior (opcional)
   gcloud iam service-accounts keys list --iam-account=github-actions-deployer@project-65436llm.iam.gserviceaccount.com
   
   # Crear una nueva key
   gcloud iam service-accounts keys create ~/github-actions-deployer-key-new.json \
     --iam-account=github-actions-deployer@project-65436llm.iam.gserviceaccount.com
   ```

## Contacto

Si después de seguir estos pasos el problema persiste, verifica:
- Que el repositorio no es un fork (o que los secrets están configurados en el fork)
- Que el workflow está en la rama correcta
- Que los secrets no tienen espacios extra o caracteres especiales

