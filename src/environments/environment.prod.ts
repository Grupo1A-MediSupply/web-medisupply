export const environment = {
  production: true,
  apiUrl: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app/api/v1',
  // En producción, usar URLs directas (CORS debe estar configurado en backend)
  useProxy: false, // En producción no se usa proxy
  // Backend monolítico en Google Cloud Run (producción)
  services: {
    auth: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app',
    product: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app',
    order: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app',
    logistics: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app',
    notifications: 'https://medisupply-backend-api-swn62v7z2q-uc.a.run.app'
  },
  // No se usa en producción, pero necesario para consistencia de tipos
  proxyServices: {
    auth: '/auth-service',
    product: '/product-service',
    order: '/order-service',
    logistics: '/logistics-service',
    notifications: '/notifications-service'
  }
};

