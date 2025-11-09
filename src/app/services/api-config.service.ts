import { Injectable } from '@angular/core';
import { environment } from '../../config/environments/environment';

/**
 * Servicio de configuración de API
 * Proporciona las URLs base para todos los servicios del backend
 */
@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  
  constructor() {}

  /**
   * URL base para el servicio de autenticación
   * Ejemplo: PROD_AUTH_URL/api/v1/auth/register
   */
  get authUrl(): string {
    return environment.authUrl;
  }

  /**
   * URL completa para endpoints de autenticación
   * Ejemplo: PROD_AUTH_URL/api/v1/auth/register
   */
  get authApiUrl(): string {
    return environment.authApiUrl;
  }

  /**
   * URL base para el servicio de productos
   */
  get productUrl(): string {
    return environment.productUrl;
  }

  /**
   * URL completa para endpoints de productos
   * Ejemplo: PROD_PRODUCT_URL/api/v1/products
   */
  get productApiUrl(): string {
    return environment.productApiUrl;
  }

  /**
   * URL base para el servicio de órdenes
   */
  get orderUrl(): string {
    return environment.orderUrl;
  }

  /**
   * URL completa para endpoints de órdenes
   * Ejemplo: PROD_ORDER_URL/api/v1/orders
   */
  get orderApiUrl(): string {
    return environment.orderApiUrl;
  }

  /**
   * URL base para el servicio de logística
   */
  get logisticsUrl(): string {
    return environment.logisticsUrl;
  }

  /**
   * URL completa para endpoints de logística
   * Ejemplo: PROD_LOGISTICS_URL/api/v1/routes
   */
  get logisticsApiUrl(): string {
    return environment.logisticsApiUrl;
  }

  /**
   * URL base para el servicio de notificaciones
   */
  get notificationsUrl(): string {
    return environment.notificationsUrl;
  }

  /**
   * URL completa para endpoints de notificaciones
   * Ejemplo: PROD_NOTIFICATIONS_URL/api/v1/notifications
   */
  get notificationsApiUrl(): string {
    return environment.notificationsApiUrl;
  }

  /**
   * Ruta base de la API
   */
  get apiBasePath(): string {
    return environment.apiBasePath;
  }

  /**
   * Indica si está en modo producción
   */
  get isProduction(): boolean {
    return environment.production;
  }
}

