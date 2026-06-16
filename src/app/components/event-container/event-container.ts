import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-container',
  imports: [],
  templateUrl: './event-container.html',
  styles: ``,
})
export class EventContainer {
  @Input({ required: true }) isMonthView: boolean = false;
}
