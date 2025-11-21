import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id?: string;
  orderNumber?: string;
  clientId: string;
  vendorId: string;
  products: OrderProduct[];
  status: 'Creado' | 'Programado' | 'En Tránsito' | 'Completado' | 'Pendiente' | 'Cancelado';
  deliveryAddress: string;
  deliveryDate: Date | string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  routeId?: string;
  returnRequested?: boolean;
  returnReason?: string;
  returnStatus?: 'Pendiente' | 'Procesada' | 'Rechazada';
  totalAmount: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderServiceUrl = environment.useProxy && !environment.production 
    ? environment.proxyServices?.order || environment.services.order
    : environment.services.order;

  constructor(private api: ApiService) {}

  getOrders(params?: { status?: string }): Observable<{ orders: Order[] }> {
    let endpoint = '/api/v1/orders';
    if (params?.status) {
      endpoint += `?status=${params.status}`;
    }
    return this.api.get<{ orders: Order[] }>(endpoint, this.orderServiceUrl);
  }

  getOrder(id: string): Observable<{ order: Order }> {
    return this.api.get<{ order: Order }>(`/api/v1/orders/${id}`, this.orderServiceUrl);
  }

  createOrder(order: Partial<Order>): Observable<{ message: string; order: Order }> {
    return this.api.post<{ message: string; order: Order }>('/api/v1/orders', order, this.orderServiceUrl);
  }

  updateOrder(id: string, order: Partial<Order>): Observable<{ message: string; order: Order }> {
    return this.api.put<{ message: string; order: Order }>(`/api/v1/orders/${id}`, order, this.orderServiceUrl);
  }

  deleteOrder(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/api/v1/orders/${id}`, this.orderServiceUrl);
  }

  requestReturn(id: string, reason: string): Observable<{ message: string; order: Order }> {
    return this.api.post<{ message: string; order: Order }>(`/api/v1/orders/${id}/return`, { reason }, this.orderServiceUrl);
  }
}

