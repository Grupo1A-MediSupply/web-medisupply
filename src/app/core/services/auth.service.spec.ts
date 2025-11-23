import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, LoginRequest, SignupRequest } from './auth.service';
import { ApiService } from './api.service';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['post', 'get']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiService },
        { provide: Router, useValue: router }
      ]
    });
    service = TestBed.inject(AuthService);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully', (done) => {
      const loginData: LoginRequest = { username: 'testuser', password: 'password123' };
      const mockResponse = {
        message: 'Login exitoso',
        token: 'test-token',
        user: { id: '1', email: 'test@test.com', role: 'vendor' as const, name: 'Test User' }
      };

      apiService.post.and.returnValue(of(mockResponse));

      service.login(loginData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.post).toHaveBeenCalledWith('/api/v1/auth/login', loginData, jasmine.any(String));
        done();
      });
    });

    it('should handle login with MFA', (done) => {
      const loginData: LoginRequest = { username: 'testuser', password: 'password123' };
      const mockResponse = {
        message: 'MFA required',
        mfaRequired: true,
        userId: '1'
      };

      apiService.post.and.returnValue(of(mockResponse));

      service.login(loginData).subscribe(response => {
        expect(response.mfaRequired).toBe(true);
        expect(response.userId).toBe('1');
        done();
      });
    });
  });

  describe('signup', () => {
    it('should signup successfully with token', (done) => {
      const signupData: SignupRequest = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        role: 'vendor',
        name: 'Test User'
      };
      const mockResponse = {
        id: '1',
        email: 'test@test.com',
        role: 'vendor',
        name: 'Test User',
        token: 'test-token'
      };

      apiService.post.and.returnValue(of(mockResponse));

      service.signup(signupData).subscribe(response => {
        expect(response.user).toBeDefined();
        expect(response.user?.id).toBe('1');
        expect(response.user?.role).toBe('vendor');
        expect(sessionStorage.getItem('token')).toBe('test-token');
        done();
      });
    });

    it('should signup successfully without token', (done) => {
      const signupData: SignupRequest = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        role: 'client',
        name: 'Test Client'
      };
      const mockResponse = {
        id: '2',
        email: 'test@test.com',
        role: 'client',
        name: 'Test Client'
      };

      apiService.post.and.returnValue(of(mockResponse));

      service.signup(signupData).subscribe(response => {
        expect(response.user).toBeDefined();
        expect(response.user?.role).toBe('client');
        done();
      });
    });

    it('should handle signup with full_name field', (done) => {
      const signupData: SignupRequest = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'password123',
        role: 'vendor',
        name: 'Test User'
      };
      const mockResponse = {
        id: '1',
        email: 'test@test.com',
        role: 'vendor',
        full_name: 'Test User Full Name'
      };

      apiService.post.and.returnValue(of(mockResponse));

      service.signup(signupData).subscribe(response => {
        expect(response.user?.name).toBe('Test User Full Name');
        done();
      });
    });
  });

  describe('verifyMFA', () => {
    it('should verify MFA successfully', (done) => {
      const userId = '1';
      const code = '123456';
      const mockResponse = {
        message: 'MFA verified',
        token: 'test-token',
        user: { id: '1', email: 'test@test.com', role: 'vendor', name: 'Test User' }
      };

      apiService.post.and.returnValue(of(mockResponse));

      service.verifyMFA(userId, code).subscribe(response => {
        expect(response.token).toBe('test-token');
        expect(sessionStorage.getItem('token')).toBe('test-token');
        expect(sessionStorage.getItem('user')).toBeTruthy();
        expect(sessionStorage.getItem('role')).toBe('vendor');
        done();
      });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', (done) => {
      const currentPassword = 'oldpass';
      const newPassword = 'newpass';
      const mockResponse = { message: 'Password changed successfully' };

      apiService.post.and.returnValue(of(mockResponse));

      service.changePassword(currentPassword, newPassword).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(apiService.post).toHaveBeenCalledWith(
          '/api/v1/auth/change-password',
          { currentPassword, newPassword },
          jasmine.any(String)
        );
        done();
      });
    });
  });

  describe('getProfile', () => {
    it('should get user profile', (done) => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@test.com',
          role: 'vendor' as const,
          name: 'Test User'
        }
      };

      apiService.get.and.returnValue(of(mockResponse));

      service.getProfile().subscribe(response => {
        expect(response.user.id).toBe('1');
        expect(response.user.role).toBe('vendor');
        done();
      });
    });
  });

  describe('logout', () => {
    it('should clear session storage and navigate to home', () => {
      sessionStorage.setItem('token', 'test-token');
      sessionStorage.setItem('user', '{"id":"1"}');
      sessionStorage.setItem('role', 'vendor');

      service.logout();

      expect(sessionStorage.getItem('token')).toBeNull();
      expect(sessionStorage.getItem('user')).toBeNull();
      expect(sessionStorage.getItem('role')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      sessionStorage.setItem('token', 'test-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getToken', () => {
    it('should return token when exists', () => {
      sessionStorage.setItem('token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null when token does not exist', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return user when exists', () => {
      const user = { id: '1', email: 'test@test.com', role: 'vendor' as const, name: 'Test' };
      sessionStorage.setItem('user', JSON.stringify(user));
      expect(service.getUser()).toEqual(user);
    });

    it('should return null when user does not exist', () => {
      expect(service.getUser()).toBeNull();
    });
  });

  describe('getRole', () => {
    it('should return vendor role', () => {
      sessionStorage.setItem('role', 'vendor');
      expect(service.getRole()).toBe('vendor');
    });

    it('should return client role', () => {
      sessionStorage.setItem('role', 'client');
      expect(service.getRole()).toBe('client');
    });

    it('should return null when role does not exist', () => {
      expect(service.getRole()).toBeNull();
    });
  });
});

