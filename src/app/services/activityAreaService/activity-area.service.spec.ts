import { TestBed } from '@angular/core/testing';

import { ActivityAreaService } from './activity-area.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { TranslocoService } from '@jsverse/transloco';

describe('ActivityAreaService', () => {
  let service: ActivityAreaService;
  let httpClientSpy: HttpTestingController;
  let oidcSpy: any;
  let translocoSpy: any;

  beforeEach(() => {
    oidcSpy = {
      checkAuth: vi.fn().mockReturnValue(of({ isAuthenticated: true, accessToken: 'mock-token' })),
      authenticated: vi.fn().mockReturnValue({ isAuthenticated: true, accessToken: 'mock-token' }),
      getAccessToken: vi.fn().mockReturnValue('mock-token'),
      authorize: vi.fn(),
      logoff: vi.fn().mockReturnValue(of({})),
      userData$: of({ name: 'Test User' })
    };
    translocoSpy = {
      getActiveLang: vi.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: OidcSecurityService, useValue: oidcSpy },
        { provide: TranslocoService, useValue: translocoSpy },
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

  it('should throw exception when getActivityAreas returns error', async () => {
    const expectedPath = `${environment.API_URL}/api/activity-areas/`;

    const response = service.getActivityAreas();
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse = {
      data: null,
      error: "Some error"
    };

    request.flush(mockResponse);

    await expect(response).rejects.toThrow("Some error");
  });

  it('should call getActivityAreas without term to search and return data', async () => {
    const expectedPath = `${environment.API_URL}/api/activity-areas/`;

    const response = service.getActivityAreas();
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse = {
      data: [],
      errors: null
    };

    request.flush(mockResponse);

    const result = await response;
    expect(result).toEqual([]);
  });

  it('should call getActivityAreas with term to search and return data', async () => {
    const expectedPath = `${environment.API_URL}/api/activity-areas/?search=term`;

    const response = service.getActivityAreas("term");
    const request = httpClientSpy.expectOne({
      url: expectedPath,
      method: 'GET'
    });

    const mockResponse = {
      data: [],
      errors: null
    };

    request.flush(mockResponse);
    const result = await response;
    expect(result).toEqual([]);
  });

  it('should return data with correct language', async () => {
    const expectedPath = `${environment.API_URL}/api/activity-areas/`;

    translocoSpy.getActiveLang.mockReturnValue('fr');

    const response = service.getActivityAreas();
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse = {
      data: [
        { id: '1', nameFr: 'Nom FR', nameEn: 'Name EN' }
      ],
      error: null
    };

    request.flush(mockResponse);

    const result = await response;
    expect(result).toEqual([
      { id: '1', name: 'Nom FR', selected: true }
    ]);
  });

  it('should return data with correct language when language is en', async () => {
    const expectedPath = `${environment.API_URL}/api/activity-areas/`;

    translocoSpy.getActiveLang.mockReturnValue('en');

    const response = service.getActivityAreas();
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse = {
      data: [
        { id: '1', nameFr: 'Nom FR', nameEn: 'Name EN' }
      ],
      error: null
    };

    request.flush(mockResponse);

    const result = await response;
    expect(result).toEqual([
      { id: '1', name: 'Name EN', selected: true }
    ]);
  });
  
  it('should return data with english name when language is not available', async () => {
    const expectedPath = `${environment.API_URL}/api/activity-areas/`;

    translocoSpy.getActiveLang.mockReturnValue('es'); // Spanish, which is not available
    
    const response = service.getActivityAreas();
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse = {
      data: [
        { id: '1', nameFr: 'Nom FR', nameEn: 'Name EN' }
      ],
      error: null
    };

    request.flush(mockResponse);
    
    const result = await response;
    expect(result).toEqual([
      { id: '1', name: 'Name EN', selected: true }
    ]);
  });

  afterEach(() => {
    httpClientSpy.verify();
  });
});
