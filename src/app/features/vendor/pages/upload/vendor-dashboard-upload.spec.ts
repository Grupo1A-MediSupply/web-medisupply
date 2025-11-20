import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VendorDashboardComponent } from '../dashboard/vendor-dashboard.component';
import { OrderService } from '../../../../core/services/order.service';
import { ProductService } from '../../../../core/services/product.service';
import { LogisticsService } from '../../../../core/services/logistics.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('VendorDashboardComponent - Upload Functionality', () => {
  let component: VendorDashboardComponent;
  let fixture: ComponentFixture<VendorDashboardComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockProductService: jasmine.SpyObj<ProductService>;
  let mockLogisticsService: jasmine.SpyObj<LogisticsService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockOrderService = jasmine.createSpyObj('OrderService', ['getOrders', 'createOrder', 'updateOrder']);
    mockProductService = jasmine.createSpyObj('ProductService', ['getProducts']);
    mockLogisticsService = jasmine.createSpyObj('LogisticsService', ['getRoutes', 'createRoute', 'updateRoute', 'generateOptimalRoutes']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    
    // Mock services básicos
    mockAuthService.getUser.and.returnValue({ id: '1', email: 'test@test.com', role: 'vendor', name: 'Test Vendor' });
    mockOrderService.getOrders.and.returnValue(of({ orders: [] }));
    mockProductService.getProducts.and.returnValue(of({ products: [] }));
    mockLogisticsService.getRoutes.and.returnValue(of({ routes: [] }));
    
    await TestBed.configureTestingModule({
      declarations: [VendorDashboardComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OrderService, useValue: mockOrderService },
        { provide: ProductService, useValue: mockProductService },
        { provide: LogisticsService, useValue: mockLogisticsService },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('File Selection', () => {
    it('should accept valid CSV files', () => {
      const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      component.onFileSelected(mockEvent);

      expect(component.selectedFile).toBe(mockFile);
      expect(component.uploadMessage).toBe('Archivo seleccionado: test.csv');
    });

    it('should accept valid Excel files', () => {
      const mockFile = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      component.onFileSelected(mockEvent);

      expect(component.selectedFile).toBe(mockFile);
      expect(component.uploadMessage).toBe('Archivo seleccionado: test.xlsx');
    });

    it('should reject invalid file types', () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const mockEvent = {
        target: {
          files: [mockFile]
        }
      };

      component.onFileSelected(mockEvent);

      expect(component.selectedFile).toBeNull();
      expect(component.uploadMessage).toBe('Por favor seleccione un archivo CSV o Excel (.xlsx, .xls)');
    });

    it('should handle no file selected', () => {
      const mockEvent = {
        target: {
          files: null
        }
      };

      component.onFileSelected(mockEvent);

      expect(component.selectedFile).toBeNull();
      expect(component.uploadMessage).toBe('');
    });
  });

  describe('Date Validation', () => {
    it('should validate correct date format (YYYY-MM-DD)', () => {
      expect(component.isValidDate('2026-03-15')).toBe(true);
      expect(component.isValidDate('2024-12-31')).toBe(true);
      expect(component.isValidDate('2025-01-01')).toBe(true);
    });

    it('should reject invalid date formats', () => {
      expect(component.isValidDate('15-03-2026')).toBe(false);
      expect(component.isValidDate('2026/03/15')).toBe(false);
      expect(component.isValidDate('invalid-date')).toBe(false);
      expect(component.isValidDate('2026-3-15')).toBe(false);
      expect(component.isValidDate('2026-03-5')).toBe(false);
      expect(component.isValidDate('')).toBe(false);
    });

    it('should reject invalid dates', () => {
      expect(component.isValidDate('2026-13-15')).toBe(false); // Invalid month
      expect(component.isValidDate('2026-02-30')).toBe(false); // Invalid day
      expect(component.isValidDate('2026-04-31')).toBe(false); // Invalid day
    });
  });

  describe('Batches Format Validation', () => {
    it('should validate correct batches format', () => {
      expect(component.isValidBatchesFormat('LOTE-001:50:2026-03-15:Estante A3')).toBe(true);
      expect(component.isValidBatchesFormat('LOTE-001:50:2026-03-15:Estante A3;LOTE-002:25:2026-04-15:Estante B4')).toBe(true);
      expect(component.isValidBatchesFormat('')).toBe(true); // Empty batches allowed
    });

    it('should reject invalid batches format', () => {
      expect(component.isValidBatchesFormat('LOTE-001:50:2026-03-15')).toBe(false); // Missing location
      expect(component.isValidBatchesFormat('LOTE-001:abc:2026-03-15:Estante A3')).toBe(false); // Invalid quantity
      expect(component.isValidBatchesFormat('LOTE-001:50:invalid-date:Estante A3')).toBe(false); // Invalid date
      expect(component.isValidBatchesFormat('LOTE-001:50:2026-03-15')).toBe(false); // Missing location
    });
  });

  describe('CSV Data Validation', () => {
    const validHeaders = ['name', 'stock', 'price', 'expiry', 'lot', 'warehouse', 'supplier', 'category', 'description', 'batches'];
    const validData = [
      {
        name: 'Paracetamol',
        stock: '100',
        price: '2.50',
        expiry: '2026-03-15',
        lot: 'PAR-2024-005',
        warehouse: 'Bodega Principal',
        supplier: 'PharmaCorp',
        category: 'Medicamento',
        description: 'Analgésico',
        batches: 'PAR-2024-005-A:50:2026-03-15:Estante A3'
      }
    ];

    it('should validate correct CSV data', () => {
      const result = component.validateCSVData(validData, validHeaders);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect missing required columns', () => {
      const incompleteHeaders = ['name', 'stock', 'price'];
      const result = component.validateCSVData(validData, incompleteHeaders);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Faltan las siguientes columnas requeridas: expiry, lot, warehouse, supplier, category, description, batches');
    });

    it('should detect empty data', () => {
      const result = component.validateCSVData([], validHeaders);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('El archivo está vacío o no contiene datos válidos');
    });

    it('should detect empty required fields', () => {
      const dataWithEmptyFields = [
        {
          name: '',
          stock: '100',
          price: '2.50',
          expiry: '2026-03-15',
          lot: 'PAR-2024-005',
          warehouse: 'Bodega Principal',
          supplier: 'PharmaCorp',
          category: 'Medicamento',
          description: 'Analgésico',
          batches: 'PAR-2024-005-A:50:2026-03-15:Estante A3'
        }
      ];

      const result = component.validateCSVData(dataWithEmptyFields, validHeaders);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Fila 2: El campo \'name\' está vacío');
    });

    it('should detect invalid stock format', () => {
      const dataWithInvalidStock = [
        {
          name: 'Paracetamol',
          stock: 'abc',
          price: '2.50',
          expiry: '2026-03-15',
          lot: 'PAR-2024-005',
          warehouse: 'Bodega Principal',
          supplier: 'PharmaCorp',
          category: 'Medicamento',
          description: 'Analgésico',
          batches: 'PAR-2024-005-A:50:2026-03-15:Estante A3'
        }
      ];

      const result = component.validateCSVData(dataWithInvalidStock, validHeaders);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Fila 2: El campo \'stock\' debe ser un número válido');
    });

    it('should detect invalid price format', () => {
      const dataWithInvalidPrice = [
        {
          name: 'Paracetamol',
          stock: '100',
          price: 'invalid',
          expiry: '2026-03-15',
          lot: 'PAR-2024-005',
          warehouse: 'Bodega Principal',
          supplier: 'PharmaCorp',
          category: 'Medicamento',
          description: 'Analgésico',
          batches: 'PAR-2024-005-A:50:2026-03-15:Estante A3'
        }
      ];

      const result = component.validateCSVData(dataWithInvalidPrice, validHeaders);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Fila 2: El campo \'price\' debe ser un número válido');
    });

    it('should detect invalid date format', () => {
      const dataWithInvalidDate = [
        {
          name: 'Paracetamol',
          stock: '100',
          price: '2.50',
          expiry: 'invalid-date',
          lot: 'PAR-2024-005',
          warehouse: 'Bodega Principal',
          supplier: 'PharmaCorp',
          category: 'Medicamento',
          description: 'Analgésico',
          batches: 'PAR-2024-005-A:50:2026-03-15:Estante A3'
        }
      ];

      const result = component.validateCSVData(dataWithInvalidDate, validHeaders);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Fila 2: El campo \'expiry\' debe tener formato YYYY-MM-DD (fecha encontrada: invalid-date)');
    });

    it('should detect invalid batches format', () => {
      const dataWithInvalidBatches = [
        {
          name: 'Paracetamol',
          stock: '100',
          price: '2.50',
          expiry: '2026-03-15',
          lot: 'PAR-2024-005',
          warehouse: 'Bodega Principal',
          supplier: 'PharmaCorp',
          category: 'Medicamento',
          description: 'Analgésico',
          batches: 'invalid-format'
        }
      ];

      const result = component.validateCSVData(dataWithInvalidBatches, validHeaders);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Fila 2: El campo \'batches\' debe tener formato LOTE:CANTIDAD:FECHA:UBICACIÓN separado por punto y coma');
    });

    it('should handle multiple validation errors', () => {
      const dataWithMultipleErrors = [
        {
          name: '',
          stock: 'abc',
          price: 'invalid',
          expiry: 'invalid-date',
          lot: 'PAR-2024-005',
          warehouse: 'Bodega Principal',
          supplier: 'PharmaCorp',
          category: 'Medicamento',
          description: 'Analgésico',
          batches: 'invalid-format'
        }
      ];

      const result = component.validateCSVData(dataWithMultipleErrors, validHeaders);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(4);
      expect(result.errors).toContain('Fila 2: El campo \'name\' está vacío');
      expect(result.errors).toContain('Fila 2: El campo \'stock\' debe ser un número válido');
      expect(result.errors).toContain('Fila 2: El campo \'price\' debe ser un número válido');
      expect(result.errors).toContain('Fila 2: El campo \'expiry\' debe tener formato YYYY-MM-DD (fecha encontrada: invalid-date)');
      expect(result.errors).toContain('Fila 2: El campo \'batches\' debe tener formato LOTE:CANTIDAD:FECHA:UBICACIÓN separado por punto y coma');
    });
  });

  describe('Batches Parsing', () => {
    it('should parse valid batches string', () => {
      const batchesString = 'LOTE-001:50:2026-03-15:Estante A3;LOTE-002:25:2026-04-15:Estante B4';
      const result = component.parseBatches(batchesString);
      
      expect(result).toEqual([
        {
          batch: 'LOTE-001',
          quantity: 50,
          expiry: '2026-03-15',
          location: 'Estante A3'
        },
        {
          batch: 'LOTE-002',
          quantity: 25,
          expiry: '2026-04-15',
          location: 'Estante B4'
        }
      ]);
    });

    it('should handle empty batches string', () => {
      const result = component.parseBatches('');
      expect(result).toEqual([]);
    });

    it('should handle single batch', () => {
      const batchesString = 'LOTE-001:50:2026-03-15:Estante A3';
      const result = component.parseBatches(batchesString);
      
      expect(result).toEqual([
        {
          batch: 'LOTE-001',
          quantity: 50,
          expiry: '2026-03-15',
          location: 'Estante A3'
        }
      ]);
    });
  });

  describe('Upload Process', () => {
    it('should handle upload without file selected', () => {
      component.selectedFile = null;
      component.uploadFile();
      
      expect(component.uploadMessage).toBe('Por favor seleccione un archivo');
      expect(component.isUploading).toBe(false);
    });

    it('should handle Excel files with appropriate message', () => {
      const mockFile = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      component.selectedFile = mockFile;
      
      component.validateAndProcessFile();
      
      expect(component.uploadMessage).toBe('Procesamiento de archivos Excel no implementado aún. Use formato CSV.');
      expect(component.isUploading).toBe(false);
      expect(component.showUploadSuccess).toBe(false);
    });

    it('should clear upload state', () => {
      component.selectedFile = new File(['test'], 'test.csv');
      component.uploadMessage = 'Test message';
      component.uploadProgress = 50;
      component.isUploading = true;
      component.showUploadSuccess = true;
      
      component.clearUpload();
      
      expect(component.selectedFile).toBeNull();
      expect(component.uploadMessage).toBe('');
      expect(component.uploadProgress).toBe(0);
      expect(component.isUploading).toBe(false);
      expect(component.showUploadSuccess).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors correctly', () => {
      const errors = ['Error 1', 'Error 2', 'Error 3'];
      
      component.handleValidationErrors(errors);
      
      expect(component.isUploading).toBe(false);
      expect(component.uploadProgress).toBe(0);
      expect(component.showUploadSuccess).toBe(false);
      expect(component.uploadMessage).toContain('Errores encontrados en el archivo:');
      expect(component.uploadMessage).toContain('Error 1');
    });

    it('should handle file errors correctly', () => {
      const errorMessage = 'Error al leer el archivo';
      
      component.handleFileError(errorMessage);
      
      expect(component.isUploading).toBe(false);
      expect(component.uploadProgress).toBe(0);
      expect(component.showUploadSuccess).toBe(false);
      expect(component.uploadMessage).toBe(errorMessage);
    });

    it('should limit error messages to 10 and show count', () => {
      const errors = Array.from({length: 15}, (_, i) => `Error ${i + 1}`);
      
      component.handleValidationErrors(errors);
      
      expect(component.uploadMessage).toContain('Error 1');
      expect(component.uploadMessage).toContain('Error 10');
      expect(component.uploadMessage).toContain('... y 5 errores más');
      expect(component.uploadMessage).not.toContain('Error 11');
    });
  });

  describe('Template Download', () => {
    it('should download CSV template', () => {
      spyOn(document, 'createElement').and.callThrough();
      spyOn(document.body, 'appendChild');
      spyOn(document.body, 'removeChild');
      
      component.downloadTemplate();
      
      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });
});
