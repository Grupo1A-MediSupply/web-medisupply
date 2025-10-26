import { Component } from '@angular/core';

@Component({
  template: `
  <div class="routes-page">
    <div class="page-header">
      <h1 class="page-title">
        <mat-icon>route</mat-icon>
        Gestión de Rutas
      </h1>
      <p class="page-description">Administra rutas de entrega, asignación de vehículos y seguimiento de envíos.</p>
    </div>

    <!-- Stats Cards -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-content">
          <mat-icon class="stat-icon">route</mat-icon>
          <div class="stat-info">
            <div class="stat-number">{{getTotalRoutes()}}</div>
            <div class="stat-label">Rutas Totales</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-content">
          <mat-icon class="stat-icon">pending</mat-icon>
          <div class="stat-info">
            <div class="stat-number">{{getPendingRoutes()}}</div>
            <div class="stat-label">Sin Ruta</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-content">
          <mat-icon class="stat-icon">local_shipping</mat-icon>
          <div class="stat-info">
            <div class="stat-number">{{getActiveRoutes()}}</div>
            <div class="stat-label">En Tránsito</div>
          </div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-content">
          <mat-icon class="stat-icon">assignment_return</mat-icon>
          <div class="stat-info">
            <div class="stat-number">{{getReturnRequests()}}</div>
            <div class="stat-label">Devoluciones</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders without Route -->
    <div class="section-card" *ngIf="getOrdersWithoutRoute().length > 0">
      <div class="card-header">
        <h3>
          <mat-icon>pending_actions</mat-icon>
          Pedidos Sin Ruta Asignada
        </h3>
        <p>Pedidos que requieren generación de ruta de entrega</p>
      </div>
      <div class="table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of getOrdersWithoutRoute()">
              <td>{{order.id}}</td>
              <td>{{order.client}}</td>
              <td>{{order.address}}</td>
              <td>{{order.date}}</td>
              <td>
                <button mat-raised-button color="primary" (click)="generateOptimalRoutes(order)">
                  <mat-icon>route</mat-icon>
                  Generar Rutas
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Route Generation Modal -->
    <div class="route-generation-modal" *ngIf="showRouteGeneration">
      <div class="modal-overlay" (click)="closeRouteGeneration()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Generación de Rutas Óptimas</h2>
          <button mat-icon-button (click)="closeRouteGeneration()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="order-info">
            <h3>Pedido: {{selectedOrder?.id}}</h3>
            <p><strong>Cliente:</strong> {{selectedOrder?.client}}</p>
            <p><strong>Dirección:</strong> {{selectedOrder?.address}}</p>
          </div>

          <!-- Map Container -->
          <div class="map-container">
            <div class="map-placeholder">
              <mat-icon>map</mat-icon>
              <h3>Mapa de Rutas Sugeridas</h3>
              <p>Aquí se mostraría el mapa con las rutas optimizadas</p>
            </div>
          </div>

          <!-- Route Options -->
          <div class="route-options">
            <h3>Rutas Sugeridas</h3>
            <div class="route-cards">
              <div class="route-card" *ngFor="let route of suggestedRoutes; let i = index">
                <div class="route-header">
                  <h4>Ruta {{i + 1}}</h4>
                  <span class="route-distance">{{route.distance}} km</span>
                </div>
                <div class="route-details">
                  <p><strong>Duración estimada:</strong> {{route.duration}}</p>
                  <p><strong>Combustible estimado:</strong> {{route.fuel}} L</p>
                  <p><strong>Paradas:</strong> {{route.stops}} ubicaciones</p>
                </div>
                <div class="route-actions">
                  <button mat-raised-button color="primary" (click)="selectRoute(route)">
                    <mat-icon>check</mat-icon>
                    Seleccionar Ruta
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Vehicle Assignment -->
          <div class="vehicle-assignment" *ngIf="selectedRoute">
            <h3>Asignación de Vehículo</h3>
            <div class="form-group">
              <label class="form-label">Seleccionar Camión</label>
              <mat-select [(value)]="selectedVehicle" class="form-select">
                <mat-option *ngFor="let vehicle of availableVehicles" [value]="vehicle">
                  {{vehicle.id}} - {{vehicle.type}} ({{vehicle.capacity}})
                </mat-option>
              </mat-select>
            </div>
            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="assignRoute()" [disabled]="!selectedVehicle">
                <mat-icon>local_shipping</mat-icon>
                Asignar Ruta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Routes -->
    <div class="section-card">
      <div class="card-header">
        <h3>
          <mat-icon>local_shipping</mat-icon>
          Rutas Activas
        </h3>
        <p>Rutas en tránsito con seguimiento en tiempo real</p>
      </div>
      <div class="routes-grid">
        <div class="route-item" *ngFor="let route of getActiveRoutesList()">
          <div class="route-header">
            <h4>{{route.id}}</h4>
            <span class="route-status" [ngClass]="'status-' + route.status.toLowerCase()">
              {{route.status}}
            </span>
          </div>
          <div class="route-info">
            <p><strong>Vehículo:</strong> {{route.vehicle}}</p>
            <p><strong>Conductor:</strong> {{route.driver}}</p>
            <p><strong>Progreso:</strong> {{route.progress}}%</p>
          </div>
          <div class="route-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="route.progress"></div>
            </div>
          </div>
          <div class="route-actions">
            <button mat-icon-button matTooltip="Ver Tracking">
              <mat-icon>gps_fixed</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Ver Detalles">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Marcar como Entregado" (click)="markAsDelivered(route)">
              <mat-icon>check_circle</mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivered Orders with Returns -->
    <div class="section-card" *ngIf="getDeliveredWithReturns().length > 0">
      <div class="card-header">
        <h3>
          <mat-icon>assignment_return</mat-icon>
          Entregas con Solicitudes de Devolución
        </h3>
        <p>Pedidos entregados que han solicitado devolución</p>
      </div>
      <div class="table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha Entrega</th>
              <th>Motivo Devolución</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of getDeliveredWithReturns()">
              <td>{{order.id}}</td>
              <td>{{order.client}}</td>
              <td>{{order.deliveryDate}}</td>
              <td>{{order.returnReason}}</td>
              <td>
                <span class="status-badge status-return-requested">
                  {{order.returnStatus}}
                </span>
              </td>
              <td>
                <button mat-raised-button color="warn" (click)="processReturn(order)">
                  <mat-icon>assignment_return</mat-icon>
                  Procesar Devolución
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `
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
