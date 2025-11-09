import { Component } from '@angular/core';

@Component({
  templateUrl: './orders.component.html'
})
export class OrdersComponent {
  orders = [
    {id: 'ORD-1001', product: 'Insulina - Lote A1', status: 'Creado'},
    {id: 'ORD-1000', product: 'Equipo de monitoreo', status: 'Programado'},
    {id: 'ORD-0999', product: 'Jeringas estériles', status: 'Completado'},
    {id: 'ORD-0998', product: 'Guantes médicos', status: 'Pendiente'}
  ];

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
