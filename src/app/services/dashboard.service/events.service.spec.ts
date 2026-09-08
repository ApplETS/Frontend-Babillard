import { TestBed } from '@angular/core/testing';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { EventsService } from './events.service';

describe('EventService', () => {
  let service: EventsService;
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
        EventsService
      ]
    });
    service = TestBed.inject(EventsService);
    httpClientSpy = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return events and call without activityTags', async () => {
    const expectedPath = `${environment.API_URL}/api/events/?pageNumber=1&pageSize=1000`;
   
    const response = service.getEvents([]);
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
