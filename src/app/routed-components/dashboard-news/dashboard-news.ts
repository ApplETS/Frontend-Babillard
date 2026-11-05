import { Component, inject, OnInit, signal } from "@angular/core";
import { Calendar } from "@components/calendar/calendar";
import { Publications } from "@components/publications/publications";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { Dashboard } from "@components/dashboard/dashboard";
import { EventsService } from "@services/dashboard.service/events.service";
import {
  ActivityAreaDisplay,
  ActivityAreaService,
} from "@services/activityAreaService/activity-area.service";
import { emptyPaginatedResponse, PaginatedResponse } from "@services/apiService/api.service";
import { Event } from "@models/event";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-dashboard-news",
  imports: [Calendar, Publications, LoadingSpinner, Dashboard],
  templateUrl: "./dashboard-news.html",
})
export class DashboardNews implements OnInit {
  eventService = inject(EventsService);
  activityAreaService = inject(ActivityAreaService);

  events = signal<PaginatedResponse<Event>>(emptyPaginatedResponse<Event>());
  activityAreas = signal<ActivityAreaDisplay[]>([]);
  selectedCardId = signal<string | null>(null);

  loading = signal(true);
  selectedAreas = signal<string[]>([]);

  constructor() {
    toObservable(this.selectedAreas).subscribe(async (selectedAreas: string[]) => {
      this.loading.set(true);
      if (selectedAreas.length > 0) {
        this.events.set(await this.eventService.getEvents(selectedAreas));
      } else {
        this.events.set(emptyPaginatedResponse<Event>());
      }

      this.loading.set(false);
    });
  }

  async ngOnInit(): Promise<void> {
    const areas = await this.activityAreaService.getActivityAreas();
    this.selectedAreas.set(areas.map((area) => area.id));
    this.activityAreas.set(areas);
  }
}
