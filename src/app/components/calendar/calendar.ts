import { Component, signal } from '@angular/core';
import { CalendarHeader } from "@components/calendar-header/calendar-header";
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import frLocale from '@fullcalendar/core/locales/fr';
import enLocale from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timeGridDay from '@fullcalendar/timegrid';
import momentPlugin from '@fullcalendar/moment';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  imports: [CalendarHeader, FullCalendarModule],
  templateUrl: './calendar.html',
})
export class Calendar {

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
    
  }
}

export enum TimeGridType{
  month = "dayGridMonth",
  week = "timeGridWeek",
  day = "timeGridDay"
} 