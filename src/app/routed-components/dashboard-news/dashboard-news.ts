import { Component, inject, model, signal } from '@angular/core';
import { Calendar } from "@components/calendar/calendar";
import { Publications } from "@components/publications/publications";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { Dashboard } from "@components/dashboard/dashboard";
import { EventsService } from '@services/dashboard.service/events.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-news',
  imports: [Calendar, Publications, LoadingSpinner, Dashboard, AsyncPipe],
  templateUrl: './dashboard-news.html',
})
export class DashboardNews {
  eventService = inject(EventsService);

  events = this.eventService.getEvents();
  selectedCardId = signal<string | null>(null);
}
