import { Component, Input, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { Event } from '@models/event';

@Component({
  selector: 'app-publications',
  imports: [FontAwesomeModule],
  templateUrl: './publications.html',
  styles: `
    .selected {
      @apply scale-[1.07] transition-all z-10 duration-350;
    }

    .notSelected {
      @apply scale-100 opacity-[80%] transition-all duration-350;
    }
  `,
})
export class Publications {
  @Input({ required: true }) events: Event[] | null = [];
  selectedCard = model<number | null>(null);

  readonly faDownLeftAndUpRightToCenter = faDownLeftAndUpRightToCenter;
  readonly faUpRightAndDownLeftFromCenter = faUpRightAndDownLeftFromCenter;
}
