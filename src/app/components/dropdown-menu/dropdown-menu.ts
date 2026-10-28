import { Component, input, output, signal } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { TranslocoPipe, TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: "app-dropdown-menu",
  imports: [FaIconComponent, TranslocoDirective],
  templateUrl: "./dropdown-menu.html",
})
export class DropdownMenu {
  readonly faEllipsisVertical = faEllipsisVertical;
  dropdownOpened = signal(false);

  items = input.required<DropdownMenuItem[]>();
  menuItemSelected = output<DropdownMenuItem>();

  selectMenuItem(item: DropdownMenuItem) {
    this.menuItemSelected.emit(item);
    this.dropdownOpened.set(false);
  }
}

export interface DropdownMenuItem {
  id: number;
  label: string;
  icon: any;
  color: string;
}
