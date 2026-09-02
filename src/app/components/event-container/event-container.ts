import { Component, Input, model, signal } from '@angular/core';
import { EventInput } from '@fullcalendar/core/index.js';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-event-container',
  imports: [FaIconComponent],
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
      eventId?: string;
    }
  };
  selectedCardId = model.required<string | null>();
  protected readonly xmarkIcon = faXmark;

  expandViewExtra = signal(false);

  get extraDate(): string | null {
    if (this.event.extendedProps.extraEvents === undefined) {
      return null;
    }

    const event = this.event.extendedProps.extraEvents[0];
    if (event.start === undefined) {
      return null;
    }

    return (event.start.toLocaleString("fr-CA", { localeMatcher: 'best fit'}));
  }

  expandView() {
    if (this.event.extendedProps.showMore) {
      this.expandViewExtra.set(true);
    } else {
      this.selectedCardId.set(this.event.extendedProps.eventId ?? null);
    }
  }

  hideExpandedView() {
    this.expandViewExtra.set(false);
  }
}
