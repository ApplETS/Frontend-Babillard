import { TestBed } from "@angular/core/testing";

import { ApprovalService } from "./approval.service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";
import { environment } from "@environments/environment";
import { EventState } from "@models/event-state";

describe("ApprovalService", () => {
  let service: ApprovalService;
  let httpClient: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ApprovalService);
    httpClient = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return a paginated response when getApprovalEvents is called", async () => {
    const mockResponse = {
      data: [{ id: "1", name: "Test Event" }] as any[], // Replace with actual Event type if needed
      total: 1,
      page: 1,
      pageSize: 10
    };

    const parameters = { page: 1, pageSize: 10 } as any; // Replace with actual PaginatedApprovalEventsParameters type if needed

    const responsePromise = service.getApprovalEvents(parameters);

    const req = httpClient.expectOne(`${environment.API_URL}/api/moderator-events/?page=1&pageSize=10`);
    expect(req.request.method).toBe("GET");
    expect(req.request.body).toBeNull();
    req.flush(mockResponse);

    const result = await responsePromise;
    expect(result).toEqual(mockResponse);
  });

  it("should call /api/moderator-events/{eventId}/state when setApprovalEventStatus is called", async () => {
    const eventId = "1";
    const status = EventState.Approved;
    
    const responsePromise = service.setApprovalEventStatus(eventId, status);

    const req = httpClient.expectOne(`${environment.API_URL}/api/moderator-events/${eventId}/state?status=${status}&refusalReason=`);
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toBeNull();
    expect(req.request.params.get("status")).toBe(status);
    expect(req.request.params.get("refusalReason")).toBe("");
    req.flush({});

    const response = await responsePromise;
    expect(response).toBeUndefined();
  });

  it("should call /api/moderator-events/{eventId}/state with refusalReason when setApprovalEventStatus is called with a refusal reason", async () => {
    const eventId = "1";
    const status = EventState.Denied;
    const refusalReason = "Not suitable";

    const responsePromise = service.setApprovalEventStatus(eventId, status, refusalReason);

    const req = httpClient.expectOne(`${environment.API_URL}/api/moderator-events/${eventId}/state?status=${status}&refusalReason=${encodeURIComponent(refusalReason)}`);
    expect(req.request.method).toBe("PATCH");
    expect(req.request.body).toBeNull();
    expect(req.request.params.get("status")).toBe(status);
    expect(req.request.params.get("refusalReason")).toBe(refusalReason);
    req.flush({});

    const response = await responsePromise;
    expect(response).toBeUndefined();
  });

  it("should throw an error when setApprovalEventStatus receives a BadRequest response", async () => {
    const eventId = "1";
    const status = EventState.Denied;

    const responsePromise = service.setApprovalEventStatus(eventId, status);

    const req = httpClient.expectOne(`${environment.API_URL}/api/moderator-events/${eventId}/state?status=${status}&refusalReason=`);
    expect(req.request.method).toBe("PATCH");
    req.flush("Bad Request", { status: 400, statusText: "Bad Request" });

    await expect(responsePromise).rejects.toThrow("Bad Request");
  });

  it("should throw an error when setApprovalEventStatus receives an unexpected error", async () => {
    const eventId = "1";
    const status = EventState.Denied;

    const responsePromise = service.setApprovalEventStatus(eventId, status);

    const req = httpClient.expectOne(`${environment.API_URL}/api/moderator-events/${eventId}/state?status=${status}&refusalReason=`);
    expect(req.request.method).toBe("PATCH");
    req.error(new ProgressEvent("Unexpected error"));

    await expect(responsePromise).rejects.toThrow("An unexpected error occurred.");
  });
});
