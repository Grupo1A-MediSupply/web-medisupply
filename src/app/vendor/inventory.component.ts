import { Component } from '@angular/core';

@Component({
  template: `
  <div class="inventory-page">
    <div class="page-header">
      <h1 class="page-title">
        <mat-icon>inventory</mat-icon>
        Gestión de Inventario
      </h1>
      <p class="page-description">Consulta en tiempo real del inventario, estados, localización en bodegas, validación de lote y vencimiento.</p>
    </div>

    <div class="inventory-stats">
      <mat-card class="stat-card">
        <mat-card-content>
          <div class="stat-content">
            <mat-icon class="stat-icon">inventory_2</mat-icon>
            <div class="stat-info">
              <div class="stat-number">{{getTotalItems()}}</div>
              <div class="stat-label">Productos Totales</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="stat-card">
        <mat-card-content>
          <div class="stat-content">
            <mat-icon class="stat-icon">warning</mat-icon>
            <div class="stat-info">
              <div class="stat-number">{{getLowStockItems()}}</div>
              <div class="stat-label">Stock Bajo</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="stat-card">
        <mat-card-content>
          <div class="stat-content">
            <mat-icon class="stat-icon">schedule</mat-icon>
            <div class="stat-info">
              <div class="stat-number">{{getExpiringItems()}}</div>
              <div class="stat-label">Por Vencer</div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <mat-card class="inventory-table-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>list_alt</mat-icon>
          Inventario Actual
        </mat-card-title>
        <mat-card-subtitle>Lista completa de productos en inventario</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table mat-table [dataSource]="items" class="inventory-table">
            <ng-container matColumnDef="sku">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>tag</mat-icon>
                SKU
              </th>
              <td mat-cell *matCellDef="let item">
                <span class="sku-code">{{item.sku}}</span>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>medical_services</mat-icon>
                Producto
              </th>
              <td mat-cell *matCellDef="let item">
                <div class="product-details">
                  <mat-icon class="product-icon">local_hospital</mat-icon>
                  <div class="product-info">
                    <div class="product-name">{{item.name}}</div>
                    <div class="product-category">{{item.category}}</div>
                  </div>
                </div>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="stock">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>inventory</mat-icon>
                Stock
              </th>
              <td mat-cell *matCellDef="let item">
                <div class="stock-info">
                  <span class="stock-number" [ngClass]="getStockClass(item.stock)">{{item.stock}}</span>
                  <span class="stock-unit">{{item.unit}}</span>
                </div>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="lote">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>qr_code</mat-icon>
                Lote / Vencimiento
              </th>
              <td mat-cell *matCellDef="let item">
                <div class="lote-info">
                  <div class="lote-number">{{item.lote}}</div>
                  <div class="expiry-date" [ngClass]="getExpiryClass(item.venc)">{{item.venc}}</div>
                </div>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>
                <mat-icon>location_on</mat-icon>
                Ubicación
              </th>
              <td mat-cell *matCellDef="let item">
                <div class="location-info">
                  <mat-icon class="location-icon">warehouse</mat-icon>
                  <span>{{item.location}}</span>
                </div>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="['sku', 'name', 'stock', 'lote', 'location']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['sku', 'name', 'stock', 'lote', 'location'];" class="inventory-row"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
  `
})
export class InventoryComponent {
  items = [
    {
      sku: 'INS-001', 
      name: 'Insulina U100', 
      category: 'Medicamento',
      stock: 120, 
      unit: 'viales',
      lote: 'A1', 
      venc: '2026-03-01',
      location: 'Bodega A - Estante 3'
    },
    {
      sku: 'EQ-112', 
      name: 'Monitor cardíaco', 
      category: 'Equipo Médico',
      stock: 8, 
      unit: 'unidades',
      lote: 'B4', 
      venc: '2028-11-10',
      location: 'Bodega B - Estante 1'
    },
    {
      sku: 'JER-205', 
      name: 'Jeringas estériles 10ml', 
      category: 'Insumo',
      stock: 5, 
      unit: 'cajas',
      lote: 'C2', 
      venc: '2025-06-15',
      location: 'Bodega A - Estante 2'
    },
    {
      sku: 'GUA-301', 
      name: 'Guantes médicos nitrilo', 
      category: 'Insumo',
      stock: 25, 
      unit: 'cajas',
      lote: 'D1', 
      venc: '2027-02-20',
      location: 'Bodega C - Estante 4'
    }
  ];

  getTotalItems(): number {
    return this.items.length;
  }

  getLowStockItems(): number {
    return this.items.filter(item => item.stock < 10).length;
  }

  getExpiringItems(): number {
    const today = new Date();
    const threeMonthsFromNow = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
    
    return this.items.filter(item => {
      const expiryDate = new Date(item.venc);
      return expiryDate <= threeMonthsFromNow;
    }).length;
  }

  getStockClass(stock: number): string {
    if (stock < 10) return 'stock-low';
    if (stock < 25) return 'stock-medium';
    return 'stock-high';
  }

  getExpiryClass(expiryDate: string): string {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
    
    if (expiry <= today) return 'expired';
    if (expiry <= threeMonthsFromNow) return 'expiring-soon';
    return 'expiry-ok';
  }
}
