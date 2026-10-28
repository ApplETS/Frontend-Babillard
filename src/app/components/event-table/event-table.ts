import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, signal } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCaretDown, faCaretUp, faClone, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Event } from "@models/event";
import { DropDownSelectComponent } from "@components/drop-down-select.component/drop-down-select.component";
import { DropdownMenuItem, DropdownMenu } from "@components/dropdown-menu/dropdown-menu";
import { TranslocoService } from "@jsverse/transloco";

type EventColumn = "title" | "eventStartDate" | "eventEndDate" | "state" | "actions";

@Component({
  selector: "app-event-table",
  imports: [CommonModule, FaIconComponent, DropDownSelectComponent, DropdownMenu],
  templateUrl: "./event-table.html",
})
export class EventTable {
  events = input.required<Event[]>();

  readonly faCaretDown = faCaretDown;
  readonly faCaretUp = faCaretUp;
  readonly faTrashCan = faTrashCan;
  readonly faPencil = faPencil;
  readonly faClone = faClone;

  translocoService = inject(TranslocoService);

  headers = computed<{ key: EventColumn; label: string }[]>(() => {
    return [
      { key: "title", label: "Titre" },
      { key: "eventStartDate", label: "Début" },
      { key: "eventEndDate", label: "Fin" },
      { key: "state", label: "État" },
      { key: "actions", label: "Actions" },
    ];
  });

  readonly orderBy = signal<EventColumn | null>(null);
  readonly orderByDesc = signal(false);

  menuItems: DropdownMenuItem[] = [
		{
			id: 1,
			label: 'post.menu.modify',
			icon: faPencil,
			color: '',
		},
		{
			id: 2,
			label: 'post.menu.duplicate',
			icon: faClone,
			color: '',
		},
		{
			id: 3,
			label: 'post.menu.delete',
			icon: faTrashCan,
			color: 'text-error',
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

  }
}
