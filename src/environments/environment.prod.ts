export const environment = {
  production: true,
  //apiUrl: 'https://api.medisupply.com/api',
  apiUrl: 'https://auth-service-swn62v7z2q-uc.a.run.app',
  // En producción, usar URLs directas (CORS debe estar configurado en backend)
  useProxy: false, // En producción no se usa proxy
  // Microservicios en Google Cloud Run (producción)
  services: {
    auth: 'https://auth-service-swn62v7z2q-uc.a.run.app',
    product: 'https://product-service-swn62v7z2q-uc.a.run.app',
    order: 'https://order-service-swn62v7z2q-uc.a.run.app',
    logistics: 'https://logistics-service-swn62v7z2q-uc.a.run.app',
    notifications: 'https://notifications-service-swn62v7z2q-uc.a.run.app'
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

