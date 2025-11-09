import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'client-dashboard',
  templateUrl: './client-dashboard.component.html'
})
export class ClientDashboardComponent {
  activeSection = 'create-order';
  
  orders = [
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

  // Modal properties
  showOrderDetails = false;
  showReturnModal = false;
  selectedOrder: any = null;
  returnForm = {
    reason: '',
    description: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  setActiveSection(section: string) {
    this.activeSection = section;
    
    // Navigate to the corresponding route
    switch(section) {
      case 'create-order':
        this.router.navigate(['/client/create-order'], { replaceUrl: true });
        break;
      case 'history':
        this.router.navigate(['/client/history'], { replaceUrl: true });
        break;
      case 'track':
        this.router.navigate(['/client/track'], { replaceUrl: true });
        break;
      default:
        this.router.navigate(['/client'], { replaceUrl: true });
        break;
    }
  }

  logout(){ 
    // Llamar al endpoint de logout del backend
    this.authService.logout().subscribe({
      next: () => {
        // Limpiar sessionStorage y navegar a la página principal
        sessionStorage.clear();
        localStorage.removeItem('current_user');
        this.router.navigate(['/']);
      },
      error: (error) => {
        // Aunque falle el logout en el backend, limpiar todo localmente
        console.error('Error al cerrar sesión:', error);
        sessionStorage.clear();
        localStorage.removeItem('current_user');
        this.router.navigate(['/']);
      }
    });
  }

  getTotalOrders(): number {
    return this.orders.length;
  }

  getPendingOrders(): number {
    return this.orders.filter(order => order.status === 'Pendiente' || order.status === 'Enviado').length;
  }

  getCompletedOrders(): number {
    return this.orders.filter(order => order.status === 'Entregado').length;
  }

  getProgressPercentage(status: string): number {
    switch(status.toLowerCase()) {
      case 'pendiente': return 25;
      case 'enviado': return 75;
      case 'entregado': return 100;
      default: return 0;
    }
  }

  getProgressText(status: string): string {
    switch(status.toLowerCase()) {
      case 'pendiente': return 'Procesando pedido';
      case 'enviado': return 'En camino';
      case 'entregado': return 'Entregado';
      default: return 'Estado desconocido';
    }
  }

  // Order details modal methods
  viewOrderDetails(order: any) {
    this.selectedOrder = order;
    this.showOrderDetails = true;
    document.body.classList.add('modal-open');
  }

  closeOrderDetails() {
    this.showOrderDetails = false;
    this.selectedOrder = null;
    document.body.classList.remove('modal-open');
  }

  // Return modal methods
  canRequestReturn(order: any): boolean {
    return order.status === 'Entregado';
  }

  requestReturn(order: any) {
    this.selectedOrder = order;
    this.showReturnModal = true;
    this.returnForm = { reason: '', description: '' };
    document.body.classList.add('modal-open');
  }

  closeReturnModal() {
    this.showReturnModal = false;
    this.selectedOrder = null;
    this.returnForm = { reason: '', description: '' };
    document.body.classList.remove('modal-open');
  }

  submitReturnRequest() {
    if (this.returnForm.reason && this.returnForm.description) {
      // Simulate return request submission
      alert(`Solicitud de devolución enviada para el pedido ${this.selectedOrder.id}. Motivo: ${this.returnForm.reason}`);
      this.closeReturnModal();
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  }
}
