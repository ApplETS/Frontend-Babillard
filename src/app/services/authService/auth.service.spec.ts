import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Api } from '../apiService/api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let oidcSpy: any;
  let apiSpy: any;
  let routerSpy: any;

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
        { provide: Api, useValue: apiSpy },
        { provide: Router, useValue: routerSpy }
      ],
    });
    service = TestBed.inject(AuthService);
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
});
