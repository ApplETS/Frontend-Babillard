import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EventState } from "@models/event-state";
import { ApiService, PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";

@Injectable({
  providedIn: "root",
})
export class ApprovalService extends ApiService {
  protected override apiController = "moderator-events";

    async getApprovalEvents(
    parameters: PaginatedApprovalEventsParameters,
  ): Promise<PaginatedResponse<Event>> {
    const response = await this.get<PaginatedResponse<Event>>(
      this.getActionUrl(""),
      [],
      new HttpParams({
        fromObject: {
          ...parameters,
        },
      }),
    );
    return response;
  }
}

export interface PaginatedApprovalEventsParameters extends PaginationParameters {
  startDate: string;
  endDate: string;
  activityAreas: string[];
  tags: string[];
  title: string;
  state: EventState;
}
