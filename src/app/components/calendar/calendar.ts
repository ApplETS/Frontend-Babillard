import { Component, signal, ViewChild, effect } from '@angular/core';
import { CalendarHeader } from "@components/calendar-header/calendar-header";
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timeGridDay from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

@Component({
  selector: 'app-calendar',
  imports: [CalendarHeader, FullCalendarModule],
  templateUrl: './calendar.html',
})
export class Calendar {

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;
  
  view = signal(TimeGridType.month);
  options: CalendarOptions = {
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
  };
  selectedCalendarDate = moment(Date.now());
  
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