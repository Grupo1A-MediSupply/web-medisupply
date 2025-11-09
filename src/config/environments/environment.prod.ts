// Environment configuration for production
// Las URLs se cargan dinámicamente en tiempo de ejecución desde window.env
// para evitar que queden hardcodeadas en el bundle compilado

// Declarar la interfaz para window.env
declare global {
  interface Window {
    env?: {
      PROD_AUTH_URL?: string;
      PROD_PRODUCT_URL?: string;
      PROD_ORDER_URL?: string;
      PROD_LOGISTICS_URL?: string;
      PROD_NOTIFICATIONS_URL?: string;
    };
  }
}

// Función para obtener valores de window.env o usar valores por defecto
function getEnvVar(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined' && window.env && window.env[key as keyof typeof window.env]) {
    return window.env[key as keyof typeof window.env] || defaultValue;
  }
  return defaultValue;
}

export const environment = {
  production: true,
  // URLs del backend para producción (se cargan dinámicamente en tiempo de ejecución)
  // Estas funciones leen de window.env que se inyecta en tiempo de ejecución
  get authUrl(): string {
    return getEnvVar('PROD_AUTH_URL', '{{PROD_AUTH_URL}}');
  },
  get productUrl(): string {
    return getEnvVar('PROD_PRODUCT_URL', '{{PROD_PRODUCT_URL}}');
  },
  get orderUrl(): string {
    return getEnvVar('PROD_ORDER_URL', '{{PROD_ORDER_URL}}');
  },
  get logisticsUrl(): string {
    return getEnvVar('PROD_LOGISTICS_URL', '{{PROD_LOGISTICS_URL}}');
  },
  get notificationsUrl(): string {
    return getEnvVar('PROD_NOTIFICATIONS_URL', '{{PROD_NOTIFICATIONS_URL}}');
  },
  
  // Rutas base de la API
  apiBasePath: '/api/v1',
  
  // URLs completas para cada servicio (se cargan dinámicamente en tiempo de ejecución)
  get authApiUrl(): string {
    const baseUrl = this.authUrl;
    return baseUrl !== '{{PROD_AUTH_URL}}' ? `${baseUrl}/api/v1/auth` : '{{PROD_AUTH_URL}}/api/v1/auth';
  },
  get productApiUrl(): string {
    const baseUrl = this.productUrl;
    return baseUrl !== '{{PROD_PRODUCT_URL}}' ? `${baseUrl}/api/v1` : '{{PROD_PRODUCT_URL}}/api/v1';
  },
  get orderApiUrl(): string {
    const baseUrl = this.orderUrl;
    return baseUrl !== '{{PROD_ORDER_URL}}' ? `${baseUrl}/api/v1` : '{{PROD_ORDER_URL}}/api/v1';
  },
  get logisticsApiUrl(): string {
    const baseUrl = this.logisticsUrl;
    return baseUrl !== '{{PROD_LOGISTICS_URL}}' ? `${baseUrl}/api/v1` : '{{PROD_LOGISTICS_URL}}/api/v1';
  },
  get notificationsApiUrl(): string {
    const baseUrl = this.notificationsUrl;
    return baseUrl !== '{{PROD_NOTIFICATIONS_URL}}' ? `${baseUrl}/api/v1` : '{{PROD_NOTIFICATIONS_URL}}/api/v1';
  }
};

