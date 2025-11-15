import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'client-dashboard',
  templateUrl: './client-dashboard.component.html'
})
export class ClientDashboardComponent {
  activeSection = 'create-order';
  
  orders: any[] = [];

  // Modal properties
  showOrderDetails = false;
  showReturnModal = false;
  selectedOrder: any = null;
  returnForm = {
    reason: '',
    description: ''
  };

  constructor(private router: Router){}

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
    sessionStorage.clear(); 
    this.router.navigate(['/']); 
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
