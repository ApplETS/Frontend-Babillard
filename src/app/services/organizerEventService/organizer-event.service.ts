import { HttpErrorResponse, HttpParams, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Event } from "@models/event";
import { EventState } from "@models/event-state";
import {
  ApiService,
  PaginatedResponse,
  PaginationParameters,
} from "@services/apiService/api.service";

export const unauthrorizedKey = "Unauthorized";

@Injectable({
  providedIn: "root",
})
export class OrganizerEventService extends ApiService {
  protected override apiController = "organizer-events";

  async getOrganizerEvents(
    parameters: PaginatedOrganizerEventsParameters,
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

  async postDraft(form: PostDetailsDTO): Promise<Event> {
    try {
      const response = await this.postMultipartForm<Event>(this.getActionUrl(""), form);
      return response;
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        if (e.status === HttpStatusCode.BadRequest) {
          throw new Error(e.error, { cause: e });
        } else if (e.status === HttpStatusCode.Unauthorized) {
          throw new Error(unauthrorizedKey, { cause: e });
        }
      }
      throw new Error("An unexpected error occurred.", { cause: e });
    }
  }

  async updateDraft(form: PostDetailsDTO, id: string): Promise<void> {
    try {
      await this.patchMultipartForm(this.getActionUrl(id), form);
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        if (e.status === HttpStatusCode.BadRequest) {
          throw new Error(e.error, { cause: e });
        } else if (e.status === HttpStatusCode.Unauthorized) {
          throw new Error(unauthrorizedKey, { cause: e });
        }
      }
    }
  }

  async deleteEvent(id: string): Promise<void> {
    try {
      await this.delete(this.getActionUrl(id));
    } catch (e: unknown) {
      if (e instanceof HttpErrorResponse) {
        if (e.status === HttpStatusCode.Unauthorized || e.status === HttpStatusCode.NotFound) {
          throw new Error("Unable", { cause: e });
        }
      }
      throw new Error("An unexpected error occurred.", { cause: e });
    }
  }
}

export interface PostDetailsDTO {
  image: Blob | null;
  imageUrl: string;
  title: string;
  content: string;
  publicationDate: string | null;
  eventStartDate: string | null;
  eventEndDate: string | null;
  tags: string[];
  imageAltText: string;
}

export interface PaginatedOrganizerEventsParameters extends PaginationParameters {
  startDate: string;
  endDate: string;
  activityAreas: string[];
  tags: string[];
  title: string;
  state: EventState;
}
