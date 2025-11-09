import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RoutesComponent } from './routes.component';

describe('RoutesComponent', () => {
  let component: RoutesComponent;
  let fixture: ComponentFixture<RoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoutesComponent],
      imports: [
        MatTableModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTotalRoutes', () => {
    it('should return the total number of routes', () => {
      const totalRoutes = component.getTotalRoutes();
      expect(totalRoutes).toBe(3);
    });

    it('should return 0 when routes array is empty', () => {
      component.routes = [];
      const totalRoutes = component.getTotalRoutes();
      expect(totalRoutes).toBe(0);
    });
  });

  describe('getPendingRoutes', () => {
    it('should return the number of orders without route', () => {
      const pendingRoutes = component.getPendingRoutes();
      expect(pendingRoutes).toBe(2); // ORD-1001 and ORD-1002 have status 'Sin Ruta'
    });

    it('should return 0 when all orders have routes', () => {
      component.orders = component.orders.map(order => ({
        ...order,
        status: 'En Tránsito',
        routeId: 'R-TEST'
      }));
      const pendingRoutes = component.getPendingRoutes();
      expect(pendingRoutes).toBe(0);
    });
  });

  describe('getActiveRoutes', () => {
    it('should return the number of active routes', () => {
      const activeRoutes = component.getActiveRoutes();
      expect(activeRoutes).toBe(1); // Only R-501 has status 'En Tránsito'
    });

    it('should return 0 when no routes are active', () => {
      component.routes = component.routes.map(route => ({
        ...route,
        status: 'Completado'
      }));
      const activeRoutes = component.getActiveRoutes();
      expect(activeRoutes).toBe(0);
    });
  });

  describe('getReturnRequests', () => {
    it('should return the number of orders with return requests', () => {
      const returnRequests = component.getReturnRequests();
      expect(returnRequests).toBe(1); // Only ORD-1004 has returnRequested: true
    });

    it('should return 0 when no orders have return requests', () => {
      component.orders = component.orders.map(order => ({
        ...order,
        returnRequested: false
      }));
      const returnRequests = component.getReturnRequests();
      expect(returnRequests).toBe(0);
    });
  });

  describe('getOrdersWithoutRoute', () => {
    it('should return orders with status "Sin Ruta"', () => {
      const ordersWithoutRoute = component.getOrdersWithoutRoute();
      expect(ordersWithoutRoute.length).toBe(2);
      expect(ordersWithoutRoute.every(order => order.status === 'Sin Ruta')).toBe(true);
    });

    it('should return empty array when all orders have routes', () => {
      component.orders = component.orders.map(order => ({
        ...order,
        status: 'En Tránsito'
      }));
      const ordersWithoutRoute = component.getOrdersWithoutRoute();
      expect(ordersWithoutRoute.length).toBe(0);
    });
  });

  describe('getActiveRoutesList', () => {
    it('should return routes with status "En Tránsito"', () => {
      const activeRoutes = component.getActiveRoutesList();
      expect(activeRoutes.length).toBe(1);
      expect(activeRoutes.every(route => route.status === 'En Tránsito')).toBe(true);
    });

    it('should return empty array when no routes are active', () => {
      component.routes = component.routes.map(route => ({
        ...route,
        status: 'Completado'
      }));
      const activeRoutes = component.getActiveRoutesList();
      expect(activeRoutes.length).toBe(0);
    });
  });

  describe('getDeliveredWithReturns', () => {
    it('should return orders with returnRequested true', () => {
      const deliveredWithReturns = component.getDeliveredWithReturns();
      expect(deliveredWithReturns.length).toBe(1);
      expect(deliveredWithReturns.every(order => order.returnRequested === true)).toBe(true);
    });

    it('should return empty array when no orders have return requests', () => {
      component.orders = component.orders.map(order => ({
        ...order,
        returnRequested: false
      }));
      const deliveredWithReturns = component.getDeliveredWithReturns();
      expect(deliveredWithReturns.length).toBe(0);
    });
  });

  describe('generateOptimalRoutes', () => {
    it('should set selected order and show route generation modal', () => {
      const testOrder = { id: 'TEST', client: 'Test Client', address: 'Test Address', date: '2025-01-01', status: 'Sin Ruta', routeId: null };
      
      component.generateOptimalRoutes(testOrder);
      
      expect(component.selectedOrder).toBe(testOrder);
      expect(component.showRouteGeneration).toBe(true);
      expect(component.selectedRoute).toBeNull();
      expect(component.selectedVehicle).toBeNull();
    });
  });

  describe('closeRouteGeneration', () => {
    it('should hide route generation modal and reset selections', () => {
      component.showRouteGeneration = true;
      component.selectedOrder = { id: 'TEST' };
      component.selectedRoute = { id: 'R-TEST' };
      component.selectedVehicle = { id: 'V-TEST' };
      
      component.closeRouteGeneration();
      
      expect(component.showRouteGeneration).toBe(false);
      expect(component.selectedOrder).toBeNull();
      expect(component.selectedRoute).toBeNull();
      expect(component.selectedVehicle).toBeNull();
    });
  });

  describe('selectRoute', () => {
    it('should set the selected route', () => {
      const testRoute = { id: 'R-TEST', distance: '10km' };
      
      component.selectRoute(testRoute);
      
      expect(component.selectedRoute).toBe(testRoute);
    });
  });

  describe('assignRoute', () => {
    beforeEach(() => {
      // Mock alert to avoid actual alert calls in tests
      spyOn(window, 'alert');
    });

    it('should assign route when all required selections are made', () => {
      const testOrder = { id: 'ORD-1001', client: 'Hospital San Rafael', address: 'Calle 10 #20-30', date: '2025-09-22', status: 'Sin Ruta', routeId: null };
      const testRoute = { id: 'R-TEST', distance: '10km' };
      const testVehicle = { id: 'V-TEST', type: 'Test Vehicle' };
      
      component.selectedOrder = testOrder;
      component.selectedRoute = testRoute;
      component.selectedVehicle = testVehicle;
      
      const initialRoutesLength = component.routes.length;
      
      component.assignRoute();
      
      expect(component.orders.find(o => o.id === testOrder.id)?.status).toBe('En Tránsito');
      expect(component.orders.find(o => o.id === testOrder.id)?.routeId).toBe(testRoute.id);
      expect(component.routes.length).toBe(initialRoutesLength + 1);
      expect(window.alert).toHaveBeenCalledWith('Ruta asignada exitosamente');
    });

    it('should not assign route when selectedOrder is null', () => {
      component.selectedOrder = null;
      component.selectedRoute = { id: 'R-TEST' };
      component.selectedVehicle = { id: 'V-TEST' };
      
      const initialRoutesLength = component.routes.length;
      
      component.assignRoute();
      
      expect(component.routes.length).toBe(initialRoutesLength);
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('should not assign route when selectedRoute is null', () => {
      component.selectedOrder = { id: 'ORD-TEST' };
      component.selectedRoute = null;
      component.selectedVehicle = { id: 'V-TEST' };
      
      const initialRoutesLength = component.routes.length;
      
      component.assignRoute();
      
      expect(component.routes.length).toBe(initialRoutesLength);
      expect(window.alert).not.toHaveBeenCalled();
    });

    it('should not assign route when selectedVehicle is null', () => {
      component.selectedOrder = { id: 'ORD-TEST' };
      component.selectedRoute = { id: 'R-TEST' };
      component.selectedVehicle = null;
      
      const initialRoutesLength = component.routes.length;
      
      component.assignRoute();
      
      expect(component.routes.length).toBe(initialRoutesLength);
      expect(window.alert).not.toHaveBeenCalled();
    });
  });

  describe('markAsDelivered', () => {
    beforeEach(() => {
      spyOn(window, 'alert');
    });

    it('should mark route as completed and update order status', () => {
      const testRoute = { id: 'R-501', vehicle: 'Camión-001', driver: 'Juan Pérez', status: 'En Tránsito', progress: 65 };
      const testOrder = { id: 'ORD-1003', client: 'Test Client', address: 'Test Address', date: '2025-01-01', status: 'En Tránsito', routeId: 'R-501' };
      
      component.orders = [testOrder];
      
      component.markAsDelivered(testRoute);
      
      expect(testRoute.status).toBe('Completado');
      expect(testRoute.progress).toBe(100);
      expect(component.orders.find(o => o.routeId === testRoute.id)?.status).toBe('Entregado');
      expect(window.alert).toHaveBeenCalledWith('Entrega marcada como completada');
    });
  });

  describe('processReturn', () => {
    beforeEach(() => {
      spyOn(window, 'alert');
    });

    it('should process return and update order status', () => {
      const testOrder = { 
        id: 'ORD-1004', 
        client: 'Test Client', 
        address: 'Test Address', 
        date: '2025-01-01', 
        status: 'Entregado', 
        routeId: 'R-502', 
        returnRequested: true, 
        returnReason: 'Producto defectuoso', 
        returnStatus: 'Pendiente' 
      };
      
      component.processReturn(testOrder);
      
      expect(testOrder.returnStatus).toBe('Procesada');
      expect(window.alert).toHaveBeenCalledWith('Devolución procesada');
    });
  });

  describe('data structure validation', () => {
    it('should have valid orders structure', () => {
      component.orders.forEach(order => {
        expect(order.id).toBeDefined();
        expect(order.client).toBeDefined();
        expect(order.address).toBeDefined();
        expect(order.date).toBeDefined();
        expect(order.status).toBeDefined();
        expect(typeof order.id).toBe('string');
        expect(typeof order.client).toBe('string');
        expect(typeof order.address).toBe('string');
        expect(typeof order.date).toBe('string');
        expect(typeof order.status).toBe('string');
      });
    });

    it('should have valid routes structure', () => {
      component.routes.forEach(route => {
        expect(route.id).toBeDefined();
        expect(route.vehicle).toBeDefined();
        expect(route.driver).toBeDefined();
        expect(route.status).toBeDefined();
        expect(route.progress).toBeDefined();
        expect(typeof route.id).toBe('string');
        expect(typeof route.vehicle).toBe('string');
        expect(typeof route.driver).toBe('string');
        expect(typeof route.status).toBe('string');
        expect(typeof route.progress).toBe('number');
        expect(route.progress).toBeGreaterThanOrEqual(0);
        expect(route.progress).toBeLessThanOrEqual(100);
      });
    });

    it('should have valid suggested routes structure', () => {
      component.suggestedRoutes.forEach(route => {
        expect(route.id).toBeDefined();
        expect(route.distance).toBeDefined();
        expect(route.duration).toBeDefined();
        expect(route.fuel).toBeDefined();
        expect(route.stops).toBeDefined();
        expect(route.route).toBeDefined();
        expect(typeof route.id).toBe('string');
        expect(typeof route.distance).toBe('string');
        expect(typeof route.duration).toBe('string');
        expect(typeof route.fuel).toBe('string');
        expect(typeof route.stops).toBe('number');
        expect(Array.isArray(route.route)).toBe(true);
      });
    });

    it('should have valid available vehicles structure', () => {
      component.availableVehicles.forEach(vehicle => {
        expect(vehicle.id).toBeDefined();
        expect(vehicle.type).toBeDefined();
        expect(vehicle.capacity).toBeDefined();
        expect(vehicle.status).toBeDefined();
        expect(typeof vehicle.id).toBe('string');
        expect(typeof vehicle.type).toBe('string');
        expect(typeof vehicle.capacity).toBe('string');
        expect(typeof vehicle.status).toBe('string');
      });
    });
  });

  describe('template rendering', () => {
    it('should display correct statistics', () => {
      const statNumbers = fixture.debugElement.nativeElement.querySelectorAll('.stat-number');
      expect(statNumbers[0].textContent.trim()).toBe('3'); // Total routes
      expect(statNumbers[1].textContent.trim()).toBe('2'); // Pending routes
      expect(statNumbers[2].textContent.trim()).toBe('1'); // Active routes
      expect(statNumbers[3].textContent.trim()).toBe('1'); // Return requests
    });

    it('should show orders without route section when there are pending orders', () => {
      const ordersWithoutRouteSection = fixture.debugElement.nativeElement.querySelector('.section-card');
      expect(ordersWithoutRouteSection).toBeTruthy();
    });

    it('should show delivered with returns section when there are return requests', () => {
      const deliveredWithReturnsSection = fixture.debugElement.nativeElement.querySelectorAll('.section-card')[1];
      expect(deliveredWithReturnsSection).toBeTruthy();
    });
  });
});
