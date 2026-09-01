import { Component, Input } from '@angular/core';
import { EventInput } from '@fullcalendar/core/index.js';

@Component({
  selector: 'app-event-container',
  imports: [],
  templateUrl: './event-container.html',
})
export class EventContainer {
  @Input({ required: true }) isMonthView: boolean = false;
  @Input({ required: true }) event!: {
    publicId: string;
    title: string;
    extendedProps: {
      showMore?: boolean;
      extraEvents?: EventInput[];
    }
  };
}
