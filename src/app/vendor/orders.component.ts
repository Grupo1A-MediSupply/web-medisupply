import { Component } from '@angular/core';

@Component({
  template: `
  <div class="orders-page">
    <div class="page-header">
      <h1 class="page-title">
        <mat-icon>assignment</mat-icon>
        Gestión de Órdenes
      </h1>
      <p class="page-description">Administra pedidos, validaciones de bodega, lotes, vencimientos y entregas programadas.</p>
    </div>

    <div class="stats-cards">
      <mat-card class="stat-card">
        <mat-card-content>
          <div class="stat-content">
            <mat-icon class="stat-icon">assignment</mat-icon>
            <div class="stat-info">
              <div class="stat-number">{{orders.length}}</div>
              <div class="stat-label">Órdenes Totales</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="stat-card">
        <mat-card-content>
          <div class="stat-content">
            <mat-icon class="stat-icon">pending</mat-icon>
            <div class="stat-info">
              <div class="stat-number">{{getPendingOrders()}}</div>
              <div class="stat-label">Pendientes</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="stat-card">
        <mat-card-content>
          <div class="stat-content">
            <mat-icon class="stat-icon">check_circle</mat-icon>
            <div class="stat-info">
              <div class="stat-number">{{getCompletedOrders()}}</div>
              <div class="stat-label">Completadas</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-card class="action-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>add_circle</mat-icon>
          Crear Nueva Orden
        </mat-card-title>
        <mat-card-subtitle>Genera un pedido de ejemplo para demostración</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p class="action-description">Al crear un pedido, el inventario se actualizará automáticamente (simulado).</p>
        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="createOrder()" class="action-button">
            <mat-icon>add</mat-icon>
            Crear Pedido de Ejemplo
          </button>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="table-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>list</mat-icon>
          Órdenes Recientes
        </mat-card-title>
        <mat-card-subtitle>Lista de todas las órdenes del sistema</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="orders" class="orders-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>tag</mat-icon>
                ID de Orden
              </th>
              <td mat-cell *matCellDef="let order">
                <span class="order-id">{{order.id}}</span>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="product">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>inventory</mat-icon>
                Producto
              </th>
              <td mat-cell *matCellDef="let order">
                <div class="product-info">
                  <mat-icon class="product-icon">medical_services</mat-icon>
                  <span>{{order.product}}</span>
                </div>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>info</mat-icon>
                Estado
              </th>
              <td mat-cell *matCellDef="let order">
                <span class="status-badge" [ngClass]="'status-' + order.status.toLowerCase()">
                  <mat-icon>{{getStatusIcon(order.status)}}</mat-icon>
                  {{order.status}}
                </span>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>settings</mat-icon>
                Acciones
              </th>
              <td mat-cell *matCellDef="let order">
                <button mat-icon-button matTooltip="Ver detalles">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button matTooltip="Eliminar" color="warn">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="['id', 'product', 'status', 'actions']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['id', 'product', 'status', 'actions'];" class="order-row"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
  `
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
