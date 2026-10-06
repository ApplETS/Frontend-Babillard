import { TestBed } from '@angular/core/testing';

import { TagService } from './tag-service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '@environments/environment.development';

describe('TagService', () => {
  let service: TagService;
  let httpClient: HttpTestingController;
  const url = `${environment.API_URL}/api/tags/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TagService);
    httpClient = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tags', async () => {
    const tags = service.getAllTags();

    const req = httpClient.expectOne(url);
    req.flush({ error: null, data: [] });

    const result = await tags;
    expect(result).toBeTruthy();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should throw an error when the request fails', async () => {
    const tags = service.getAllTags();

    const req = httpClient.expectOne(url);
    req.flush({ error: 'Failed to fetch tags', data: null });

    await expect(tags).rejects.instanceOf(Error);
    await expect(tags).rejects.toThrow('Failed to fetch tags');
  });
});
