import { Injectable } from '@angular/core';
import { ApiService, PaginatedResponse } from '@services/apiService/api.service';
import { Event } from '@models/event';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends ApiService {
  protected override apiController: string = "events";

  async getEvents(): Promise<PaginatedResponse<Event>> {
    return await this.getPaginated<Event>(this.getActionUrl(""), 1, 1000);
  } 
}
