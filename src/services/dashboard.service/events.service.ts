import { Injectable } from '@angular/core';
import { ApiService, PaginatedResponse } from '@services/api.service/api.service';
import { Event } from '@models/event';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends ApiService {
  protected override apiController: string = "events";

  async getEvents(): Promise<PaginatedResponse<Event>> {
    return await this.get<PaginatedResponse<Event>>(this.getActionUrl(""), [], new HttpParams());
  } 
}
