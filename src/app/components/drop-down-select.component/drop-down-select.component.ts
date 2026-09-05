import { CommonModule, KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, input, Input, model, Output, signal } from '@angular/core';
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

  private eRef = inject(ElementRef);
  isDropdownOpen = signal(false);
  options = model.required<Option[]>();
  @Input({required: true}) title = "";

  toggleDropdown(): void {
    this.isDropdownOpen.update((value) => !value);
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

  @HostListener('document:click', ['$event'])
  clickListener(event: MouseEvent): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }
}
