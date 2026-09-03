import { TestBed } from '@angular/core/testing';

import { ActivityAreaService } from './activity-area.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';

describe('ActivityAreaService', () => {
  let service: ActivityAreaService;
  let httpClientSpy: HttpTestingController;
  let oidcSpy: any;

  beforeEach(() => {
    oidcSpy = {
      checkAuth: vi.fn().mockReturnValue(of({ isAuthenticated: true, accessToken: 'mock-token' })),
      authenticated: vi.fn().mockReturnValue({ isAuthenticated: true, accessToken: 'mock-token' }),
      getAccessToken: vi.fn().mockReturnValue('mock-token'),
      authorize: vi.fn(),
      logoff: vi.fn().mockReturnValue(of({})),
      userData$: of({ name: 'Test User' })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: OidcSecurityService, useValue: oidcSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        ActivityAreaService
      ]
    });
    service = TestBed.inject(ActivityAreaService);
    httpClientSpy = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getActivityAreas without term to search and return data', async () => {
    const expectedPath = `${environment.API_URL}/api/activity-areas/`;

    const response = service.getActivityAreas();
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse = {
      data: null,
      errors: null
    };

    request.flush(mockResponse);

    const result = await response;
    expect(result).toEqual(mockResponse);
  });

  it('should call getActivityAreas with term to search and return data', async () => {
    const expectedPath = `${environment.API_URL}/api/activity-areas/?search=term`;

    const response = service.getActivityAreas("term");
    const request = httpClientSpy.expectOne({
      url: expectedPath,
      method: 'GET'
    });

    const mockResponse = {
      data: null,
      errors: null
    };

    request.flush(mockResponse);
    const result = await response;
    expect(result).toEqual(mockResponse);
  });
});
