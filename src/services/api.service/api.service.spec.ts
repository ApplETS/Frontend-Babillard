import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, provideHttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MockedObject } from 'vitest';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

@Injectable({
  providedIn: 'root'
})
export class TestApiService extends ApiService{
  protected override apiController: string = "test";

  public override getActionUrl(action: string): string {
    return super.getActionUrl(action);
  }

  public override async get<T>(action: string, routeParameters: unknown[], queryParameters: HttpParams): Promise<T> {
    return await super.get<T>(action, routeParameters, queryParameters as any);
  }
}

describe('ApiService', () => {
  let oidcSpy: any;
  let service: TestApiService;
  let httpServiceSpy: HttpTestingController;
  // beforeEach(() => {
  //   oidcSpy = {
  //     checkAuth: vi.fn().mockReturnValue(of({ isAuthenticated: true, accessToken: 'mock-token' })),
  //     authorize: vi.fn(),
  //     logoff: vi.fn().mockReturnValue(of({})),
  //     userData$: of({ name: 'Test User' })
  //   };
  //   apiSpy = {
  //     getUserInfo: vi.fn().mockResolvedValue({})
  //   };
  //   routerSpy = {};

  //   TestBed.configureTestingModule({
  //     providers: [
  //       TestApiService,
  //       { provide: OidcSecurityService, useValue: oidcSpy },
  //       provideHttpClient(),
  //       provideHttpClientTesting()
  //     ],
  //   });
  //   service = TestBed.inject(AuthService);
  //   mockHttp = TestBed.inject(HttpTestingController);
  // });


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OidcSecurityService, useValue: {} },
                provideHttpClient(),
        provideHttpClientTesting()

      ]
    });
    service = TestBed.inject(TestApiService);
    httpServiceSpy = TestBed.inject(HttpTestingController);
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
    const queryParameters = new URLSearchParams({ key: "value" });
    const expectedUrl = `${environment.API_URL}/api/test/${action}/${routeParameters.join("/")}`;

    const httpGetSpy = vi.spyOn(httpServiceSpy, "get").mockReturnValue(of("response"));
    const response = service.get<string>(action, routeParameters, queryParameters as any);

    expect(httpGetSpy).toHaveBeenCalledWith(expectedUrl, { params: queryParameters });
    await expect(response).resolves.toBe("response");
  });
});
