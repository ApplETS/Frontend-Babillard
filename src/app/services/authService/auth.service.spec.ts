import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '@environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let oidcSpy: any;
  let apiSpy: any;
  let routerSpy: any;
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    oidcSpy = {
      checkAuth: vi.fn().mockReturnValue(of({ isAuthenticated: true, accessToken: 'mock-token' })),
      authorize: vi.fn(),
      logoff: vi.fn().mockReturnValue(of({})),
      userData$: of({ name: 'Test User' })
    };
    apiSpy = {
      getUserInfo: vi.fn().mockResolvedValue({})
    };
    routerSpy = {};

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OidcSecurityService, useValue: oidcSpy },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(AuthService);
    mockHttp = TestBed.inject(HttpTestingController);
  });

  it('should initialize authentification', () => {
    service.initAuth();

    expect(oidcSpy.checkAuth).toHaveBeenCalled();
    expect(service.isAuthenticated()).toBe(true);
    expect(service.accessToken()).toBe('mock-token');
    expect(apiSpy.getUserInfo).toHaveBeenCalledWith('mock-token');
  });

  it('should handle login', () => {
    service.login();
    expect(oidcSpy.authorize).toHaveBeenCalled();
  });

    it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getUserInfo', () => {

    it('should return data on success', async () => {
      const mockToken = 'fake-token';
      const mockResponse = {
        data: { id: 1, name: 'John Doe' },
        error: null
      };

      // Trigger the service method
      const promise = service.getUserInfo(mockToken);

      // Expect a GET request to the specific URL
      const req = mockHttp.expectOne(`${environment.API_URL}/me`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

      // Provide the mock response
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failure', async () => {
      const mockToken = 'fake-token';

      const promise = service.getUserInfo(mockToken);

      const req = mockHttp.expectOne(`${environment.API_URL}/me`);

      // Simulate a 404 error
      req.error(new ProgressEvent('Error'), { status: 404, statusText: 'Not Found' });

      await expect(promise).rejects.toThrow();
    });
  })

});
