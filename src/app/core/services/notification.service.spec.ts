import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationService } from './notification.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('NotificationService', () => {
  let service: NotificationService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationService,
        { provide: ApiService, useValue: apiService }
      ]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNotifications', () => {
    it('should get notifications without params', (done) => {
      const mockNotifications = { 
        notifications: [{ 
          _id: '1',
          userId: 'user1',
          type: 'order' as const,
          title: 'Test', 
          message: 'Message', 
          read: false
        }] 
      };
      apiService.get.and.returnValue(of(mockNotifications));

      service.getNotifications().subscribe(response => {
        expect(response).toEqual(mockNotifications);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/notifications', jasmine.any(String));
        done();
      });
    });

    it('should get notifications with read param', (done) => {
      const mockNotifications = { notifications: [] };
      apiService.get.and.returnValue(of(mockNotifications));

      service.getNotifications({ read: true }).subscribe(() => {
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/notifications?read=true', jasmine.any(String));
        done();
      });
    });

    it('should get notifications with type param', (done) => {
      const mockNotifications = { notifications: [] };
      apiService.get.and.returnValue(of(mockNotifications));

      service.getNotifications({ type: 'order' }).subscribe(() => {
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/notifications?type=order', jasmine.any(String));
        done();
      });
    });

    it('should get notifications with both params', (done) => {
      const mockNotifications = { notifications: [] };
      apiService.get.and.returnValue(of(mockNotifications));

      service.getNotifications({ read: false, type: 'order' }).subscribe(() => {
        const callArgs = apiService.get.calls.mostRecent().args[0];
        expect(callArgs).toContain('read=false');
        expect(callArgs).toContain('type=order');
        done();
      });
    });
  });

  describe('getNotification', () => {
    it('should get single notification by id', (done) => {
      const mockNotification = { 
        notification: { 
          _id: '123',
          userId: 'user1',
          type: 'order' as const,
          title: 'Test', 
          message: 'Message',
          read: false
        } 
      };
      apiService.get.and.returnValue(of(mockNotification));

      service.getNotification('123').subscribe(response => {
        expect(response).toEqual(mockNotification);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/notifications/123', jasmine.any(String));
        done();
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', (done) => {
      const mockResponse = { 
        message: 'Marked as read', 
        notification: { 
          _id: '123',
          userId: 'user1',
          type: 'order' as const,
          title: 'Test', 
          read: true,
          message: 'Message'
        } 
      };
      apiService.put.and.returnValue(of(mockResponse));

      service.markAsRead('123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.put).toHaveBeenCalledWith('/api/v1/notifications/123/read', {}, jasmine.any(String));
        done();
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', (done) => {
      const mockResponse = { message: 'All marked as read' };
      apiService.put.and.returnValue(of(mockResponse));

      service.markAllAsRead().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.put).toHaveBeenCalledWith('/api/v1/notifications/read-all', {}, jasmine.any(String));
        done();
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', (done) => {
      const mockResponse = { message: 'Deleted' };
      apiService.delete.and.returnValue(of(mockResponse));

      service.deleteNotification('123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.delete).toHaveBeenCalledWith('/api/v1/notifications/123', jasmine.any(String));
        done();
      });
    });
  });
});

