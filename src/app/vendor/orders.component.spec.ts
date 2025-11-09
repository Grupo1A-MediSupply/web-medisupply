import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrdersComponent } from './orders.component';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersComponent],
      imports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTableModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default orders', () => {
      expect(component.orders).toBeDefined();
      expect(component.orders.length).toBeGreaterThan(0);
    });

    it('should have orders with required properties', () => {
      component.orders.forEach(order => {
        expect(order.id).toBeDefined();
        expect(order.product).toBeDefined();
        expect(order.status).toBeDefined();
      });
    });
  });

  describe('Order Creation', () => {
    it('should create a new order when createOrder is called', () => {
      const initialLength = component.orders.length;
      spyOn(window, 'alert');
      
      component.createOrder();
      
      expect(component.orders.length).toBe(initialLength + 1);
      expect(window.alert).toHaveBeenCalledWith('Pedido creado (mock). Inventario actualizado (simulado).');
    });

    it('should add new order at the beginning of the array', () => {
      const initialFirstOrder = component.orders[0];
      
      component.createOrder();
      
      expect(component.orders[0]).not.toBe(initialFirstOrder);
      expect(component.orders[0].id).toContain('ORD-');
      expect(component.orders[0].product).toContain('Producto ejemplo');
      expect(component.orders[0].status).toBe('Creado');
    });

    it('should generate unique order IDs', () => {
      const initialLength = component.orders.length;
      
      component.createOrder();
      component.createOrder();
      
      const newOrders = component.orders.slice(0, 2);
      const ids = newOrders.map(order => order.id);
      const uniqueIds = [...new Set(ids)];
      
      expect(uniqueIds.length).toBe(ids.length);
    });

    it('should include timestamp in product name', () => {
      const beforeTime = new Date().toLocaleTimeString();
      
      component.createOrder();
      
      const newOrder = component.orders[0];
      expect(newOrder.product).toContain('Producto ejemplo');
      expect(newOrder.product).toContain('-');
    });
  });

  describe('Order Statistics', () => {
    it('should count pending orders correctly', () => {
      const pendingCount = component.getPendingOrders();
      const expectedCount = component.orders.filter(order => 
        order.status === 'Pendiente' || order.status === 'Creado'
      ).length;
      
      expect(pendingCount).toBe(expectedCount);
    });

    it('should count completed orders correctly', () => {
      const completedCount = component.getCompletedOrders();
      const expectedCount = component.orders.filter(order => 
        order.status === 'Completado'
      ).length;
      
      expect(completedCount).toBe(expectedCount);
    });

    it('should return 0 for pending orders when no pending orders exist', () => {
      component.orders = [
        {id: 'ORD-1', product: 'Product 1', status: 'Completado'},
        {id: 'ORD-2', product: 'Product 2', status: 'Programado'}
      ];
      
      const pendingCount = component.getPendingOrders();
      expect(pendingCount).toBe(0);
    });

    it('should return 0 for completed orders when no completed orders exist', () => {
      component.orders = [
        {id: 'ORD-1', product: 'Product 1', status: 'Pendiente'},
        {id: 'ORD-2', product: 'Product 2', status: 'Creado'}
      ];
      
      const completedCount = component.getCompletedOrders();
      expect(completedCount).toBe(0);
    });

    it('should handle empty orders array', () => {
      component.orders = [];
      
      expect(component.getPendingOrders()).toBe(0);
      expect(component.getCompletedOrders()).toBe(0);
    });
  });

  describe('Status Icon Mapping', () => {
    it('should return correct icon for "Creado" status', () => {
      const icon = component.getStatusIcon('Creado');
      expect(icon).toBe('add_circle');
    });

    it('should return correct icon for "Pendiente" status', () => {
      const icon = component.getStatusIcon('Pendiente');
      expect(icon).toBe('pending');
    });

    it('should return correct icon for "Programado" status', () => {
      const icon = component.getStatusIcon('Programado');
      expect(icon).toBe('schedule');
    });

    it('should return correct icon for "Completado" status', () => {
      const icon = component.getStatusIcon('Completado');
      expect(icon).toBe('check_circle');
    });

    it('should handle case insensitive status', () => {
      expect(component.getStatusIcon('creado')).toBe('add_circle');
      expect(component.getStatusIcon('PENDIENTE')).toBe('pending');
      expect(component.getStatusIcon('programado')).toBe('schedule');
      expect(component.getStatusIcon('COMPLETADO')).toBe('check_circle');
    });

    it('should return default icon for unknown status', () => {
      const icon = component.getStatusIcon('UnknownStatus');
      expect(icon).toBe('help');
    });

    it('should return default icon for empty status', () => {
      const icon = component.getStatusIcon('');
      expect(icon).toBe('help');
    });

    it('should return default icon for null status', () => {
      const icon = component.getStatusIcon(null as any);
      expect(icon).toBe('help');
    });
  });

  describe('Order Data Structure', () => {
    it('should have orders with valid structure', () => {
      component.orders.forEach(order => {
        expect(typeof order.id).toBe('string');
        expect(typeof order.product).toBe('string');
        expect(typeof order.status).toBe('string');
        expect(order.id.length).toBeGreaterThan(0);
        expect(order.product.length).toBeGreaterThan(0);
        expect(order.status.length).toBeGreaterThan(0);
      });
    });

    it('should have orders with expected ID format', () => {
      component.orders.forEach(order => {
        expect(order.id).toMatch(/^ORD-\d+$/);
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['Creado', 'Pendiente', 'Programado', 'Completado'];
      component.orders.forEach(order => {
        expect(validStatuses).toContain(order.status);
      });
    });
  });

  describe('Multiple Order Creation', () => {
    it('should handle multiple order creation', () => {
      const initialLength = component.orders.length;
      const numberOfOrders = 5;
      
      for (let i = 0; i < numberOfOrders; i++) {
        component.createOrder();
      }
      
      expect(component.orders.length).toBe(initialLength + numberOfOrders);
    });

    it('should maintain order of creation (newest first)', () => {
      const firstOrder = component.orders[0];
      
      component.createOrder();
      const secondOrder = component.orders[0];
      
      component.createOrder();
      const thirdOrder = component.orders[0];
      
      expect(component.orders[0]).toBe(thirdOrder);
      expect(component.orders[1]).toBe(secondOrder);
      expect(component.orders[2]).toBe(firstOrder);
    });
  });

  describe('Edge Cases', () => {
    it('should handle createOrder with empty orders array', () => {
      component.orders = [];
      spyOn(window, 'alert');
      
      component.createOrder();
      
      expect(component.orders.length).toBe(1);
      expect(component.orders[0].id).toBe('ORD-1001');
      expect(window.alert).toHaveBeenCalled();
    });

    it('should handle createOrder with very large orders array', () => {
      // Create a large array of orders
      component.orders = Array.from({length: 1000}, (_, i) => ({
        id: `ORD-${i}`,
        product: `Product ${i}`,
        status: 'Creado'
      }));
      
      const initialLength = component.orders.length;
      
      component.createOrder();
      
      expect(component.orders.length).toBe(initialLength + 1);
      expect(component.orders[0].id).toContain('ORD-');
    });

    it('should handle statistics with mixed status orders', () => {
      component.orders = [
        {id: 'ORD-1', product: 'Product 1', status: 'Creado'},
        {id: 'ORD-2', product: 'Product 2', status: 'Pendiente'},
        {id: 'ORD-3', product: 'Product 3', status: 'Programado'},
        {id: 'ORD-4', product: 'Product 4', status: 'Completado'},
        {id: 'ORD-5', product: 'Product 5', status: 'Creado'}
      ];
      
      expect(component.getPendingOrders()).toBe(3); // Creado, Pendiente, Creado
      expect(component.getCompletedOrders()).toBe(1); // Completado
    });
  });

  describe('Template Integration', () => {
    it('should display orders in template', () => {
      const compiled = fixture.nativeElement;
      const orderElements = compiled.querySelectorAll('.order-row');
      
      expect(orderElements.length).toBe(component.orders.length);
    });

    it('should display order statistics in template', () => {
      const compiled = fixture.nativeElement;
      const statNumbers = compiled.querySelectorAll('.stat-number');
      
      expect(statNumbers.length).toBe(3); // Total, Pending, Completed
    });

    it('should have create order button', () => {
      const compiled = fixture.nativeElement;
      const createButton = compiled.querySelector('.action-button');
      
      expect(createButton).toBeTruthy();
      expect(createButton.textContent).toContain('Crear Pedido de Ejemplo');
    });
  });
});
