import { CommonModule, KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronUp, faFilter } from '@fortawesome/free-solid-svg-icons';

type Option = { id: string, name: string, selected: boolean };

@Component({
  selector: 'app-drop-down-select',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './drop-down-select.component.html',
})
export class DropDownSelectComponent {
  readonly chevronDown = faChevronDown;
  readonly chevronUp = faChevronUp;
  readonly filter = faFilter;

  isDropdownOpen = false;
  options = model.required<Option[]>();
  @Input({required: true}) title = "";
  // @Output() selectedOptions = new EventEmitter<KeyValue<string, boolean>[]>();

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleOption(id: string): void {
    this.options.update((options) => {
      if (!options) return [];
      const option = options.find(o => o.id === id);
      if (!option) return options;
      option.selected = !option.selected;
      return [...options];
    });
  }
}
