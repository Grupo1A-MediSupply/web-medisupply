# 🔐 Guía Paso a Paso: Configurar Secrets en GitHub

## 📋 Resumen de lo que necesitas configurar

- **GCP_PROJECT_ID**: `project-65436llm`
- **GCP_SA_KEY**: Contenido completo del archivo JSON

---

## 🚀 Paso 1: Ir a la Configuración de Secrets

1. Abre tu navegador y ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración) en la parte superior del repositorio
3. En el menú lateral izquierdo, busca y haz clic en **Secrets and variables**
4. Haz clic en **Actions**

---

## 🔑 Paso 2: Configurar GCP_PROJECT_ID

1. Haz clic en el botón **New repository secret** (Nuevo secret del repositorio)
2. En el campo **Name** (Nombre), escribe exactamente:
   ```
   GCP_PROJECT_ID
   ```
3. En el campo **Secret** (Valor), escribe:
   ```
   project-65436llm
   ```
4. Haz clic en **Add secret** (Agregar secret)

✅ **Verificación**: Deberías ver `GCP_PROJECT_ID` en la lista de secrets.

---

## 🔑 Paso 3: Configurar GCP_SA_KEY

### Opción A: Usar el contenido del portapapeles (Recomendado)

El contenido del JSON ya está copiado en tu portapapeles. Solo sigue estos pasos:

1. Haz clic en **New repository secret** (Nuevo secret del repositorio)
2. En el campo **Name** (Nombre), escribe exactamente:
   ```
   GCP_SA_KEY
   ```
3. En el campo **Secret** (Valor):
   - Haz clic en el campo de texto
   - Presiona **Cmd+V** (o clic derecho > Pegar) para pegar el contenido del JSON
   - **IMPORTANTE**: Asegúrate de que el JSON comience con `{` y termine con `}`
4. Haz clic en **Add secret** (Agregar secret)

### Opción B: Si necesitas copiar el contenido de nuevo

Si por alguna razón necesitas copiar el contenido de nuevo, ejecuta en tu terminal:

```bash
cat ~/github-actions-deployer-key.json | pbcopy
```

Esto copiará el contenido al portapapeles.

---

## ✅ Paso 4: Verificar que los Secrets están Configurados

Después de agregar ambos secrets, deberías ver en la lista:

- ✅ `GCP_PROJECT_ID`
- ✅ `GCP_SA_KEY`

**Nota**: GitHub oculta el contenido de los secrets por seguridad (aparecen como `***`), esto es normal.

---

## 🧪 Paso 5: Probar el Workflow

1. Haz un commit y push a tu repositorio:
   ```bash
   git add .
   git commit -m "Configure GitHub Actions secrets"
   git push
   ```

2. Ve a la pestaña **Actions** en GitHub
3. Deberías ver el workflow ejecutándose
4. El paso "Verify secrets are configured" debería mostrar: ✅ **Secrets are configured**

---

## ⚠️ Errores Comunes y Soluciones

### Error: "GCP_SA_KEY secret is not configured"

**Causa**: El secret no está configurado o está vacío.

**Solución**:
1. Verifica que el secret existe en la lista
2. Si existe, elimínalo y créalo de nuevo
3. Asegúrate de copiar TODO el contenido del JSON (desde `{` hasta `}`)

### Error: "Invalid JSON format"

**Causa**: El JSON tiene formato incorrecto.

**Solución**:
1. Verifica el JSON localmente:
   ```bash
   python3 -m json.tool ~/github-actions-deployer-key.json
   ```
2. Si hay errores, el JSON está mal formateado
3. Copia el contenido de nuevo sin editar

### Error: "must specify exactly one of 'workload_identity_provider' or 'credentials_json'"

**Causa**: El secret `GCP_SA_KEY` está vacío o no se está pasando correctamente.

**Solución**:
1. Verifica que el secret existe
2. Elimina y recrea el secret
3. Asegúrate de pegar TODO el contenido del JSON sin espacios extra

---

## 📝 Checklist Final

Antes de hacer push, verifica:

- [ ] `GCP_PROJECT_ID` está configurado con valor: `project-65436llm`
- [ ] `GCP_SA_KEY` está configurado con el contenido completo del JSON
- [ ] El JSON comienza con `{` y termina con `}`
- [ ] No hay espacios extra al inicio o final del JSON
- [ ] Ambos secrets aparecen en la lista de secrets

---

## 🆘 Si Necesitas Ayuda

Si después de seguir estos pasos el problema persiste:

1. Verifica que el archivo JSON local es válido:
   ```bash
   cat ~/github-actions-deployer-key.json | python3 -m json.tool
   ```

2. Verifica que la Service Account existe:
   ```bash
   gcloud iam service-accounts describe github-actions-deployer@project-65436llm.iam.gserviceaccount.com
   ```

3. Revisa los logs del workflow en GitHub Actions para ver el error específico

---

## 📍 Ubicación del Archivo JSON

El archivo JSON está en:
```
/Users/lucasblandon/github-actions-deployer-key.json
```

Para ver su contenido:
```bash
cat ~/github-actions-deployer-key.json
```

Para copiarlo al portapapeles:
```bash
cat ~/github-actions-deployer-key.json | pbcopy
```

