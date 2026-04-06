import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { environment } from '@environment/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MockedObject } from 'vitest';

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
  let service: TestApiService;
  let httpServiceSpy: MockedObject<HttpClient>;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestApiService);
    httpServiceSpy = vi.mockObject(HttpClient.prototype);
    Object.defineProperty(httpServiceSpy, "httpService", { value: httpServiceSpy });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should return "${environment.apiUrl}/api/test/testAction"`, () => {
    const expectedUrl = `${environment.apiUrl}/api/test/testAction`;
    
    const actionUrl = service.getActionUrl("testAction");

    expect(actionUrl).toBe(expectedUrl);
  });

  it("should call httpService.get with the correct url and query parameters", async () => {
    const action = "testAction";
    const routeParameters = ["param1", "param2"];
    const queryParameters = new URLSearchParams({ key: "value" });
    const expectedUrl = `${environment.apiUrl}/api/test/${action}/${routeParameters.join("/")}`;

    const httpGetSpy = vi.spyOn(httpServiceSpy, "get").mockReturnValue(of("response"));
    const response = service.get<string>(action, routeParameters, queryParameters as any);

    expect(httpGetSpy).toHaveBeenCalledWith(expectedUrl, { params: queryParameters });
    await expect(response).resolves.toBe("response");
  });
});
