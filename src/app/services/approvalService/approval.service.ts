import { HttpErrorResponse, HttpParams, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EventState } from "@models/event-state";
import { ApiService, PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";
import { Event as ModelEvent } from "@models/event";

@Injectable({
  providedIn: "root",
})
export class ApprovalService extends ApiService {
  protected override apiController = "moderator-events";

  async getApprovalEvents(
    parameters: PaginatedApprovalEventsParameters,
  ): Promise<PaginatedResponse<ModelEvent>> {
    const response = await this.get<PaginatedResponse<ModelEvent>>(
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

  async setApprovalEventStatus(eventId: string, status: EventState, refusalReason = ""): Promise<void> {
    try {
      await this.patch<void>(
        this.getActionUrl(`${eventId}/state`),
        null,
        [],
        new HttpParams({
          fromObject: {
            status,
            refusalReason,
          },
        }),
      );
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        if (e.status === HttpStatusCode.BadRequest) {
          throw new Error(e.error, { cause: e });
        }
      }

      throw new Error("An unexpected error occurred.", { cause: e });
    }
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
