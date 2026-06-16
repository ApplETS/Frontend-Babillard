import { Component, signal, ViewChild, effect, inject, Input, model } from '@angular/core';
import { CalendarHeader } from "@components/calendar-header/calendar-header";
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventSourceInput } from '@fullcalendar/core/index.js';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timeGridDay from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { EventsService } from '@services/dashboard.service/events.service';
import { PaginatedResponse } from '@services/api.service/api.service';
import { Event } from '@models/event';
import { EventContainer } from "@components/event-container/event-container";

@Component({
  selector: 'app-calendar',
  imports: [CalendarHeader, FullCalendarModule, EventContainer],
  templateUrl: './calendar.html',
})
export class Calendar {

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;

  view = signal(TimeGridType.month);
  readonly TimeGridType = TimeGridType;
  options = signal<CalendarOptions>({
    locales: [frLocale, enLocale],
    locale: "fr",
    height: "100%",
    headerToolbar: false,
    initialView: this.view(),
    events: [
      { title: 'event 1', date: '2024-06-01' },
      { title: 'event 2', date: '2024-06-02' }
    ],
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
  });
  selectedCalendarDate = moment(Date.now());
  @Input({ required: true }) events: PaginatedResponse<Event> | null = null;
  
  constructor() {
    effect(() => {
      const currentView = this.view();
      if (this.calendarComponent) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.changeView(currentView);
      }
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

  get calendarEvents(): EventSourceInput {
    return this.events?.data.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.eventStartDate,
      end: event.eventEndDate,
      date: new Date(event.eventStartDate),
    })) ?? [];
  }

  get shownEvents(): Event[] {
    return [];
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