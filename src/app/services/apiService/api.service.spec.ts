import { TestBed } from '@angular/core/testing';

import { ApiService, PaginatedResponse } from "./api.service";
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, vi } from 'vitest';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestApiService extends ApiService{
  protected override apiController: string = "test";

  public override getActionUrl(action: string): string {
    return super.getActionUrl(action);
  }

  public override async get<T>(action: string, routeParameters: unknown[], queryParameters: HttpParams): Promise<T> {
    return await super.get<T>(action, routeParameters, queryParameters);
  }

  public override async getPaginated<T>(action: string, pageNumber: number, pageSize: number, ...routeParameters: unknown[]): Promise<PaginatedResponse<T>> {
    return await super.getPaginated<T>(action, pageNumber, pageSize, ...routeParameters);
  }
}

describe('ApiService', () => {
  let oidcSpy: any;
  let service: TestApiService;
  let httpServiceSpy: HttpTestingController;

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
        TestApiService,
        { provide: OidcSecurityService, useValue: oidcSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(TestApiService);
    httpServiceSpy = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpServiceSpy.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should return "${environment.API_URL}/api/test/testAction"`, () => {
    const expectedUrl = `${environment.API_URL}/api/test/testAction`;
    
    const actionUrl = service.getActionUrl("testAction");

    expect(actionUrl).toBe(expectedUrl);
  });

  it("should call httpService.get with the correct url and query parameters", async () => {
    const action = "testAction";
    const routeParameters = ["param1", "param2"];
    const queryParameters = new HttpParams().set('key', 'value');
    const expectedUrl = `${environment.API_URL}/api/test/${action}/${routeParameters.join("/")}`;
    const responsePromise = service.get<string>(service.getActionUrl(action), routeParameters, queryParameters);

    const req = httpServiceSpy.expectOne((request) => {
      return request.method === 'GET' && request.url === expectedUrl && request.params.get('key') === 'value';
    }, "GET request");

    req.flush("response");

    await expect(responsePromise).resolves.toBe("response");
  });

  it("should call httpService.get with the correct url and query parameters for getPaginated", async () => {
    const action = "testAction";
    const pageNumber = 1;
    const pageSize = 10;
    const routeParameters = ["param1", "param2"];
    const expectedUrl = `${environment.API_URL}/api/test/${action}/${routeParameters.join("/")}`;
    const responsePromise = service.getPaginated<string>(service.getActionUrl(action), pageNumber, pageSize, ...routeParameters);

    const req = httpServiceSpy.expectOne((request) => {
      return request.method === 'GET' && request.url === expectedUrl && request.params.get('page') === pageNumber.toString() && request.params.get('pageSize') === pageSize.toString();
    }, "GET request for getPaginated");

    const response = {
      data: ["item1", "item2"],
      pageSize: pageSize,
      totalRecords: 2,
      totalPages: 1,
      error: null
    };
    req.flush(response);

    await expect(responsePromise).resolves.toEqual(response);
  });
});
