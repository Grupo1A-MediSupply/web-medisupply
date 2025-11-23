import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LogisticsService } from './logistics.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('LogisticsService', () => {
  let service: LogisticsService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LogisticsService,
        { provide: ApiService, useValue: apiService }
      ]
    });
    service = TestBed.inject(LogisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRoutes', () => {
    it('should get routes without params', (done) => {
      const mockRoutes = { 
        routes: [{ 
          _id: '1',
          routeNumber: 'RT-001', 
          vendorId: 'vendor1',
          vehicleId: 'vehicle1',
          vehicleType: 'Truck',
          driverName: 'Driver',
          stops: [],
          status: 'Programado' as const,
          estimatedDistance: 100,
          estimatedDuration: 60,
          estimatedFuel: 50,
          progress: 0
        }] 
      };
      apiService.get.and.returnValue(of(mockRoutes));

      service.getRoutes().subscribe(response => {
        expect(response).toEqual(mockRoutes);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/routes', jasmine.any(String));
        done();
      });
    });

    it('should get routes with status param', (done) => {
      const mockRoutes = { routes: [] };
      apiService.get.and.returnValue(of(mockRoutes));

      service.getRoutes({ status: 'En Tránsito' }).subscribe(() => {
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/routes?status=En Tránsito', jasmine.any(String));
        done();
      });
    });
  });

  describe('getRoute', () => {
    it('should get single route by id', (done) => {
      const mockRoute = { 
        route: { 
          _id: '123',
          routeNumber: 'RT-001', 
          vendorId: 'vendor1',
          vehicleId: 'vehicle1',
          vehicleType: 'Truck',
          driverName: 'Driver',
          stops: [],
          status: 'Programado' as const,
          estimatedDistance: 100,
          estimatedDuration: 60,
          estimatedFuel: 50,
          progress: 0
        } 
      };
      apiService.get.and.returnValue(of(mockRoute));

      service.getRoute('123').subscribe(response => {
        expect(response).toEqual(mockRoute);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/routes/123', jasmine.any(String));
        done();
      });
    });
  });

  describe('createRoute', () => {
    it('should create route', (done) => {
      const route = {
        vendorId: 'vendor1',
        vehicleId: 'vehicle1',
        vehicleType: 'Truck',
        driverName: 'Driver',
        stops: [],
        status: 'Programado' as const,
        estimatedDistance: 100,
        estimatedDuration: 60,
        estimatedFuel: 50,
        progress: 0
      };
      const mockResponse = { message: 'Created', route };
      apiService.post.and.returnValue(of(mockResponse));

      service.createRoute(route).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.post).toHaveBeenCalledWith('/api/v1/routes', route, jasmine.any(String));
        done();
      });
    });
  });

  describe('updateRoute', () => {
    it('should update route', (done) => {
      const updates = { status: 'Completado' as const };
      const mockResponse = { 
        message: 'Updated', 
        route: { 
          _id: '123',
          routeNumber: 'RT-001', 
          vendorId: 'vendor1',
          vehicleId: 'vehicle1',
          vehicleType: 'Truck',
          driverName: 'Driver',
          stops: [],
          status: 'Completado' as const,
          estimatedDistance: 100,
          estimatedDuration: 60,
          estimatedFuel: 50,
          progress: 100
        } 
      };
      apiService.put.and.returnValue(of(mockResponse));

      service.updateRoute('123', updates).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.put).toHaveBeenCalledWith('/api/v1/routes/123', updates, jasmine.any(String));
        done();
      });
    });
  });

  describe('deleteRoute', () => {
    it('should delete route', (done) => {
      const mockResponse = { message: 'Deleted' };
      apiService.delete.and.returnValue(of(mockResponse));

      service.deleteRoute('123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.delete).toHaveBeenCalledWith('/api/v1/routes/123', jasmine.any(String));
        done();
      });
    });
  });

  describe('generateOptimalRoutes', () => {
    it('should generate optimal routes', (done) => {
      const orderIds = ['order1', 'order2'];
      const mockResponse = {
        suggestedRoutes: [],
        orders: []
      };
      apiService.post.and.returnValue(of(mockResponse));

      service.generateOptimalRoutes(orderIds).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.post).toHaveBeenCalledWith(
          '/api/v1/routes/generate-optimal',
          { orderIds, vehicleType: undefined },
          jasmine.any(String)
        );
        done();
      });
    });

    it('should generate optimal routes with vehicle type', (done) => {
      const orderIds = ['order1'];
      const vehicleType = 'Truck';
      const mockResponse = {
        suggestedRoutes: [],
        orders: []
      };
      apiService.post.and.returnValue(of(mockResponse));

      service.generateOptimalRoutes(orderIds, vehicleType).subscribe(response => {
        expect(apiService.post).toHaveBeenCalledWith(
          '/api/v1/routes/generate-optimal',
          { orderIds, vehicleType },
          jasmine.any(String)
        );
        done();
      });
    });
  });
});

