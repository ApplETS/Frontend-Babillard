import { TestBed } from "@angular/core/testing";

import { ApprovalService } from "./approval.service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";
import { environment } from "@environments/environment";

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
});
