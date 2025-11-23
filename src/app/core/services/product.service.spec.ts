import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: ApiService, useValue: apiService }
      ]
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should get products without params', (done) => {
      const mockProducts = { 
        products: [{ 
          _id: '1',
          name: 'Product 1', 
          stock: 10,
          price: 100,
          expiry: new Date(),
          lot: 'LOT1',
          warehouse: 'WH1',
          supplier: 'S1',
          category: 'C1',
          description: 'D1'
        }] 
      };
      apiService.get.and.returnValue(of(mockProducts));

      service.getProducts().subscribe(response => {
        expect(response).toEqual(mockProducts);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/products', jasmine.any(String));
        done();
      });
    });

    it('should get products with search param', (done) => {
      const mockProducts = { products: [] };
      apiService.get.and.returnValue(of(mockProducts));

      service.getProducts({ search: 'test' }).subscribe(() => {
        expect(apiService.get).toHaveBeenCalledWith(
          '/api/v1/products?search=test',
          jasmine.any(String)
        );
        done();
      });
    });

    it('should get products with category param', (done) => {
      const mockProducts = { products: [] };
      apiService.get.and.returnValue(of(mockProducts));

      service.getProducts({ category: 'medical' }).subscribe(() => {
        expect(apiService.get).toHaveBeenCalledWith(
          '/api/v1/products?category=medical',
          jasmine.any(String)
        );
        done();
      });
    });

    it('should get products with lowStock param', (done) => {
      const mockProducts = { products: [] };
      apiService.get.and.returnValue(of(mockProducts));

      service.getProducts({ lowStock: true }).subscribe(() => {
        expect(apiService.get).toHaveBeenCalledWith(
          '/api/v1/products?lowStock=true',
          jasmine.any(String)
        );
        done();
      });
    });

    it('should get products with multiple params', (done) => {
      const mockProducts = { products: [] };
      apiService.get.and.returnValue(of(mockProducts));

      service.getProducts({ search: 'test', category: 'medical', lowStock: true }).subscribe(() => {
        const callArgs = apiService.get.calls.mostRecent().args[0];
        expect(callArgs).toContain('search=test');
        expect(callArgs).toContain('category=medical');
        expect(callArgs).toContain('lowStock=true');
        done();
      });
    });
  });

  describe('getProduct', () => {
    it('should get single product by id', (done) => {
      const mockProduct = { 
        product: { 
          _id: '123',
          name: 'Product 1', 
          stock: 10,
          price: 100,
          expiry: new Date(),
          lot: 'LOT1',
          warehouse: 'WH1',
          supplier: 'S1',
          category: 'C1',
          description: 'D1'
        } 
      };
      apiService.get.and.returnValue(of(mockProduct));

      service.getProduct('123').subscribe(response => {
        expect(response).toEqual(mockProduct);
        expect(apiService.get).toHaveBeenCalledWith('/api/v1/products/123', jasmine.any(String));
        done();
      });
    });
  });

  describe('createProduct', () => {
    it('should create product', (done) => {
      const product = { 
        _id: '1',
        name: 'New Product', 
        stock: 10, 
        price: 100, 
        expiry: new Date(), 
        lot: 'LOT1', 
        warehouse: 'WH1', 
        supplier: 'Supplier1', 
        category: 'Category1', 
        description: 'Description' 
      };
      const mockResponse = { message: 'Created', product };
      apiService.post.and.returnValue(of(mockResponse));

      service.createProduct(product).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.post).toHaveBeenCalledWith('/api/v1/products', product, jasmine.any(String));
        done();
      });
    });
  });

  describe('updateProduct', () => {
    it('should update product', (done) => {
      const updates = { stock: 20 };
      const mockResponse = { 
        message: 'Updated', 
        product: { 
          _id: '123',
          name: 'Product', 
          stock: 20,
          price: 100,
          expiry: new Date(),
          lot: 'LOT1',
          warehouse: 'WH1',
          supplier: 'S1',
          category: 'C1',
          description: 'D1'
        } 
      };
      apiService.put.and.returnValue(of(mockResponse));

      service.updateProduct('123', updates).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.put).toHaveBeenCalledWith('/api/v1/products/123', updates, jasmine.any(String));
        done();
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete product', (done) => {
      const mockResponse = { message: 'Deleted' };
      apiService.delete.and.returnValue(of(mockResponse));

      service.deleteProduct('123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.delete).toHaveBeenCalledWith('/api/v1/products/123', jasmine.any(String));
        done();
      });
    });
  });

  describe('bulkUploadProducts', () => {
    it('should bulk upload products', (done) => {
      const products = [
        { 
          _id: '1',
          name: 'Product 1', 
          stock: 10, 
          price: 100, 
          expiry: new Date(), 
          lot: 'LOT1', 
          warehouse: 'WH1', 
          supplier: 'S1', 
          category: 'C1', 
          description: 'D1' 
        }
      ];
      const mockResponse = { message: 'Uploaded', products };
      apiService.post.and.returnValue(of(mockResponse));

      service.bulkUploadProducts(products).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.post).toHaveBeenCalledWith('/api/v1/products/bulk-upload', { products }, jasmine.any(String));
        done();
      });
    });
  });
});

