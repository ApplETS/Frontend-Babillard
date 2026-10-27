import { CommonModule } from "@angular/common";
import { Component, computed, input, signal } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { Event } from "@models/event";

type EventColumn = "title" | "eventStartDate" | "eventEndDate" | "state";

@Component({
  selector: "app-event-table",
  imports: [CommonModule, FaIconComponent],
  templateUrl: "./event-table.html",
})
export class EventTable {
  events = input.required<Event[]>();

  readonly faCaretDown = faCaretDown;
  readonly faCaretUp = faCaretUp;
  readonly headers: ReadonlyArray<{ key: EventColumn; label: string }> = [
    { key: "title", label: "Titre" },
    { key: "eventStartDate", label: "Début" },
    { key: "eventEndDate", label: "Fin" },
    { key: "state", label: "État" },
  ];

  readonly orderBy = signal<EventColumn | null>(null);
  readonly orderByDesc = signal(false);

  readonly sortedEvents = computed(() => {
    const column = this.orderBy();
    const events = [...this.events()];

    if (!column) {
      return events;
    }

    const direction = this.orderByDesc() ? -1 : 1;
    return events.sort((left, right) => {
      const leftValue = String(left[column] ?? "");
      const rightValue = String(right[column] ?? "");
      return leftValue.localeCompare(rightValue, undefined, { numeric: true }) * direction;
    });
  });

  onOrderChange(column: EventColumn): void {
    if (this.orderBy() === column) {
      this.orderByDesc.update((value) => !value);
      return;
    }

    this.orderBy.set(column);
    this.orderByDesc.set(false);
  }
}
