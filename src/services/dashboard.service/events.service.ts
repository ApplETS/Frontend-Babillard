import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service/api.service';
import { Event } from '@models/event';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventsService extends ApiService {
  protected override apiController: string = "events";

  async getEvents(): Promise<Event[]> {
    return await this.get<Event[]>("getEvents", [], new HttpParams());
  } 
}
