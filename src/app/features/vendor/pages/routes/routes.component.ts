import { Component } from '@angular/core';

@Component({
  templateUrl: './routes.component.html'
})
export class RoutesComponent {
  showRouteGeneration = false;
  selectedOrder: any = null;
  selectedRoute: any = null;
  selectedVehicle: any = null;
  
  orders = [
    {id: 'ORD-1001', client: 'Hospital San Rafael', address: 'Calle 10 #20-30', date: '2025-09-22', status: 'Sin Ruta', routeId: null},
    {id: 'ORD-1002', client: 'Clínica Los Andes', address: 'Av 68 #45-12', date: '2025-09-22', status: 'Sin Ruta', routeId: null},
    {id: 'ORD-1003', client: 'Centro Médico', address: 'Carrera 15 #80-25', date: '2025-09-21', status: 'En Tránsito', routeId: 'R-501'},
    {id: 'ORD-1004', client: 'Hospital Central', address: 'Calle 100 #15-20', date: '2025-09-20', status: 'Entregado', routeId: 'R-502', returnRequested: true, returnReason: 'Producto defectuoso', returnStatus: 'Pendiente'},
    {id: 'ORD-1005', client: 'Clínica del Norte', address: 'Av 19 #120-45', date: '2025-09-19', status: 'Entregado', routeId: 'R-503', returnRequested: false}
  ];

  routes = [
    {id: 'R-501', vehicle: 'Camión-001', driver: 'Juan Pérez', status: 'En Tránsito', progress: 65},
    {id: 'R-502', vehicle: 'Camión-002', driver: 'María García', status: 'Completado', progress: 100},
    {id: 'R-503', vehicle: 'Camión-003', driver: 'Carlos López', status: 'Completado', progress: 100}
  ];

  suggestedRoutes = [
    {
      id: 'R-OPT-1',
      distance: '12.5',
      duration: '45 min',
      fuel: '8.2',
      stops: 3,
      route: ['Almacén', 'Hospital San Rafael', 'Clínica Los Andes', 'Centro Médico']
    },
    {
      id: 'R-OPT-2', 
      distance: '15.2',
      duration: '52 min',
      fuel: '9.8',
      stops: 3,
      route: ['Almacén', 'Centro Médico', 'Hospital San Rafael', 'Clínica Los Andes']
    }
  ];

  availableVehicles = [
    {id: 'Camión-001', type: 'Camión 12T', capacity: '12 toneladas', status: 'Disponible'},
    {id: 'Camión-002', type: 'Camión 8T', capacity: '8 toneladas', status: 'Disponible'},
    {id: 'Camión-003', type: 'Furgón 5T', capacity: '5 toneladas', status: 'Disponible'}
  ];

  getTotalRoutes(): number {
    return this.routes.length;
  }

  getPendingRoutes(): number {
    return this.getOrdersWithoutRoute().length;
  }

  getActiveRoutes(): number {
    return this.routes.filter(route => route.status === 'En Tránsito').length;
  }

  getReturnRequests(): number {
    return this.getDeliveredWithReturns().length;
  }

  getOrdersWithoutRoute() {
    return this.orders.filter(order => order.status === 'Sin Ruta');
  }

  getActiveRoutesList() {
    return this.routes.filter(route => route.status === 'En Tránsito');
  }

  getDeliveredWithReturns() {
    return this.orders.filter(order => order.returnRequested === true);
  }

  generateOptimalRoutes(order: any) {
    this.selectedOrder = order;
    this.showRouteGeneration = true;
    this.selectedRoute = null;
    this.selectedVehicle = null;
  }

  closeRouteGeneration() {
    this.showRouteGeneration = false;
    this.selectedOrder = null;
    this.selectedRoute = null;
    this.selectedVehicle = null;
  }

  selectRoute(route: any) {
    this.selectedRoute = route;
  }

  assignRoute() {
    if (this.selectedRoute && this.selectedVehicle && this.selectedOrder) {
      // Update order status
      const orderIndex = this.orders.findIndex(o => o.id === this.selectedOrder.id);
      if (orderIndex !== -1) {
        this.orders[orderIndex].status = 'En Tránsito';
        this.orders[orderIndex].routeId = this.selectedRoute.id;
      }

      // Create new route
      const newRoute = {
        id: this.selectedRoute.id,
        vehicle: this.selectedVehicle.id,
        driver: 'Conductor Asignado',
        status: 'En Tránsito',
        progress: 0
      };
      this.routes.push(newRoute);

      alert('Ruta asignada exitosamente');
      this.closeRouteGeneration();
    }
  }

  markAsDelivered(route: any) {
    route.status = 'Completado';
    route.progress = 100;
    
    // Update order status
    const orderIndex = this.orders.findIndex(o => o.routeId === route.id);
    if (orderIndex !== -1) {
      this.orders[orderIndex].status = 'Entregado';
    }
    
    alert('Entrega marcada como completada');
  }

  processReturn(order: any) {
    order.returnStatus = 'Procesada';
    alert('Devolución procesada');
  }
}
