// Environment configuration for development
export const environment = {
  production: false,
  // URLs del backend para desarrollo (local)
  // En desarrollo, usamos rutas relativas que el proxy redirige al backend
  authUrl: 'http://localhost:8001',
  productUrl: 'http://localhost:8002',
  orderUrl: 'http://localhost:8003',
  logisticsUrl: 'http://localhost:8004',
  notificationsUrl: 'http://localhost:8005',
  
  // Rutas base de la API
  apiBasePath: '/api/v1',
  
  // URLs completas para cada servicio
  // En desarrollo, usamos rutas relativas que el proxy redirige al backend local
  // El proxy está configurado para redirigir /api/v1/auth a http://localhost:8001
  authApiUrl: '/api/v1/auth',
  productApiUrl: '/api/v1',
  orderApiUrl: '/api/v1',
  logisticsApiUrl: '/api/v1',
  notificationsApiUrl: '/api/v1'
};

