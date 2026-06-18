import { TestBed } from '@angular/core/testing';

import { Api } from "./api.service";
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe } from 'vitest';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: Api;
  let mockHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        Api,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(Api);
    mockHttp = TestBed.inject(HttpTestingController);
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
