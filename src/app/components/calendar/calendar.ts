import { Component, signal, ViewChild, effect, Input, model, computed } from '@angular/core';
import { CalendarHeader } from "@components/calendar-header/calendar-header";
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventSourceInput } from '@fullcalendar/core/index.js';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timeGridDay from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { PaginatedResponse } from '@services/apiService/api.service';
import { Event } from '@models/event';
import { EventContainer } from "@components/event-container/event-container";
import { ActivityAreaDisplay } from '@services/activityAreaService/activity-area.service';

@Component({
  selector: 'app-calendar',
  imports: [CalendarHeader, FullCalendarModule, EventContainer],
  templateUrl: './calendar.html',
})
export class Calendar {
  private readonly eventTreshold = 2; // Number of events to show before "Show more" appears
	readonly colors = ['#E7A455', '#EA7CB7', '#06B6D4', '#64C788', '#EA7CB7', '#848BDB'];

  activityAreas = model<ActivityAreaDisplay[] | null>(null);

  availableAreas = computed(() => this.activityAreas() ?? []);

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;

  view = signal(TimeGridType.month);
  readonly TimeGridType = TimeGridType;
  options = signal<CalendarOptions>({
    locales: [frLocale, enLocale],
    locale: "fr",
    height: "100%",
    headerToolbar: false,
    initialView: this.view(),
    viewClassNames: () => {
      return ["rounded-lg", "border", "border-gray-300", "overflow-hidden"];
    },
    plugins: [dayGridPlugin, interactionPlugin, momentPlugin, timeGridPlugin, timeGridDay],
    eventTimeFormat: {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    },
    eventDisplay: "block",
    eventOrder: "start",
    eventClassNames: ["mb-3"],
    dayMaxEvents: this.eventTreshold,
  });
  selectedCalendarDate = moment(Date.now());
  private _events: PaginatedResponse<Event> | null = null;
  @Input({ required: true })
  set events(value: PaginatedResponse<Event> | null) {
    this._events = value;
    this.updateShownEvents();
  }

  get events(): PaginatedResponse<Event> | null {
    return this._events;
  }

  shownEvents = signal<EventSourceInput>([]);
  selectedCardId = model<string | null>(null);

  constructor() {
    effect(() => {
      const currentView = this.view();
      if (this.calendarComponent) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.changeView(currentView);
      }

      this.updateShownEvents();
    });
  }

  calendarChange(action: CalendarAction): void {
    const calendarApi = this.calendarComponent.getApi();
    switch (action){
      case CalendarAction.previous:
        calendarApi.prev();
        break;
      case CalendarAction.next:
        calendarApi.next();
        break;
      case CalendarAction.today:
        calendarApi.today();
        break;
    }
    this.selectedCalendarDate = moment(calendarApi.getDate());
  }

  private get calendarEvents(): EventInput[] {
    return this.events?.data.flatMap((event) => {
      const start = moment(event.eventStartDate);
      const end = moment(event.eventEndDate);

      // If dates are invalid (or end precedes start), keep a single fallback event.
      if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
        return [{
          id: event.id,
          title: event.title,
          start: event.eventStartDate,
          end: event.eventEndDate,
          extendedProps: {
            eventId: event.id,
          },
        }];
      }

      const daySegments = [];
      const currentDay = start.clone().startOf('day');
      const lastDay = end.clone().startOf('day');

      while (currentDay.isSameOrBefore(lastDay, 'day')) {
        const isFirstDay = currentDay.isSame(start, 'day');
        const isLastDay = currentDay.isSame(end, 'day');
        const segmentStart = isFirstDay ? start.clone() : currentDay.clone();
        const segmentEnd = isLastDay ? end.clone() : currentDay.clone().endOf('day');

        daySegments.push({
          id: `${currentDay.format('YYYY-MM-DD')}-${event.id}`,
          title: event.title,
          start: segmentStart.toISOString(),
          end: segmentEnd.toISOString(),
          extendedProps: {
            eventId: event.id,
          },
          color: this.colors[this.availableAreas()?.findIndex((activityArea) => activityArea.id == event.organizer?.activityArea?.id)]
        });

        currentDay.add(1, 'day');
      }

      return daySegments;
    }) ?? [];
  }

  private updateShownEvents(): void {
    this.shownEvents.set(this.calendarEvents);
  }

  selectEvent(arg: any): void {
    this.selectedCardId.set(arg.extendedProps.eventId);
  }
}

export enum TimeGridType{
  month = "dayGridMonth",
  week = "timeGridWeek",
  day = "timeGridDay"
} 

export enum CalendarAction {
  previous = "prev",
  next = "next",
  today = "today"
}