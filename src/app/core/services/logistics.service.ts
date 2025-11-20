import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface RouteStop {
  orderId: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  sequence: number;
}

export interface Route {
  _id?: string;
  routeNumber?: string;
  vendorId: string;
  vehicleId: string;
  vehicleType: string;
  driverName: string;
  driverPhone?: string;
  stops: RouteStop[];
  status: 'Programado' | 'En Tránsito' | 'Completado' | 'Cancelado';
  startTime?: Date | string;
  endTime?: Date | string;
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedFuel: number;
  actualDistance?: number;
  actualDuration?: number;
  actualFuel?: number;
  progress: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SuggestedRoute {
  id: string;
  distance: string;
  duration: string;
  fuel: string;
  stops: number;
  route: string[];
  coordinates: Array<[number, number]>;
}

@Injectable({
  providedIn: 'root'
})
export class LogisticsService {
  private logisticsServiceUrl = environment.useProxy && !environment.production 
    ? environment.proxyServices?.logistics || environment.services.logistics
    : environment.services.logistics;

  constructor(private api: ApiService) {}

  getRoutes(params?: { status?: string }): Observable<{ routes: Route[] }> {
    let endpoint = '/routes';
    if (params?.status) {
      endpoint += `?status=${params.status}`;
    }
    return this.api.get<{ routes: Route[] }>(endpoint, this.logisticsServiceUrl);
  }

  getRoute(id: string): Observable<{ route: Route }> {
    return this.api.get<{ route: Route }>(`/routes/${id}`, this.logisticsServiceUrl);
  }

  createRoute(route: Partial<Route>): Observable<{ message: string; route: Route }> {
    return this.api.post<{ message: string; route: Route }>('/routes', route, this.logisticsServiceUrl);
  }

  updateRoute(id: string, route: Partial<Route>): Observable<{ message: string; route: Route }> {
    return this.api.put<{ message: string; route: Route }>(`/routes/${id}`, route, this.logisticsServiceUrl);
  }

  deleteRoute(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/routes/${id}`, this.logisticsServiceUrl);
  }

  generateOptimalRoutes(orderIds: string[], vehicleType?: string): Observable<{ suggestedRoutes: SuggestedRoute[]; orders: any[] }> {
    return this.api.post<{ suggestedRoutes: SuggestedRoute[]; orders: any[] }>(
      '/routes/generate-optimal',
      { orderIds, vehicleType },
      this.logisticsServiceUrl
    );
  }
}

