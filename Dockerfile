# Dockerfile para producción en GCP Cloud Run
# Este Dockerfile asume que la aplicación ya fue construida por Cloud Build

FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos necesarios para el servidor
COPY package*.json ./
COPY server.js ./

# Instalar solo dependencias de producción (Express)
RUN npm ci --only=production

# Copiar los archivos construidos (dist/) desde el contexto de Cloud Build
COPY dist/ ./dist/

# Exponer el puerto (Cloud Run usa PORT env var)
ENV PORT=8080
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["node", "server.js"]
