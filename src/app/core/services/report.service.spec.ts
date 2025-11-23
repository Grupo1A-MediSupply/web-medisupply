import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('ReportService', () => {
  let service: ReportService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReportService,
        { provide: ApiService, useValue: apiService }
      ]
    });
    service = TestBed.inject(ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReports', () => {
    it('should get reports', (done) => {
      const mockReports = {
        ordersByStatus: {
          Creado: 10,
          Programado: 5,
          'En Tránsito': 3,
          Completado: 20,
          Pendiente: 2
        },
        returnsByReason: {
          'Producto Defectuoso': 1,
          'Pedido Incorrecto': 2,
          'Daño en Transporte': 0,
          'Cliente No Satisfecho': 1
        },
        totalReturns: 4
      };
      apiService.get.and.returnValue(of(mockReports));

      service.getReports().subscribe(response => {
        expect(response).toEqual(mockReports);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/reports', jasmine.any(String));
        done();
      });
    });

    it('should handle reports with inventory status', (done) => {
      const mockReports = {
        ordersByStatus: {
          Creado: 10,
          Programado: 5,
          'En Tránsito': 3,
          Completado: 20,
          Pendiente: 2
        },
        inventoryStatus: {
          normalStock: 100,
          lowStock: 10,
          expiringSoon: 5,
          expired: 2
        },
        returnsByReason: {
          'Producto Defectuoso': 1,
          'Pedido Incorrecto': 2,
          'Daño en Transporte': 0,
          'Cliente No Satisfecho': 1
        },
        totalReturns: 4
      };
      apiService.get.and.returnValue(of(mockReports));

      service.getReports().subscribe(response => {
        expect(response.inventoryStatus).toBeDefined();
        expect(response.inventoryStatus?.normalStock).toBe(100);
        done();
      });
    });

    it('should handle reports with routes stats', (done) => {
      const mockReports = {
        ordersByStatus: {
          Creado: 10,
          Programado: 5,
          'En Tránsito': 3,
          Completado: 20,
          Pendiente: 2
        },
        routesStats: {
          total: 50,
          active: 10,
          completed: 35,
          pending: 5
        },
        returnsByReason: {
          'Producto Defectuoso': 1,
          'Pedido Incorrecto': 2,
          'Daño en Transporte': 0,
          'Cliente No Satisfecho': 1
        },
        totalReturns: 4
      };
      apiService.get.and.returnValue(of(mockReports));

      service.getReports().subscribe(response => {
        expect(response.routesStats).toBeDefined();
        expect(response.routesStats?.total).toBe(50);
        done();
      });
    });
  });
});

