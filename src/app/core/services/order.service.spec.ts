import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('OrderService', () => {
  let service: OrderService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderService,
        { provide: ApiService, useValue: apiService }
      ]
    });
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrders', () => {
    it('should get orders without params', (done) => {
      const mockOrders = { 
        orders: [{ 
          _id: '1',
          orderNumber: 'ORD-001', 
          clientId: 'client1',
          vendorId: 'vendor1',
          products: [],
          status: 'Creado' as const,
          deliveryAddress: 'Address',
          deliveryDate: new Date(),
          totalAmount: 100
        }] 
      };
      apiService.get.and.returnValue(of(mockOrders));

      service.getOrders().subscribe(response => {
        expect(response).toEqual(mockOrders);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/orders', jasmine.any(String));
        done();
      });
    });

    it('should get orders with status param', (done) => {
      const mockOrders = { orders: [] };
      apiService.get.and.returnValue(of(mockOrders));

      service.getOrders({ status: 'Creado' }).subscribe(() => {
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/orders?status=Creado', jasmine.any(String));
        done();
      });
    });
  });

  describe('getOrder', () => {
    it('should get single order by id', (done) => {
      const mockOrder = { 
        order: { 
          _id: '123',
          orderNumber: 'ORD-001', 
          clientId: 'client1',
          vendorId: 'vendor1',
          products: [],
          status: 'Creado' as const,
          deliveryAddress: 'Address',
          deliveryDate: new Date(),
          totalAmount: 100
        } 
      };
      apiService.get.and.returnValue(of(mockOrder));

      service.getOrder('123').subscribe(response => {
        expect(response).toEqual(mockOrder);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/orders/123', jasmine.any(String));
        done();
      });
    });
  });

  describe('createOrder', () => {
    it('should create order', (done) => {
      const order = {
        clientId: 'client1',
        vendorId: 'vendor1',
        products: [],
        status: 'Creado' as const,
        deliveryAddress: 'Address',
        deliveryDate: new Date(),
        totalAmount: 100
      };
      const mockResponse = { message: 'Created', order };
      apiService.post.and.returnValue(of(mockResponse));

      service.createOrder(order).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.post).toHaveBeenCalledWith('/api/v1/orders', order, jasmine.any(String));
        done();
      });
    });
  });

  describe('updateOrder', () => {
    it('should update order', (done) => {
      const updates = { status: 'Completado' as const };
      const mockResponse = { 
        message: 'Updated', 
        order: { 
          _id: '123',
          orderNumber: 'ORD-001', 
          clientId: 'client1',
          vendorId: 'vendor1',
          products: [],
          status: 'Completado' as const,
          deliveryAddress: 'Address',
          deliveryDate: new Date(),
          totalAmount: 100
        } 
      };
      apiService.put.and.returnValue(of(mockResponse));

      service.updateOrder('123', updates).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.put).toHaveBeenCalledWith('/api/v1/orders/123', updates, jasmine.any(String));
        done();
      });
    });
  });

  describe('deleteOrder', () => {
    it('should delete order', (done) => {
      const mockResponse = { message: 'Deleted' };
      apiService.delete.and.returnValue(of(mockResponse));

      service.deleteOrder('123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.delete).toHaveBeenCalledWith('/api/v1/orders/123', jasmine.any(String));
        done();
      });
    });
  });

  describe('requestReturn', () => {
    it('should request return for order', (done) => {
      const reason = 'Defective product';
      const mockResponse = { 
        message: 'Return requested', 
        order: { 
          _id: '123',
          orderNumber: 'ORD-001', 
          clientId: 'client1',
          vendorId: 'vendor1',
          products: [],
          status: 'Creado' as const,
          deliveryAddress: 'Address',
          deliveryDate: new Date(),
          totalAmount: 100,
          returnRequested: true
        } 
      };
      apiService.post.and.returnValue(of(mockResponse));

      service.requestReturn('123', reason).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.post).toHaveBeenCalledWith('/api/v1/orders/123/return', { reason }, jasmine.any(String));
        done();
      });
    });
  });
});

