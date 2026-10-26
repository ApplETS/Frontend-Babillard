import { TestBed } from "@angular/core/testing";

import { ApiService } from "./api.service";
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, vi } from 'vitest';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class TestApiService extends ApiService {
  protected override apiController = "test";

  public override getActionUrl(action: string): string {
    return super.getActionUrl(action);
  }

  public override async get<T>(
    action: string,
    routeParameters: unknown[],
    queryParameters: HttpParams,
  ): Promise<T> {
    return await super.get<T>(action, routeParameters, queryParameters);
  }

  public override async post<T>(action: string, body: unknown, routeParameters: unknown[], queryParameters: HttpParams): Promise<T> {
    return await super.post<T>(action, body, routeParameters, queryParameters);
  }

  public override async postMultipartForm<T>(action: string, body: any, routeParameters: unknown[], queryParameters: HttpParams): Promise<T> {
    return await super.postMultipartForm<T>(action, body, routeParameters, queryParameters);
  }
}

describe('ApiService', () => {
  let service: TestApiService;
  let httpServiceSpy: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(TestApiService);
    httpServiceSpy = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpServiceSpy.verify();
  });

  it("should be created", () => {
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
    const queryParameters = new HttpParams().set("key", "value");
    const expectedUrl = `${environment.API_URL}/api/test/${action}/${routeParameters.join("/")}`;
    const responsePromise = service.get<string>(
      service.getActionUrl(action),
      routeParameters,
      queryParameters,
    );

    // get() is async (it awaits the access token before firing the HTTP call), so let pending microtasks resolve first.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const req = httpServiceSpy.expectOne((request) => {
      return (
        request.method === "GET" &&
        request.url === expectedUrl &&
        request.params.get("key") === "value"
      );
    }, "GET request");

    req.flush("response");

    await expect(responsePromise).resolves.toBe("response");
  });

  it("should call httpService.post with the correct url, body, and query parameters", async () => {
    const action = "testAction";
    const routeParameters = ["param1", "param2"];
    const queryParameters = new HttpParams().set('key', 'value');
    const body = { data: "test" };
    const expectedUrl = `${environment.API_URL}/api/test/${action}/${routeParameters.join("/")}`;
    const responsePromise = service.post<string>(service.getActionUrl(action), body, routeParameters, queryParameters);

    // post() is async (it awaits the access token before firing the HTTP call), so let pending microtasks resolve first.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const req = httpServiceSpy.expectOne((request) => {
      return request.method === 'POST' && request.url === expectedUrl && request.params.get('key') === 'value';
    }, "POST request");

    req.flush("response");

    await expect(responsePromise).resolves.toBe("response");
  });

  it("should call httpService.postMultipartForm with the correct url, body, and query parameters", async () => {
    const action = "testAction";
    const routeParameters = ["param1", "param2"];
    const queryParameters = new HttpParams().set('key', 'value');
    const body = {
      data: "test"
    };
    const expectedUrl = `${environment.API_URL}/api/test/${action}/${routeParameters.join("/")}`;
    const responsePromise = service.postMultipartForm<string>(service.getActionUrl(action), body, routeParameters, queryParameters);

    // postMultipartForm() is async (it awaits the access token before firing the HTTP call), so let pending microtasks resolve first.
    await new Promise((resolve) => setTimeout(resolve, 0));

    const req = httpServiceSpy.expectOne((request) => {
      return request.method === 'POST' && request.url === expectedUrl && request.params.get('key') === 'value' && request.body instanceof FormData;
    }, "POST request");

    req.flush("response");

    await expect(responsePromise).resolves.toBe("response");
  });

});
