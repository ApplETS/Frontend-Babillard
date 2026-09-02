import { Component, Input, model, signal } from '@angular/core';
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
      eventId: string;
    }
  };
  selectedCardId = model.required<string | null>();
  protected readonly xmarkIcon = faXmark;

  expandViewExtra = signal(false);

}
