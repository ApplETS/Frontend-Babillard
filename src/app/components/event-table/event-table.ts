import { Component, computed, inject, input, output } from "@angular/core";
import {
  faArrowsToEye,
  faCaretDown,
  faCaretUp,
  faClone,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Event } from "@models/event";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuItemAction,
} from "@components/dropdown-menu/dropdown-menu";
import { TranslocoService, TranslocoDirective } from "@jsverse/transloco";
import { Constants } from "@models/constants";
import { TranslocoDatePipe } from "@jsverse/transloco-locale";

type EventColumn = "title" | "eventStartDate" | "eventEndDate" | "state" | "actions" | "author";

export interface EventSelectedEvent {
  event: Event;
  action: DropdownMenuItemAction;
}

@Component({
  selector: "app-event-table",
  imports: [DropdownMenu, TranslocoDirective, TranslocoDatePipe],
  templateUrl: "./event-table.html",
})
export class EventTable {
  events = input.required<Event[]>();

  eventSelected = output<EventSelectedEvent>();

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

  menuItems: DropdownMenuItem[] = [
    {
      id: DropdownMenuItemAction.view,
      label: "post.menu.view",
      icon: faArrowsToEye,
      color: "",
    },
    {
      id: DropdownMenuItemAction.modify,
      label: "post.menu.modify",
      icon: faPencil,
      color: "",
    },
    {
      id: DropdownMenuItemAction.duplicate,
      label: "post.menu.duplicate",
      icon: faClone,
      color: "",
    },
    {
      id: DropdownMenuItemAction.delete,
      label: "post.menu.delete",
      icon: faTrashCan,
      color: "text-error",
    },
  ];

  handleMenuItemSelected(item: DropdownMenuItem, event: Event): void {
    this.eventSelected.emit({ event: event, action: item.id });
  }
}
