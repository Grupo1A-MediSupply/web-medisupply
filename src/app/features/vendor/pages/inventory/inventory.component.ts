import { Component } from '@angular/core';

@Component({
  templateUrl: './inventory.component.html'
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
