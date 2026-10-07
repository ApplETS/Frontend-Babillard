import { afterNextRender, afterRenderEffect, Component, computed, input, signal, viewChild, viewChildren } from '@angular/core';
import { Combobox as NgCombobox, ComboboxInput, ComboboxPopupContainer } from '@angular/aria/combobox';
import { form, FormField } from '@angular/forms/signals';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-combobox',
  imports: [FormField, NgCombobox, Listbox, Option, ComboboxInput, ComboboxPopupContainer, OverlayModule, TranslocoDirective],
  templateUrl: './combobox.html',
  styles: `
  @reference "#styles.css";
  
  [ngListBox]>[ngOption][aria-selected="true"] {
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
  searchTerm = form(signal(""));

  listbox = viewChild<Listbox<string>>(Listbox);

  /** The options available in the listbox. */
  options = viewChildren<Option<string>>(Option);

  /** A reference to the ng aria combobox. */
  combobox = viewChild<NgCombobox<string>>(NgCombobox);

  showedValues = computed(() => this.values().filter(v => v.name.toLowerCase().includes(this.searchTerm().value().toLowerCase())))

  constructor() {
    afterNextRender(() => {
      const option = this.options().find((opt) => opt.active());
      setTimeout(() => option?.element.scrollIntoView({ block: 'nearest' }), 50);
    });

    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });
  }
}
