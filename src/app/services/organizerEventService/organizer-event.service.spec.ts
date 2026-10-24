import { TestBed } from "@angular/core/testing";

import { OrganizerEventService } from "./organizer-event.service";
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

describe('OrganizerEventService', () => {
  let service: OrganizerEventService;
  let httpClientSpy: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        OrganizerEventService
      ]
    });
    service = TestBed.inject(OrganizerEventService);
    httpClientSpy = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should return an event when postDraft is called and error is null", async () => {
    const mockEvent = { error: null, data: {id: "1", name: "Test Event"} } as any; // Replace with actual Event type if needed
    
    const response = service.postDraft({} as any);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-event/`);
    expect(expected.request.method).toBe('POST');
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush(mockEvent);

    const result = await response;
    expect(result).toEqual(mockEvent.data);
  });

  it("should throw an error when postDraft is called and error is not null", async () => {
    const mockError = { data: null, error: "Some error occurred" } as any; // Replace with actual Error type if needed

    const response = service.postDraft({} as any);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-event/`);
    expect(expected.request.method).toBe('POST');
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush(mockError);

    await expect(response).rejects.toThrow("Some error occurred");
  });
});
