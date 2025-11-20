import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

export interface Notification {
  _id?: string;
  userId: string;
  type: 'order' | 'route' | 'inventory' | 'system';
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt?: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsServiceUrl = environment.useProxy && !environment.production 
    ? environment.proxyServices?.notifications || environment.services.notifications
    : environment.services.notifications;

  constructor(private api: ApiService) {}

  getNotifications(params?: { read?: boolean; type?: string }): Observable<{ notifications: Notification[] }> {
    let endpoint = '/notifications';
    const queryParams = new URLSearchParams();
    if (params?.read !== undefined) queryParams.append('read', params.read.toString());
    if (params?.type) queryParams.append('type', params.type);
    const queryString = queryParams.toString();
    if (queryString) endpoint += `?${queryString}`;
    return this.api.get<{ notifications: Notification[] }>(endpoint, this.notificationsServiceUrl);
  }

  getNotification(id: string): Observable<{ notification: Notification }> {
    return this.api.get<{ notification: Notification }>(`/notifications/${id}`, this.notificationsServiceUrl);
  }

  markAsRead(id: string): Observable<{ message: string; notification: Notification }> {
    return this.api.put<{ message: string; notification: Notification }>(
      `/notifications/${id}/read`,
      {},
      this.notificationsServiceUrl
    );
  }

  markAllAsRead(): Observable<{ message: string }> {
    return this.api.put<{ message: string }>('/notifications/read-all', {}, this.notificationsServiceUrl);
  }

  deleteNotification(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/notifications/${id}`, this.notificationsServiceUrl);
  }
}

