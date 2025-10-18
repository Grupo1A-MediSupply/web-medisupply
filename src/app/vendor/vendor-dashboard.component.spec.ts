import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { VendorDashboardComponent } from './vendor-dashboard.component';

describe('VendorDashboardComponent', () => {
  let component: VendorDashboardComponent;
  let fixture: ComponentFixture<VendorDashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [VendorDashboardComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default active section', () => {
    expect(component.activeSection).toBe('orders');
  });

  it('should set active section when setActiveSection is called', () => {
    component.setActiveSection('inventory');
    expect(component.activeSection).toBe('inventory');
  });

  it('should logout and navigate to home', () => {
    spyOn(sessionStorage, 'clear');
    component.logout();

    expect(sessionStorage.clear).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should create order when createOrder is called', () => {
    spyOn(window, 'alert');
    const initialOrdersLength = component.orders.length;
    
    component.createOrder();
    
    expect(component.orders.length).toBe(initialOrdersLength + 1);
    expect(window.alert).toHaveBeenCalledWith('Pedido creado (mock). Inventario actualizado (simulado).');
  });
});