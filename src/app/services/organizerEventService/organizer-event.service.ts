import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PostDetailsForm } from "@components/post-details/post-details";
import { Event } from "@models/event";
import { EventState } from "@models/event-state";
import { Response } from "@models/response";
import { ApiService, PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";

@Injectable({
  providedIn: "root",
})
export class OrganizerEventService extends ApiService {
  protected override apiController = "organizer-events";

  async getOrganizerEvents(parameters: PaginatedOrganizerEventsParameters): Promise<PaginatedResponse<Event>> {
    const response = await this.get<PaginatedResponse<Event>>(this.getActionUrl(""), [], new HttpParams({
      fromObject: {
        ...parameters
      }
    }));
    return response;
  }

  async postDraft(form: PostDetailsForm): Promise<Event> {
    const response = await this.postMultipartForm<Response<Event, string>>(
      this.getActionUrl(""),
      form,
    );
    if (response.error) {
      throw new Error(response.error);
    } else {
      return response.data!;
    }
  }

  async updateDraft(form: PostDetailsForm, id: string) {
    console.log(id);
    console.log(form);
    return false;
  }
}

export interface PaginatedOrganizerEventsParameters extends PaginationParameters {
  startDate: string;
  endDate: string;
  activityAreas: string[];
  tags: string[];
  title: string;
  state: EventState;
}
