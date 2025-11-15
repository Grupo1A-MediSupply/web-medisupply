import { Component } from '@angular/core';

@Component({
  templateUrl: './orders.component.html'
})
export class OrdersComponent {
  orders: any[] = [];

  createOrder(){
    const newOrder = {
      id: 'ORD-' + (1000 + this.orders.length + 1), 
      product: 'Producto ejemplo - ' + new Date().toLocaleTimeString(), 
      status: 'Creado'
    };
    this.orders.unshift(newOrder);
    alert('Pedido creado (mock). Inventario actualizado (simulado).');
  }

  getPendingOrders(): number {
    return this.orders.filter(order => order.status === 'Pendiente' || order.status === 'Creado').length;
  }

  getCompletedOrders(): number {
    return this.orders.filter(order => order.status === 'Completado').length;
  }

  getStatusIcon(status: string): string {
    if (!status) {
      return 'help';
    }
    
    switch(status.toLowerCase()) {
      case 'creado': return 'add_circle';
      case 'pendiente': return 'pending';
      case 'programado': return 'schedule';
      case 'completado': return 'check_circle';
      default: return 'help';
    }
  }
}
