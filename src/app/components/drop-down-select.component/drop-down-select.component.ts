import { CommonModule, KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronUp, faFilter } from '@fortawesome/free-solid-svg-icons';

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
  @Input({required: true}) options: KeyValue<string, boolean>[] = [];
  @Input({required: true}) title = "";
  @Output() selectedOptions = new EventEmitter<KeyValue<string, boolean>[]>();

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleOption(option: KeyValue<string, boolean>): void {
    option.value = !option.value;
    this.selectedOptions.emit(this.options.filter(o => o.value));
  }
}
