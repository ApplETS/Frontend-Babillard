import { Component, Input, model, signal } from '@angular/core';
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
  selectedCardId = model.required<string | null>();
  expandView() {
    if (this.event.extendedProps.showMore) {
      this.expandViewExtra.set(true);
    } else {
      this.selectedCardId.set(this.event.extendedProps.eventId ?? null);
    }
  }
}
