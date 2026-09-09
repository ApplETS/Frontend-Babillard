import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
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
  reloading = signal(false);
  
  loading = computed(() => this.reloading() || this.activityAreas() === null || this.events() === null);
  selectedAreas = computed(() => this.activityAreas()?.filter(area => area.selected).map(a => a.id) ?? []);

  constructor() {
    effect(async () => {
      this.reloading.set(true);
      if (this.selectedAreas().length > 0) {
        this.events.set(await this.eventService.getEvents(this.selectedAreas()));
      } else {
        this.events.set({
          data: [],
          error: null,
          pageSize: 0,
          totalRecords: 0,
          totalPages: 0
        });
      }

      this.reloading.set(false);
    });
  }

  async ngOnInit(): Promise<void> {
    this.activityAreas.set(await this.activityAreaService.getActivityAreas());
  }
}
