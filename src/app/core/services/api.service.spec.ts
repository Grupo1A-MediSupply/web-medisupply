import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should make GET request without token', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/test';

      service.get(endpoint).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush(mockData);
    });

    it('should make GET request with token', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/test';
      const token = 'test-token';
      sessionStorage.setItem('token', token);

      service.get(endpoint).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(mockData);
    });

    it('should make GET request with custom baseUrl', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/test';
      const baseUrl = 'https://custom-api.com';

      service.get(endpoint, baseUrl).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${baseUrl}${endpoint}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });
  });

  describe('POST requests', () => {
    it('should make POST request', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/test';
      const postData = { name: 'Test' };

      service.post(endpoint, postData).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(postData);
      req.flush(mockData);
    });

    it('should make POST request with token', () => {
      const mockData = { id: 1, name: 'Test' };
      const endpoint = '/test';
      const postData = { name: 'Test' };
      const token = 'test-token';
      sessionStorage.setItem('token', token);

      service.post(endpoint, postData).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      req.flush(mockData);
    });
  });

  describe('PUT requests', () => {
    it('should make PUT request', () => {
      const mockData = { id: 1, name: 'Updated' };
      const endpoint = '/test/1';
      const putData = { name: 'Updated' };

      service.put(endpoint, putData).subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(putData);
      req.flush(mockData);
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request', () => {
      const endpoint = '/test/1';

      service.delete(endpoint).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Error handling', () => {
    let originalConsoleError: typeof console.error;

    beforeEach(() => {
      // Guardar y suprimir console.error para estos tests
      originalConsoleError = console.error;
      console.error = jasmine.createSpy('console.error');
    });

    afterEach(() => {
      // Restaurar console.error
      console.error = originalConsoleError;
    });

    it('should handle client-side error', () => {
      const endpoint = '/test';
      const errorMessage = 'Network error';

      service.get(endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toContain('Error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.error(new ErrorEvent('Network error', { message: errorMessage }));
    });

    it('should handle server-side error with message', () => {
      const endpoint = '/test';
      const errorResponse = { message: 'Server error' };

      service.get(endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Server error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.flush(errorResponse, { status: 500, statusText: 'Server Error' });
    });

    it('should handle server-side error without message', () => {
      const endpoint = '/test';

      service.get(endpoint).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${endpoint}`);
      req.flush(null, { status: 500, statusText: 'Server Error' });
    });
  });
});

