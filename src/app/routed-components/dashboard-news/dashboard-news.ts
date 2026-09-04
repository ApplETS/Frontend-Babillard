import { Component, computed, inject, model, OnInit, signal, WritableSignal } from '@angular/core';
import { Calendar } from "@components/calendar/calendar";
import { Publications } from "@components/publications/publications";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { Dashboard } from "@components/dashboard/dashboard";
import { EventsService } from '@services/dashboard.service/events.service';
import { ActivityAreaDisplay, ActivityAreaService } from '@services/activityAreaService/activity-area.service';
import { PaginatedResponse } from '@services/apiService/api.service';
import { Event } from '@models/event';

@Component({
  selector: 'app-dashboard-news',
  imports: [Calendar, Publications, LoadingSpinner, Dashboard],
  templateUrl: './dashboard-news.html',
})
export class DashboardNews implements OnInit {
  eventService = inject(EventsService);
  activityAreaService = inject(ActivityAreaService);

  events = signal<PaginatedResponse<Event> | null>(null);
  activityAreas = signal<ActivityAreaDisplay[] | null>(null);
  selectedCardId = signal<string | null>(null);
  
  loading = computed(() => this.activityAreas() === null || this.events() === null);
  ngOnInit(): void {
    this.activityAreaService.getActivityAreas().then((areas) => {
      this.activityAreas.set(areas);
    });
    this.eventService.getEvents().then((events) => {
      this.events.set(events);
    });
  }

}
