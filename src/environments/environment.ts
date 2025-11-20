export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  // Microservicios en Google Cloud Run
  // En desarrollo, usar proxy para evitar CORS (ver proxy.conf.json)
  // En producción, usar URLs directas (CORS debe estar configurado en backend)
  useProxy: true, // Cambiar a false si prefieres usar URLs directas
  services: {
    auth: 'https://auth-service-swn62v7z2q-uc.a.run.app',
    product: 'https://product-service-swn62v7z2q-uc.a.run.app',
    order: 'https://order-service-swn62v7z2q-uc.a.run.app',
    logistics: 'https://logistics-service-swn62v7z2q-uc.a.run.app',
    notifications: 'https://notifications-service-swn62v7z2q-uc.a.run.app'
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

