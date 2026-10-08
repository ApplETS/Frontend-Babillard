import { afterNextRender, afterRenderEffect, Component, computed, input, output, signal, viewChild, viewChildren } from '@angular/core';
import { Combobox as NgCombobox, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-combobox',
  imports: [NgCombobox, Listbox, Option, ComboboxInput, ComboboxPopupContainer, OverlayModule, TranslocoDirective],
  templateUrl: './combobox.html',
  styles: `
  @reference "#styles.css";
  
  [ngListBox]>[ngOption][aria-selected="true"] {
    @apply bg-base-300;
  }

  [ngOption]:hover {
    @apply bg-base-200;
  }

  [ngCombobox]:has([aria-expanded='false']) .menu {
    @apply hidden;
  }
  `
})
export class Combobox {
  values = input.required<{ id: string; name: string }[]>();
  placeholder = input<string>("");

  valueChanged = output<string>();

  searchTerm = signal("");
  listbox = viewChild<Listbox<string>>(Listbox);
  options = viewChildren<Option<string>>(Option);
  combobox = viewChild<NgCombobox<string>>(NgCombobox);

  showedValues = computed(() => this.values().filter(v => v.name.toLowerCase().includes(this.searchTerm().toLowerCase())))

  constructor() {
    afterNextRender(() => {
      const option = this.options().find((opt) => opt.active());
      setTimeout(() => option?.element.scrollIntoView({ block: 'nearest' }), 50);
    });

    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
        const option = this.options().find((opt) => opt.active());
        if (option !== undefined) {
          this.valueChanged.emit(option.value());
        }
      }
    });
  }

  resetInput() {
    this.searchTerm.set("");
  }
}
