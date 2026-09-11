import { Component, inject, Input } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TranslocoDatePipe } from '@jsverse/transloco-locale';

@Component({
  selector: 'app-event-data-and-image',
  imports: [TranslocoPipe, TranslocoDatePipe],
  templateUrl: './event-data-and-image.html',
})
export class EventDataAndImage {
  @Input({ required: true }) eventStartDate!: string;
  @Input({ required: true }) eventEndDate: string | null = null;
  @Input({ required: true }) imageUrl: string | null = null;
  @Input({ required: true }) imageAlt: string | null = null;
  protected readonly EventDateStatus = EventDateStatus;
  translocoService = inject(TranslocoService);

  get startDate(): Date {
    return new Date(this.eventStartDate);
  }

  get endDate(): Date | null {
    return this.eventEndDate ? new Date(this.eventEndDate) : null;
  }
  
  get eventDateStatus(): EventDateStatus {
    if (!this.eventEndDate) {
      return EventDateStatus.onlyStartDate;
    }

    if (this.startDate.getFullYear() !== this.endDate?.getFullYear()) {
      return EventDateStatus.withBothAndDifferentMonth;
    } else if (this.startDate.getMonth() === this.endDate?.getMonth() && this.startDate.getDate() === this.endDate?.getDate()) {
      return EventDateStatus.withBothAndSameDay;
    } else {
      return EventDateStatus.withBothAndSameMonth;
    }
  }
}

enum EventDateStatus {
  onlyStartDate,
  withBothAndSameDay,
  withBothAndSameMonth,
  withBothAndDifferentMonth
}
