import { Component, signal, ViewChild, effect, inject, Input, model } from '@angular/core';
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
  });
  selectedCalendarDate = moment(Date.now());
  @Input({ required: true }) events: PaginatedResponse<Event> | null = null;
  selectedCardId = model<string | null>(null);
  private readonly eventTreshold = 2; // Number of events to show before "Show more" appears

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
        });

        currentDay.add(1, 'day');
      }

      return daySegments;
    }) ?? [];
  }

  get shownEvents(): EventSourceInput {
    let events: EventInput[] = [];
    const sortedEvents = this.calendarEvents.sort((a, b) => {
      const startA = moment(a.start);
      const startB = moment(b.start);
      return startA.diff(startB);
    });

    while (sortedEvents.length > 0) {
      const eventsOfDay = sortedEvents.filter((e) => moment(e.start).isSame(moment(sortedEvents[0].start), 'day'));

      if (this.view() !== TimeGridType.month || eventsOfDay.length <= this.eventTreshold) {
        events = events.concat(eventsOfDay);
      } else {
        events = events.concat(eventsOfDay.slice(0, this.eventTreshold));
        events.push({
          title: "Show more +",
          backgroundColor: "gray",
          start: moment(sortedEvents[0].start).toISOString(),
          end: moment(sortedEvents[0].start).add(1, "second").toISOString(),
          extendedProps: {
            showMore: eventsOfDay.length > this.eventTreshold,
            extraEvents: eventsOfDay.slice(this.eventTreshold, eventsOfDay.length)
          }
        });
      }
      sortedEvents.splice(0, eventsOfDay.length);
    }

    return events;
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