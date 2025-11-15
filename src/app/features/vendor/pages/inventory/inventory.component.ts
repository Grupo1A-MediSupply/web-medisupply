import { Component } from '@angular/core';

@Component({
  templateUrl: './inventory.component.html'
})
export class InventoryComponent {
  items: any[] = [];

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
