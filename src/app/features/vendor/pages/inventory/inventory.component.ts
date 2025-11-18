import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit {
  items: any[] = [];
  isLoadingItems = false;
  itemsError = '';

  constructor(private productService: ProductService) {}
  
  ngOnInit() {
    this.loadItems();
  }
  
  loadItems() {
    this.isLoadingItems = true;
    this.itemsError = '';
    
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.items = response.products.map(product => ({
          name: product.name,
          stock: product.stock,
          price: product.price,
          venc: product.expiry,
          lot: product.lot,
          warehouse: product.warehouse,
          supplier: product.supplier,
          category: product.category,
          description: product.description,
          _id: product._id
        }));
        this.isLoadingItems = false;
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.itemsError = 'Error al cargar inventario';
        this.isLoadingItems = false;
      }
    });
  }

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
      if (!item.venc) return false;
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
