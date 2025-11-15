import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InventoryComponent } from './inventory.component';

describe('InventoryComponent', () => {
  let component: InventoryComponent;
  let fixture: ComponentFixture<InventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryComponent],
      imports: [
        MatTableModule,
        MatCardModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryComponent);
    component = fixture.componentInstance;
    
    // Initialize mock data for tests
    component.items = [
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
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTotalItems', () => {
    it('should return the total number of items', () => {
      const totalItems = component.getTotalItems();
      expect(totalItems).toBe(4);
    });

    it('should return 0 when items array is empty', () => {
      component.items = [];
      const totalItems = component.getTotalItems();
      expect(totalItems).toBe(0);
    });
  });

  describe('getLowStockItems', () => {
    it('should return the number of items with stock less than 10', () => {
      const lowStockItems = component.getLowStockItems();
      expect(lowStockItems).toBe(2); // JER-205 (stock: 5) and EQ-112 (stock: 8) have stock < 10
    });

    it('should return 0 when no items have low stock', () => {
      component.items = [
        { sku: 'TEST-001', name: 'Test Item', category: 'Test', stock: 50, unit: 'units', lote: 'A1', venc: '2026-01-01', location: 'Test Location' }
      ];
      const lowStockItems = component.getLowStockItems();
      expect(lowStockItems).toBe(0);
    });

    it('should handle edge case where stock equals 10', () => {
      component.items = [
        { sku: 'TEST-001', name: 'Test Item', category: 'Test', stock: 10, unit: 'units', lote: 'A1', venc: '2026-01-01', location: 'Test Location' }
      ];
      const lowStockItems = component.getLowStockItems();
      expect(lowStockItems).toBe(0);
    });
  });

  describe('getExpiringItems', () => {
    it('should return the number of items expiring within 3 months', () => {
      const expiringItems = component.getExpiringItems();
      expect(expiringItems).toBe(1); // Only JER-205 expires in 2025-06-15
    });

    it('should return 0 when no items are expiring soon', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 2);
      
      component.items = [
        { 
          sku: 'TEST-001', 
          name: 'Test Item', 
          category: 'Test', 
          stock: 50, 
          unit: 'units', 
          lote: 'A1', 
          venc: futureDate.toISOString().split('T')[0], 
          location: 'Test Location' 
        }
      ];
      const expiringItems = component.getExpiringItems();
      expect(expiringItems).toBe(0);
    });

    it('should handle items that have already expired', () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      
      component.items = [
        { 
          sku: 'TEST-001', 
          name: 'Test Item', 
          category: 'Test', 
          stock: 50, 
          unit: 'units', 
          lote: 'A1', 
          venc: pastDate.toISOString().split('T')[0], 
          location: 'Test Location' 
        }
      ];
      const expiringItems = component.getExpiringItems();
      expect(expiringItems).toBe(1);
    });
  });

  describe('getStockClass', () => {
    it('should return "stock-low" for stock less than 10', () => {
      expect(component.getStockClass(5)).toBe('stock-low');
      expect(component.getStockClass(9)).toBe('stock-low');
    });

    it('should return "stock-medium" for stock between 10 and 24', () => {
      expect(component.getStockClass(10)).toBe('stock-medium');
      expect(component.getStockClass(15)).toBe('stock-medium');
      expect(component.getStockClass(24)).toBe('stock-medium');
    });

    it('should return "stock-high" for stock 25 or more', () => {
      expect(component.getStockClass(25)).toBe('stock-high');
      expect(component.getStockClass(100)).toBe('stock-high');
    });
  });

  describe('getExpiryClass', () => {
    it('should return "expired" for dates in the past', () => {
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      const pastDateString = pastDate.toISOString().split('T')[0];
      
      expect(component.getExpiryClass(pastDateString)).toBe('expired');
    });

    it('should return "expiring-soon" for dates within 3 months', () => {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 2);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      expect(component.getExpiryClass(futureDateString)).toBe('expiring-soon');
    });

    it('should return "expiry-ok" for dates more than 3 months away', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      expect(component.getExpiryClass(futureDateString)).toBe('expiry-ok');
    });
  });

  describe('items array', () => {
    it('should have the correct structure for each item', () => {
      component.items.forEach(item => {
        expect(item.sku).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.category).toBeDefined();
        expect(item.stock).toBeDefined();
        expect(item.unit).toBeDefined();
        expect(item.lote).toBeDefined();
        expect(item.venc).toBeDefined();
        expect(item.location).toBeDefined();
      });
    });

    it('should have valid stock values', () => {
      component.items.forEach(item => {
        expect(typeof item.stock).toBe('number');
        expect(item.stock).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid expiry dates', () => {
      component.items.forEach(item => {
        const expiryDate = new Date(item.venc);
        expect(expiryDate).toBeInstanceOf(Date);
        expect(expiryDate.toString()).not.toBe('Invalid Date');
      });
    });
  });

  describe('template rendering', () => {
    it('should display the correct number of items in the table', () => {
      const tableRows = fixture.debugElement.nativeElement.querySelectorAll('tr[mat-row]');
      expect(tableRows.length).toBe(4);
    });

    it('should display correct statistics', () => {
      const statNumbers = fixture.debugElement.nativeElement.querySelectorAll('.stat-number');
      expect(statNumbers[0].textContent.trim()).toBe('4'); // Total items
      expect(statNumbers[1].textContent.trim()).toBe('2'); // Low stock items
      expect(statNumbers[2].textContent.trim()).toBe('1'); // Expiring items
    });
  });
});
