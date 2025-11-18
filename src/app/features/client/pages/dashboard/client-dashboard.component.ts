import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'client-dashboard',
  templateUrl: './client-dashboard.component.html'
})
export class ClientDashboardComponent implements OnInit {
  activeSection = 'create-order';
  
  orders: any[] = [];
  isLoadingOrders = false;
  ordersError = '';

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
    private orderService: OrderService,
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    this.loadOrders();
  }
  
  loadOrders() {
    this.isLoadingOrders = true;
    this.ordersError = '';
    
    const user = this.authService.getUser();
    if (!user || !user.id) {
      this.ordersError = 'Usuario no autenticado';
      this.isLoadingOrders = false;
      return;
    }
    
    // Cargar pedidos del cliente
    this.orderService.getOrders().subscribe({
      next: (response) => {
        // Filtrar pedidos del cliente actual
        this.orders = response.orders
          .filter(order => order.clientId === user.id)
          .map(order => ({
            id: order.orderNumber || order._id,
            product: order.products?.map((p: any) => `${p.productName} (${p.quantity})`).join(', ') || 'Sin productos',
            status: order.status,
            products: order.products,
            deliveryAddress: order.deliveryAddress,
            deliveryDate: order.deliveryDate,
            contactName: order.contactName,
            contactPhone: order.contactPhone,
            notes: order.notes,
            routeId: order.routeId,
            returnRequested: order.returnRequested,
            returnReason: order.returnReason,
            returnStatus: order.returnStatus,
            totalAmount: order.totalAmount
          }));
        this.isLoadingOrders = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.ordersError = 'Error al cargar pedidos';
        this.isLoadingOrders = false;
      }
    });
  }

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
      if (!this.selectedOrder || !this.selectedOrder.id) {
        alert('Error: Pedido inválido');
        return;
      }
      
      const orderId = this.selectedOrder._id || this.selectedOrder.id;
      const reason = `${this.returnForm.reason}: ${this.returnForm.description}`;
      
      this.orderService.requestReturn(orderId, reason).subscribe({
        next: (response) => {
          alert(`Solicitud de devolución enviada para el pedido ${this.selectedOrder.id}`);
          this.closeReturnModal();
          this.loadOrders(); // Recargar pedidos
        },
        error: (error) => {
          console.error('Error requesting return:', error);
          alert('Error al enviar solicitud de devolución: ' + (error.message || 'Error desconocido'));
        }
      });
    } else {
      alert('Por favor complete todos los campos requeridos');
    }
  }
}
