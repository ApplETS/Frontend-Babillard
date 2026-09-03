import { Component, inject, model, OnInit, signal } from '@angular/core';
import { Calendar } from "@components/calendar/calendar";
import { Publications } from "@components/publications/publications";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { Dashboard } from "@components/dashboard/dashboard";
import { EventsService } from '@services/dashboard.service/events.service';
import { AsyncPipe } from '@angular/common';
import { ActivityAreaDisplay, ActivityAreaService } from '@services/activityAreaService/activity-area.service';

@Component({
  selector: 'app-dashboard-news',
  imports: [Calendar, Publications, LoadingSpinner, Dashboard, AsyncPipe],
  templateUrl: './dashboard-news.html',
})
export class DashboardNews implements OnInit {
  eventService = inject(EventsService);
  activityAreaService = inject(ActivityAreaService);

  events = this.eventService.getEvents();
  activityAreas = signal<ActivityAreaDisplay[]>([]);
  selectedCardId = signal<string | null>(null);

  ngOnInit(): void {
    this.activityAreaService.getActivityAreas().then((areas) => {
      this.activityAreas.set(areas);
    });
  }
}
