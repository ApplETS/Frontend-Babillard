import { TestBed } from "@angular/core/testing";

import { OrganizerEventService, unauthrorizedKey } from "./organizer-event.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { HttpStatusCode, provideHttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";

describe("OrganizerEventService", () => {
  let service: OrganizerEventService;
  let httpClientSpy: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), OrganizerEventService],
    });
    service = TestBed.inject(OrganizerEventService);
    httpClientSpy = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return an event when postDraft is called and error is null", async () => {
    const mockEvent = { id: "1", name: "Test Event" } as any; // Replace with actual Event type if needed

    const response = service.postDraft({} as any);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/`);
    expect(expected.request.method).toBe("POST");
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush(mockEvent);

    const result = await response;
    expect(result).toEqual(mockEvent);
  });

  it("should throw an error when postDraft is called throws an unknown exception", async () => {
    const mockError = "ERROR";

    const response = service.postDraft({} as any);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/`);
    expect(expected.request.method).toBe("POST");
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush(mockError, { status: 0, statusText: "Error" });

    await expect(response).rejects.toThrow("An unexpected error occurred.");
  });

  it("should throw an error when postDraft is called and throws a BadRequest", async () => {
    const mockError = "ERROR";

    const response = service.postDraft({} as any);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/`);
    expect(expected.request.method).toBe("POST");
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush(mockError, { status: HttpStatusCode.BadRequest, statusText: "Error" });

    await expect(response).rejects.toThrow(mockError);
  });

  it("should throw an error when postDraft is called and throws an Unauthorized", async () => {
    const mockError = "ERROR";

    const response = service.postDraft({} as any);
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/`);
    expect(expected.request.method).toBe("POST");
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush(mockError, { status: HttpStatusCode.Unauthorized, statusText: "Error" });

    await expect(response).rejects.toThrow(unauthrorizedKey);
  });

  it("should resolve to void when updateDraft is called", async () => {
    const response = service.updateDraft({} as any, "1");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/1`);
    expect(expected.request.method).toBe("PATCH");
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush(null);

    await expect(response).resolves.toBeUndefined();
  });

  it("should throw an error when updateDraft is called and an HttpErrorResponse BadRequest is thrown", async () => {
    const response = service.updateDraft({} as any, "1");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/1`);
    expect(expected.request.method).toBe("PATCH");
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush("Some error occurred", {
      status: HttpStatusCode.BadRequest,
      statusText: "Bad Request",
    });

    await expect(response).rejects.toThrow("Some error occurred");
  });

  it("should throw an error when updateDraft is called and an HttpErrorResponse Unauthaurized is thrown", async () => {
    const response = service.updateDraft({} as any, "1");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/1`);
    expect(expected.request.method).toBe("PATCH");
    expect(expected.request.body).toBeDefined();
    expect(expected.request.body).instanceOf(FormData);

    expected.flush("UNAUTHORIZED", {
      status: HttpStatusCode.Unauthorized,
      statusText: "Unauthorized",
    });

    await expect(response).rejects.toThrow(unauthrorizedKey);
  });

  it("should resolve to void when deleteEvent is called", async () => {
    const response = service.deleteEvent("1");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/1`);
    expect(expected.request.method).toBe("DELETE");

    expected.flush(null);

    await expect(response).resolves.toBeUndefined();
  });

  it("should throw an error when deleteEvent is called and an HttpErrorResponse Unauthaurized is thrown", async () => {
    const response = service.deleteEvent("1");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/1`);
    expect(expected.request.method).toBe("DELETE");

    expected.flush("UNAUTHORIZED", {
      status: HttpStatusCode.Unauthorized,
      statusText: "Unauthorized",
    });

    await expect(response).rejects.toThrow("Unable");
  });

  it("should throw an error when deleteEvent is called and an HttpErrorResponse NotFound is thrown", async () => {
    const response = service.deleteEvent("1");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/1`);
    expect(expected.request.method).toBe("DELETE");

    expected.flush("NOT FOUND", {
      status: HttpStatusCode.NotFound,
      statusText: "Not Found",
    });

    await expect(response).rejects.toThrow("Unable");
  });

  it("should throw an error when deleteEvent is called and an HttpErrorResponse other than Unauthaurized or NotFound is thrown", async () => {
    const response = service.deleteEvent("1");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const expected = httpClientSpy.expectOne(`${environment.API_URL}/api/organizer-events/1`);
    expect(expected.request.method).toBe("DELETE");

    expected.flush("INTERNAL SERVER ERROR", {
      status: HttpStatusCode.InternalServerError,
      statusText: "Internal Server Error",
    });

    await expect(response).rejects.toThrow("An unexpected error occurred.");
  });
});
