import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-event-data-and-image',
  imports: [TranslocoPipe],
  templateUrl: './event-data-and-image.html',
})
export class EventDataAndImage {
  @Input({ required: true }) eventStartDate!: string;
  @Input({ required: true }) eventEndDate: string | null = null;
  @Input({ required: true }) imageUrl: string | null = null;
  @Input({ required: true }) imageAlt: string | null = null;
  protected readonly EventDateStatus = EventDateStatus;
  readonly locale = "fr-CA";
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

  get formatStartDate(): Intl.DateTimeFormatOptions {
    switch (this.eventDateStatus) {
      case EventDateStatus.onlyStartDate:
        return {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };
      case EventDateStatus.withBothAndSameDay:
      case EventDateStatus.withBothAndDifferentMonth:
        return {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        };
      case EventDateStatus.withBothAndSameMonth:
        return {
          day: 'numeric',
        };
    }
  }

  get formatEndDate(): Intl.DateTimeFormatOptions {
    switch (this.eventDateStatus) {
      case EventDateStatus.withBothAndSameDay:
        return {
          hour: 'numeric',
        }
      case EventDateStatus.withBothAndSameMonth:
      case EventDateStatus.withBothAndDifferentMonth:
        return {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        };
      case EventDateStatus.onlyStartDate:
        return {};
    }
  }

  getHourMinute(date: Date): string {
    return date.toLocaleTimeString(this.locale, {
      hour: 'numeric',
      minute: 'numeric',
    });
  }
}

enum EventDateStatus {
  onlyStartDate,
  withBothAndSameDay,
  withBothAndSameMonth,
  withBothAndDifferentMonth
}
