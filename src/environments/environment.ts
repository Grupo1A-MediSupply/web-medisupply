export const environment = {
  production: false,
  apiUrl: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app/api/v1',
  // Backend monolítico en Google Cloud Run
  // En desarrollo, usar proxy para evitar CORS (ver proxy.conf.json)
  // En producción, usar URLs directas (CORS debe estar configurado en backend)
  useProxy: false, // Cambiar a false si prefieres usar URLs directas
  services: {
    auth: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app',
    product: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app',
    order: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app',
    logistics: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app',
    notifications: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app'
  },
  // URLs del proxy (solo para desarrollo)
  proxyServices: {
    auth: '/auth-service',
    product: '/product-service',
    order: '/order-service',
    logistics: '/logistics-service',
    notifications: '/notifications-service'
  }
};

