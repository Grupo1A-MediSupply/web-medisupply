import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface Reports {
  ordersByStatus: {
    Creado: number;
    Programado: number;
    'En Tránsito': number;
    Completado: number;
    Pendiente: number;
  };
  inventoryStatus?: {
    normalStock: number;
    lowStock: number;
    expiringSoon: number;
    expired: number;
  };
  returnsByReason: {
    'Producto Defectuoso': number;
    'Pedido Incorrecto': number;
    'Daño en Transporte': number;
    'Cliente No Satisfecho': number;
  };
  routesStats?: {
    total: number;
    active: number;
    completed: number;
    pending: number;
  };
  totalReturns: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private orderServiceUrl = environment.services.order;
  private productServiceUrl = environment.services.product;
  private logisticsServiceUrl = environment.services.logistics;

  constructor(private api: ApiService) {}

  /**
   * Obtener reportes combinados de todos los servicios
   * Nota: Esto podría requerir múltiples llamadas o un endpoint dedicado en un servicio de agregación
   */
  getReports(): Observable<Reports> {
    // Por ahora, usar el endpoint del servicio de órdenes si existe
    // O implementar lógica para combinar datos de múltiples servicios
    return this.api.get<Reports>('/api/v1/reports', this.orderServiceUrl);
  }
}

