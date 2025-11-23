# MediSupply Deployment Guide

Este documento explica cómo desplegar la aplicación MediSupply en AWS usando S3 + CloudFront con Terraform.

## 🏗️ Arquitectura

```
GitHub Actions → Build → Terraform → AWS S3 + CloudFront
```

- **S3**: Hosting estático de la aplicación Angular
- **CloudFront**: CDN para distribución global y HTTPS
- **Terraform**: Infraestructura como código

## 📋 Prerrequisitos

### 1. AWS Account
- Cuenta de AWS activa
- Permisos para crear recursos S3 y CloudFront

### 2. AWS CLI
```bash
# Instalar AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configurar credenciales
aws configure
```

### 3. Terraform
```bash
# Instalar Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/
```

### 4. Node.js
```bash
# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🔧 Configuración

### 1. Configurar AWS Credentials

#### Opción A: AWS CLI
```bash
aws configure
# AWS Access Key ID: [TU_ACCESS_KEY]
# AWS Secret Access Key: [TU_SECRET_KEY]
# Default region name: us-east-1
# Default output format: json
```

#### Opción B: Variables de entorno
```bash
export AWS_ACCESS_KEY_ID="tu_access_key"
export AWS_SECRET_ACCESS_KEY="tu_secret_key"
export AWS_DEFAULT_REGION="us-east-1"
```

### 2. Configurar GitHub Secrets

En tu repositorio de GitHub, ve a Settings → Secrets and variables → Actions y agrega:

- `AWS_ACCESS_KEY_ID`: Tu AWS Access Key
- `AWS_SECRET_ACCESS_KEY`: Tu AWS Secret Key

### 3. Configurar Terraform

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edita terraform.tfvars con tus valores
```

## 🚀 Despliegue

### Despliegue Automático (GitHub Actions)

1. **Push a main o develop:**
```bash
git add .
git commit -m "Deploy to AWS"
git push origin main
```

2. **Verificar en GitHub Actions:**
   - Ve a la pestaña "Actions"
   - Verás el workflow "MediSupply CD Pipeline" ejecutándose
   - Espera a que termine (5-10 minutos)

### Despliegue Manual

```bash
# Hacer el script ejecutable
chmod +x scripts/deploy.sh

# Ejecutar despliegue
./scripts/deploy.sh
```

### Despliegue paso a paso

```bash
# 1. Construir la aplicación
npm ci
npm run build

# 2. Desplegar infraestructura
cd terraform
terraform init
terraform plan
terraform apply

# 3. Subir archivos a S3
aws s3 sync dist/ s3://tu-bucket-name --delete

# 4. Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"
```

## 📊 Monitoreo

### Verificar despliegue

1. **S3 Bucket:**
```bash
aws s3 ls s3://tu-bucket-name
```

2. **CloudFront:**
```bash
aws cloudfront get-distribution --id E1234567890ABC
```

3. **Acceder a la aplicación:**
   - CloudFront URL: `https://d1234567890abc.cloudfront.net`
   - S3 Website URL: `http://tu-bucket-name.s3-website-us-east-1.amazonaws.com`

## 🔍 Troubleshooting

### Error: "Bucket already exists"
```bash
# Cambiar el nombre del bucket en terraform/main.tf
resource "aws_s3_bucket" "website" {
  bucket = "nuevo-nombre-unico-medisupply"
}
```

### Error: "Access Denied"
```bash
# Verificar permisos de AWS
aws sts get-caller-identity
```

### Error: "Terraform state locked"
```bash
# Forzar unlock (solo si es seguro)
terraform force-unlock LOCK_ID
```

## 💰 Costos Estimados

- **S3**: ~$0.023 por GB/mes
- **CloudFront**: ~$0.085 por GB transferido
- **Terraform**: Gratis (solo almacenamiento de estado)

## 🔒 Seguridad

### Mejores prácticas implementadas:

1. **S3 Bucket Policy**: Solo lectura pública para archivos estáticos
2. **CloudFront**: HTTPS obligatorio
3. **Origin Access Control**: Acceso controlado desde CloudFront
4. **Terraform State**: Almacenamiento seguro (recomendado usar S3 backend)

### Configurar S3 Backend para Terraform:

```hcl
# terraform/backend.tf
terraform {
  backend "s3" {
    bucket = "medisupply-terraform-state"
    key    = "infrastructure/terraform.tfstate"
    region = "us-east-1"
  }
}
```

## 📚 Recursos Adicionales

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [GitHub Actions AWS](https://github.com/aws-actions/configure-aws-credentials)

## 🆘 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs de GitHub Actions
2. Verifica las credenciales de AWS
3. Consulta la documentación de AWS
4. Contacta al equipo de desarrollo
