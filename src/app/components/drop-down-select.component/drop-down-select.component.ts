import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  Signal,
  signal,
} from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faChevronUp, faFilter } from "@fortawesome/free-solid-svg-icons";

interface Option {
  id: string;
  name: Signal<string>;
}

@Component({
  selector: "app-drop-down-select",
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: "./drop-down-select.component.html",
})
export class DropDownSelectComponent implements FormValueControl<string[]> {
  readonly chevronDown = faChevronDown;
  readonly chevronUp = faChevronUp;
  readonly filter = faFilter;

  value = model.required<string[]>();

  private eRef = inject(ElementRef);
  isDropdownOpen = signal(false);
  options = input.required<Option[] | null>();
  title = input.required<string>();

  toggleDropdown(): void {
    this.isDropdownOpen.update((value) => !value);
  }

  toggleOption(id: string): void {
    this.value.update((toggledOptions) => {
      const option = toggledOptions.includes(id);
      if (!option) {
        return toggledOptions.concat(id);
      } else {
        return toggledOptions.filter((optionId) => optionId !== id);
      }
    });
  }

  @HostListener("document:click", ["$event"])
  clickListener(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }
}
