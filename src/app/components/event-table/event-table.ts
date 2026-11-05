import { Component, computed, inject, input, signal } from "@angular/core";
import {
  faCaretDown,
  faCaretUp,
  faClone,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Event } from "@models/event";
import { DropdownMenuItem, DropdownMenu } from "@components/dropdown-menu/dropdown-menu";
import { TranslocoService, TranslocoDirective } from "@jsverse/transloco";
import { Constants } from "@models/constants";
import { TranslocoDatePipe } from "@jsverse/transloco-locale";

type EventColumn = "title" | "eventStartDate" | "eventEndDate" | "state" | "actions" | "author";

@Component({
  selector: "app-event-table",
  imports: [DropdownMenu, TranslocoDirective, TranslocoDatePipe],
  templateUrl: "./event-table.html",
})
export class EventTable {
  events = input.required<Event[]>();

  readonly faCaretDown = faCaretDown;
  readonly faCaretUp = faCaretUp;
  readonly faTrashCan = faTrashCan;
  readonly faPencil = faPencil;
  readonly faClone = faClone;
  protected readonly newsStatuses = Constants.newsStatuses;

  translocoService = inject(TranslocoService);

  headers = computed<{ key: EventColumn; label: string }[]>(() => {
    return [
      { key: "title", label: "post.table.title" },
      { key: "author", label: "post.table.author" },
      { key: "eventStartDate", label: "post.table.begin-date" },
      { key: "eventEndDate", label: "post.table.end-date" },
      { key: "state", label: "post.table.status" },
      { key: "actions", label: "" },
    ];
  });

  readonly orderBy = signal<EventColumn | null>(null);
  readonly orderByDesc = signal(false);

  menuItems: DropdownMenuItem[] = [
    {
      id: 1,
      label: "post.menu.modify",
      icon: faPencil,
      color: "",
    },
    {
      id: 2,
      label: "post.menu.duplicate",
      icon: faClone,
      color: "",
    },
    {
      id: 3,
      label: "post.menu.delete",
      icon: faTrashCan,
      color: "text-error",
    },
  ];

  onOrderChange(column: EventColumn): void {
    if (this.orderBy() === column) {
      this.orderByDesc.update((value) => !value);
      return;
    }

    this.orderBy.set(column);
    this.orderByDesc.set(false);
  }

  handleMenuItemSelected(item: DropdownMenuItem): void {
    console.log(item);
  }
}
