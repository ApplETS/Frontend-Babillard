import { Injectable } from '@angular/core';
import { ApiService, PaginatedResponse } from '@services/apiService/api.service';
import { Event } from '@models/event';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends ApiService {
  protected override apiController: string = "events";

  async getEvents(activityAreasId: string[]): Promise<PaginatedResponse<Event>> {
    return await this.get<PaginatedResponse<Event>>(this.getActionUrl(""), [], new HttpParams({
      fromObject: {
        pageNumber: 1,
        pageSize: 1000,
        activityAreas: activityAreasId,
      }
    }));
  } 
}
