import { Component, Input } from '@angular/core';
import { Event } from '@models/event';

@Component({
  selector: 'app-publications',
  imports: [],
  templateUrl: './publications.html',
  styles: ``,
})
export class Publications {
  @Input({ required: true }) events: Event[] | null = [];
}
