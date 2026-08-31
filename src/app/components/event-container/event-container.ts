import { Component, Input } from '@angular/core';

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
  };

}
