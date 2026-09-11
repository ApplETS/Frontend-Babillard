import { TestBed } from '@angular/core/testing';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { of } from 'rxjs';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { EventsService } from './events.service';
import { PaginatedResponse } from '@services/apiService/api.service';
import { Event } from '@models/event';

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

  it('should return events and call without activityArea', async () => {
    const expectedPath = `${environment.API_URL}/api/events/?pageNumber=1&pageSize=1000`;
   
    const response = service.getEvents([]);
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse: PaginatedResponse<Event> = {
      data: [
        { id: '1', title: 'Event 1', content: 'Content 1', imageUrl: 'url1', imageAltText: 'alt1', eventStartDate: '2024-01-01', eventEndDate: '2024-01-02', organizer: null, tags: [{id: "tag1", name: "tag", createdAt: "", updatedAt: ""}] }
      ],
      pageSize: 1000,
      totalRecords: 1,
      totalPages: 1,
      error: null
    };

    request.flush(mockResponse);
    
    const result = await response;
    expect(result).toEqual(mockResponse);
  });

  it('should return events and call with single activityArea', async () => {
    const activityAreas = ['tag1'];
    const expectedPath = `${environment.API_URL}/api/events/?pageNumber=1&pageSize=1000&activityAreas=tag1`;

    const response = service.getEvents(activityAreas);
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse: PaginatedResponse<Event> = {
      data: [
        { id: '1', title: 'Event 1', content: 'Content 1', imageUrl: 'url1', imageAltText: 'alt1', eventStartDate: '2024-01-01', eventEndDate: '2024-01-02', organizer: null, tags: [{id: "tag1", name: "tag", createdAt: "", updatedAt: ""}] }
      ],
      error: null,
      pageSize: 1000,
      totalRecords: 1,
      totalPages: 1
    };

    request.flush(mockResponse);

    const result = await response;
    expect(result).toEqual(mockResponse);
  });

    it('should return events and call with multiple activityAreas', async () => {
    const activityAreas = ['tag1', 'tag2'];
    const expectedPath = `${environment.API_URL}/api/events/?pageNumber=1&pageSize=1000&activityAreas=tag1&activityAreas=tag2`;

    const response = service.getEvents(activityAreas);
    const request = httpClientSpy.expectOne(expectedPath);
    expect(request.request.method).toBe('GET');

    const mockResponse: PaginatedResponse<Event> = {
      data: [
        { id: '1', title: 'Event 1', content: 'Content 1', imageUrl: 'url1', imageAltText: 'alt1', eventStartDate: '2024-01-01', eventEndDate: '2024-01-02', organizer: null, tags: [{id: "tag1", name: "tag", createdAt: "", updatedAt: ""}] }
      ],
      error: null,
      pageSize: 1000,
      totalRecords: 1,
      totalPages: 1
    };

    request.flush(mockResponse);

    const result = await response;
    expect(result).toEqual(mockResponse);
  });

  afterEach(() => {
    httpClientSpy.verify();
  });
});
