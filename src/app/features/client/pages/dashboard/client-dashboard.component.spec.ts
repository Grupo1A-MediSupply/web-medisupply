import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ClientDashboardComponent } from './client-dashboard.component';

describe('ClientDashboardComponent', () => {
  let component: ClientDashboardComponent;
  let fixture: ComponentFixture<ClientDashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ClientDashboardComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDashboardComponent);
    component = fixture.componentInstance;
    
    // Initialize mock data for tests
    component.orders = [
      {
        id: 'PED-1001', 
        product: 'Insulina - Lote A1', 
        status: 'Pendiente', 
        date: '2025-09-22',
        institutionName: 'Hospital San Rafael',
        deliveryAddress: 'Calle 10 #20-30, Bogotá',
        deliveryDate: '2025-09-25',
        contact: 'Dr. María González',
        phone: '300-123-4567',
        products: [
          {name: 'Insulina', quantity: 10, price: 25.50}
        ],
        notes: 'Entrega urgente para sala de emergencias'
      },
      {
        id: 'PED-1000', 
        product: 'Equipo de monitoreo', 
        status: 'Enviado', 
        date: '2025-09-21',
        institutionName: 'Clínica Los Andes',
        deliveryAddress: 'Av 68 #45-12, Bogotá',
        deliveryDate: '2025-09-24',
        contact: 'Enf. Carlos López',
        phone: '300-987-6543',
        products: [
          {name: 'Equipo de monitoreo', quantity: 2, price: 150.00}
        ],
        notes: 'Instalación requerida'
      },
      {
        id: 'PED-0999', 
        product: 'Jeringas estériles', 
        status: 'Entregado', 
        date: '2025-09-20',
        institutionName: 'Centro Médico',
        deliveryAddress: 'Carrera 15 #80-25, Bogotá',
        deliveryDate: '2025-09-23',
        contact: 'Dr. Ana Martínez',
        phone: '300-555-1234',
        products: [
          {name: 'Jeringas estériles', quantity: 50, price: 0.50}
        ],
        notes: 'Para campaña de vacunación'
      },
      {
        id: 'PED-0998', 
        product: 'Guantes médicos', 
        status: 'Pendiente', 
        date: '2025-09-19',
        institutionName: 'Hospital Central',
        deliveryAddress: 'Calle 100 #15-20, Bogotá',
        deliveryDate: '2025-09-22',
        contact: 'Enf. Roberto Silva',
        phone: '300-777-8888',
        products: [
          {name: 'Guantes médicos', quantity: 100, price: 0.25}
        ],
        notes: 'Talla M y L'
      }
    ];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default active section', () => {
    expect(component.activeSection).toBe('create-order');
  });

  it('should set active section when setActiveSection is called', () => {
    component.setActiveSection('orders');
    expect(component.activeSection).toBe('orders');
  });

  it('should logout and navigate to home', () => {
    spyOn(sessionStorage, 'clear');
    component.logout();

    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should get total orders count', () => {
    expect(component.getTotalOrders()).toBe(4);
  });

  it('should get pending orders count', () => {
    expect(component.getPendingOrders()).toBe(3);
  });

  it('should get completed orders count', () => {
    expect(component.getCompletedOrders()).toBe(1);
  });

  it('should handle all possible active sections', () => {
    const sections = ['create-order', 'orders', 'profile', 'settings'];
    
    sections.forEach(section => {
      component.setActiveSection(section);
      expect(component.activeSection).toBe(section);
    });
  });

  it('should handle navigation to different sections', () => {
    // Test navigation to orders section
    component.setActiveSection('orders');
    expect(component.activeSection).toBe('orders');
    
    // Test navigation to profile section
    component.setActiveSection('profile');
    expect(component.activeSection).toBe('profile');
    
    // Test navigation to settings section
    component.setActiveSection('settings');
    expect(component.activeSection).toBe('settings');
    
    // Test navigation back to create-order
    component.setActiveSection('create-order');
    expect(component.activeSection).toBe('create-order');
  });

  it('should handle session storage operations', () => {
    spyOn(sessionStorage, 'clear');
    spyOn(sessionStorage, 'getItem');
    spyOn(sessionStorage, 'setItem');
    
    // Test logout clears session storage
    component.logout();
    expect(sessionStorage.clear).toHaveBeenCalled();
    
    // Test that component can handle session storage operations
    sessionStorage.setItem('test', 'value');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('test', 'value');
    
    // Mock getItem to return the value
    (sessionStorage.getItem as jasmine.Spy).and.returnValue('value');
    expect(sessionStorage.getItem('test')).toBe('value');
  });

  it('should handle order statistics correctly', () => {
    // Test total orders
    const totalOrders = component.getTotalOrders();
    expect(totalOrders).toBeGreaterThanOrEqual(0);
    expect(typeof totalOrders).toBe('number');
    
    // Test pending orders
    const pendingOrders = component.getPendingOrders();
    expect(pendingOrders).toBeGreaterThanOrEqual(0);
    expect(typeof pendingOrders).toBe('number');
    
    // Test completed orders
    const completedOrders = component.getCompletedOrders();
    expect(completedOrders).toBeGreaterThanOrEqual(0);
    expect(typeof completedOrders).toBe('number');
    
    // Verify that total = pending + completed
    expect(totalOrders).toBe(pendingOrders + completedOrders);
  });

  it('should handle component initialization', () => {
    expect(component).toBeDefined();
    expect(component.activeSection).toBeDefined();
    expect(typeof component.activeSection).toBe('string');
  });

  it('should handle edge cases for active section', () => {
    // Test with empty string
    component.setActiveSection('');
    expect(component.activeSection).toBe('');
    
    // Test with null/undefined (should handle gracefully)
    component.setActiveSection(null as any);
    expect(component.activeSection).toBe(null);
    
    // Test with very long string
    const longSection = 'a'.repeat(1000);
    component.setActiveSection(longSection);
    expect(component.activeSection).toBe(longSection);
  });

  it('should handle multiple logout calls', () => {
    spyOn(sessionStorage, 'clear');
    
    // Call logout multiple times
    component.logout();
    component.logout();
    component.logout();
    
    expect(sessionStorage.clear).toHaveBeenCalledTimes(3);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(3);
  });

  it('should handle navigation after logout', () => {
    spyOn(sessionStorage, 'clear');
    
    component.logout();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    expect(sessionStorage.clear).toHaveBeenCalled();
  });

  it('should maintain component state during operations', () => {
    const initialState = component.activeSection;
    
    // Perform various operations
    component.setActiveSection('orders');
    component.setActiveSection('profile');
    component.setActiveSection('settings');
    
    // Verify state changes are maintained
    expect(component.activeSection).toBe('settings');
    
    // Reset to initial state
    component.setActiveSection(initialState);
    expect(component.activeSection).toBe(initialState);
  });

  it('should handle component lifecycle events', () => {
    // Test component creation
    expect(component).toBeTruthy();
    
    // Test component initialization
    fixture.detectChanges();
    expect(component.activeSection).toBeDefined();
    
    // Test component state after changes
    component.setActiveSection('orders');
    fixture.detectChanges();
    expect(component.activeSection).toBe('orders');
  });

  it('should handle data consistency', () => {
    // Test that order counts are consistent
    const total = component.getTotalOrders();
    const pending = component.getPendingOrders();
    const completed = component.getCompletedOrders();
    
    expect(total).toBe(pending + completed);
    expect(total).toBeGreaterThanOrEqual(0);
    expect(pending).toBeGreaterThanOrEqual(0);
    expect(completed).toBeGreaterThanOrEqual(0);
  });

  it('should handle rapid section changes', () => {
    const sections = ['create-order', 'orders', 'profile', 'settings'];
    
    // Rapidly change sections
    sections.forEach(section => {
      component.setActiveSection(section);
      expect(component.activeSection).toBe(section);
    });
    
    // Verify final state
    expect(component.activeSection).toBe('settings');
  });

  it('should handle component methods without errors', () => {
    // Test all public methods exist and can be called
    expect(() => component.setActiveSection('test')).not.toThrow();
    expect(() => component.logout()).not.toThrow();
    expect(() => component.getTotalOrders()).not.toThrow();
    expect(() => component.getPendingOrders()).not.toThrow();
    expect(() => component.getCompletedOrders()).not.toThrow();
  });


  it('should handle order statistics calculations', () => {
    // Test with initial orders
    expect(component.getTotalOrders()).toBe(component.orders.length);
    expect(component.getPendingOrders()).toBe(3); // Based on mock data
    expect(component.getCompletedOrders()).toBe(1); // Based on mock data
  });

  it('should handle session storage operations', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('client');
    spyOn(sessionStorage, 'setItem');
    spyOn(sessionStorage, 'clear');

    // Test logout functionality
    component.logout();
    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle component initialization', () => {
    expect(component).toBeTruthy();
    expect(component.orders).toBeDefined();
    expect(component.orders.length).toBeGreaterThan(0);
  });

  it('should handle order status updates', () => {
    const initialPendingOrders = component.getPendingOrders();
    
    // Simulate order status change
    if (component.orders.length > 0) {
      component.orders[0].status = 'completed';
      expect(component.getPendingOrders()).toBe(initialPendingOrders - 1);
      expect(component.getCompletedOrders()).toBe(1);
    }
  });


  it('should handle error scenarios', () => {
    spyOn(window, 'alert');

    // Test with empty orders array
    component.orders = [];
    expect(component.getTotalOrders()).toBe(0);
    expect(component.getPendingOrders()).toBe(0);
    expect(component.getCompletedOrders()).toBe(0);
  });

  it('should handle order details', () => {
    const order = component.orders[0];
    component.viewOrderDetails(order);
    expect(component.showOrderDetails).toBeTruthy();
    expect(component.selectedOrder).toBe(order);
    
    component.closeOrderDetails();
    expect(component.showOrderDetails).toBeFalsy();
    expect(component.selectedOrder).toBeNull();
  });

  it('should handle return modal', () => {
    const order = component.orders[0];
    component.requestReturn(order);
    expect(component.showReturnModal).toBeTruthy();
    expect(component.selectedOrder).toBe(order);
    
    component.closeReturnModal();
    expect(component.showReturnModal).toBeFalsy();
    expect(component.selectedOrder).toBeNull();
  });

  it('should handle return form submission', () => {
    const order = component.orders[0];
    component.requestReturn(order);
    component.returnForm.reason = 'Producto defectuoso';
    component.returnForm.description = 'El producto llegó dañado';
    
    spyOn(window, 'alert');
    component.submitReturnRequest();
    
    expect(window.alert).toHaveBeenCalledWith(`Solicitud de devolución enviada para el pedido ${order.id}. Motivo: Producto defectuoso`);
    expect(component.showReturnModal).toBeFalsy();
  });

  it('should handle return form validation', () => {
    const order = component.orders[0];
    component.requestReturn(order);
    component.returnForm.reason = '';
    component.returnForm.description = '';
    
    spyOn(window, 'alert');
    component.submitReturnRequest();
    
    expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos requeridos');
  });

  it('should handle order status filtering', () => {
    const allOrders = component.getTotalOrders();
    const pendingOrders = component.getPendingOrders();
    const completedOrders = component.getCompletedOrders();
    
    expect(allOrders).toBe(component.orders.length);
    expect(pendingOrders).toBe(component.orders.filter(order => 
      order.status === 'Pendiente' || order.status === 'Enviado'
    ).length);
    expect(completedOrders).toBe(component.orders.filter(order => 
      order.status === 'Entregado'
    ).length);
  });

  it('should handle component initialization', () => {
    expect(component.activeSection).toBe('create-order');
    expect(component.orders).toBeDefined();
    expect(Array.isArray(component.orders)).toBeTruthy();
  });

  it('should handle section changes', () => {
    component.setActiveSection('orders');
    expect(component.activeSection).toBe('orders');
    
    component.setActiveSection('create-order');
    expect(component.activeSection).toBe('create-order');
  });

  it('should handle return form reset', () => {
    component.returnForm.reason = 'Test reason';
    component.returnForm.description = 'Test description';
    
    component.closeReturnModal();
    expect(component.returnForm.reason).toBe('');
    expect(component.returnForm.description).toBe('');
  });

  it('should handle progress percentage calculation', () => {
    expect(component.getProgressPercentage('Pendiente')).toBe(25);
    expect(component.getProgressPercentage('Enviado')).toBe(75);
    expect(component.getProgressPercentage('Entregado')).toBe(100);
    expect(component.getProgressPercentage('Unknown')).toBe(0);
  });

  it('should handle progress text calculation', () => {
    expect(component.getProgressText('Pendiente')).toBe('Procesando pedido');
    expect(component.getProgressText('Enviado')).toBe('En camino');
    expect(component.getProgressText('Entregado')).toBe('Entregado');
    expect(component.getProgressText('Unknown')).toBe('Estado desconocido');
  });

         it('should handle return request permissions', () => {
           const deliveredOrder = component.orders.find(o => o.status === 'Entregado');
           const pendingOrder = component.orders.find(o => o.status === 'Pendiente');
           
           if (deliveredOrder) {
             expect(component.canRequestReturn(deliveredOrder)).toBeTruthy();
           }
           
           if (pendingOrder) {
             expect(component.canRequestReturn(pendingOrder)).toBeFalsy();
           }
         });

         it('should handle different order statuses for return permissions', () => {
           // Test with different order statuses
           const testOrders = [
             { id: '1', status: 'Entregado', canReturn: true },
             { id: '2', status: 'Pendiente', canReturn: false },
             { id: '3', status: 'Enviado', canReturn: false },
             { id: '4', status: 'Cancelado', canReturn: false }
           ];

           testOrders.forEach(order => {
             expect(component.canRequestReturn(order)).toBe(order.canReturn);
           });
         });

         it('should handle return form validation with empty fields', () => {
           component.returnForm.reason = '';
           component.returnForm.description = '';
           
           spyOn(window, 'alert');
           component.submitReturnRequest();
           expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos requeridos');
         });

         it('should handle return form validation with partial fields', () => {
           component.returnForm.reason = 'Test reason';
           component.returnForm.description = '';
           
           spyOn(window, 'alert');
           component.submitReturnRequest();
           expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos requeridos');
         });

         it('should handle return form validation with only description', () => {
           component.returnForm.reason = '';
           component.returnForm.description = 'Test description';
           
           spyOn(window, 'alert');
           component.submitReturnRequest();
           expect(window.alert).toHaveBeenCalledWith('Por favor complete todos los campos requeridos');
         });

         it('should handle return form with valid data', () => {
           const order = component.orders[0];
           component.requestReturn(order);
           component.returnForm.reason = 'Producto defectuoso';
           component.returnForm.description = 'El producto llegó dañado';
           
           spyOn(window, 'alert');
           component.submitReturnRequest();
           expect(window.alert).toHaveBeenCalledWith(`Solicitud de devolución enviada para el pedido ${order.id}. Motivo: Producto defectuoso`);
         });

         it('should handle different return reasons', () => {
           const order = component.orders[0];
           const reasons = ['Producto defectuoso', 'Pedido incorrecto', 'Daño en transporte', 'Cliente no satisfecho'];
           
           spyOn(window, 'alert');
           
           reasons.forEach(reason => {
             component.requestReturn(order);
             component.returnForm.reason = reason;
             component.returnForm.description = 'Test description';
             
             component.submitReturnRequest();
             expect(window.alert).toHaveBeenCalledWith(`Solicitud de devolución enviada para el pedido ${order.id}. Motivo: ${reason}`);
             
             component.closeReturnModal();
           });
         });

         it('should handle progress percentage for different statuses', () => {
           const statusTests = [
             { status: 'Pendiente', expected: 25 },
             { status: 'Enviado', expected: 75 },
             { status: 'Entregado', expected: 100 },
             { status: 'Cancelado', expected: 0 },
             { status: 'Unknown', expected: 0 }
           ];

           statusTests.forEach(({ status, expected }) => {
             expect(component.getProgressPercentage(status)).toBe(expected);
           });
         });

         it('should handle progress text for different statuses', () => {
           const statusTests = [
             { status: 'Pendiente', expected: 'Procesando pedido' },
             { status: 'Enviado', expected: 'En camino' },
             { status: 'Entregado', expected: 'Entregado' },
             { status: 'Cancelado', expected: 'Estado desconocido' },
             { status: 'Unknown', expected: 'Estado desconocido' }
           ];

           statusTests.forEach(({ status, expected }) => {
             expect(component.getProgressText(status)).toBe(expected);
           });
         });

         it('should handle order filtering by different criteria', () => {
           // Test total orders
           expect(component.getTotalOrders()).toBe(component.orders.length);
           
           // Test pending orders
           const pendingCount = component.orders.filter(order => 
             order.status === 'Pendiente' || order.status === 'Enviado'
           ).length;
           expect(component.getPendingOrders()).toBe(pendingCount);
           
           // Test completed orders
           const completedCount = component.orders.filter(order => 
             order.status === 'Entregado'
           ).length;
           expect(component.getCompletedOrders()).toBe(completedCount);
         });

         it('should handle edge cases in order statistics', () => {
           // Test with empty orders array
           const originalOrders = component.orders;
           component.orders = [];
           
           expect(component.getTotalOrders()).toBe(0);
           expect(component.getPendingOrders()).toBe(0);
           expect(component.getCompletedOrders()).toBe(0);
           
           // Restore original orders
           component.orders = originalOrders;
         });

         it('should handle return modal state changes', () => {
           const order = component.orders[0];
           
           // Open return modal
           component.requestReturn(order);
           expect(component.showReturnModal).toBeTruthy();
           expect(component.selectedOrder).toBe(order);
           
           // Close return modal
           component.closeReturnModal();
           expect(component.showReturnModal).toBeFalsy();
           expect(component.selectedOrder).toBeNull();
         });

         it('should handle order details state changes', () => {
           const order = component.orders[0];
           
           // Open order details
           component.viewOrderDetails(order);
           expect(component.showOrderDetails).toBeTruthy();
           expect(component.selectedOrder).toBe(order);
           
           // Close order details
           component.closeOrderDetails();
           expect(component.showOrderDetails).toBeFalsy();
           expect(component.selectedOrder).toBeNull();
         });

         it('should handle section navigation', () => {
           const sections = ['create-order', 'orders', 'profile', 'settings'];
           
           sections.forEach(section => {
             component.setActiveSection(section);
             expect(component.activeSection).toBe(section);
           });
         });

         it('should handle return form reset on modal close', () => {
           component.returnForm.reason = 'Test reason';
           component.returnForm.description = 'Test description';
           
           component.closeReturnModal();
           
           expect(component.returnForm.reason).toBe('');
           expect(component.returnForm.description).toBe('');
         });
       });