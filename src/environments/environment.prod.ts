export const environment = {
  production: true,
  apiUrl: 'https://api.medisupply.com/api',
  // Microservicios en Google Cloud Run (producción)
  services: {
    auth: 'https://auth-service-swn62v7z2q-uc.a.run.app',
    product: 'https://product-service-swn62v7z2q-uc.a.run.app',
    order: 'https://order-service-swn62v7z2q-uc.a.run.app',
    logistics: 'https://logistics-service-swn62v7z2q-uc.a.run.app',
    notifications: 'https://notifications-service-swn62v7z2q-uc.a.run.app'
  }
};

