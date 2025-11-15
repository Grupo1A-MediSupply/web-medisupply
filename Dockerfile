# Dockerfile para producción en GCP Cloud Run
FROM node:18-alpine AS builder

# Instalar dependencias del sistema necesarias para build
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar código fuente
COPY . .

# Construir la aplicación Angular para producción
RUN npm run build

# Stage 2: Runtime con Nginx o Node.js
FROM node:18-alpine

# Instalar servidor HTTP simple o usar Express
WORKDIR /app

# Copiar archivos necesarios para el servidor
COPY package*.json ./
COPY server.js ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar los archivos construidos desde el stage anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto (Cloud Run usa PORT env var)
ENV PORT=8080
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["node", "server.js"]

