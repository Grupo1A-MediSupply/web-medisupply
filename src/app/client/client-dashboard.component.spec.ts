import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientDashboardComponent);
    component = fixture.componentInstance;
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
});