import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  input,
  model,
  output,
  signal,
  viewChild,
  viewChildren,
} from "@angular/core";
import {
  Combobox as NgCombobox,
  ComboboxInput,
  ComboboxPopupContainer,
} from "@angular/aria/combobox";
import { Listbox, Option, ɵɵComboboxDialog } from "@angular/aria/listbox";
import { OverlayModule } from "@angular/cdk/overlay";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-combobox",
  imports: [
    NgCombobox,
    Listbox,
    Option,
    ComboboxInput,
    ComboboxPopupContainer,
    OverlayModule,
    TranslocoDirective,
    ɵɵComboboxDialog,
    TranslocoPipe,
  ],
  templateUrl: "./combobox.html",
  styles: `
    @reference "#styles.css";

    [ngListBox] > [ngOption][aria-selected="true"] {
      background-color: var(--color-base-300);
    }

    [ngCombobox]:has([data-expanded="false"]) .menu {
      @apply hidden;
    }
  `,
})
export class Combobox {
  values = input.required<{ id: string; name: string }[]>();
  placeholder = input<string>("");

  valueChanged = output<string | null>();
  value = model<string | null>(null);

  searchTerm = signal("");
  listbox = viewChild<Listbox<string>>(Listbox);
  options = viewChildren<Option<string>>(Option);
  combobox = viewChild<NgCombobox<string>>(NgCombobox);

  showedValues = computed(() =>
    this.values().filter((v) => v.name.toLowerCase().includes(this.searchTerm().toLowerCase())),
  );
  selectedValue = computed(
    () => this.values().find((v) => v.id === this.value())?.name ?? this.placeholder(),
  );

  protected readonly faSearch = faSearch;
  constructor() {
    afterNextRender(() => {
      const option = this.options().find((opt) => opt.active());
      setTimeout(() => option?.element.scrollIntoView({ block: "nearest" }), 50);
    });

    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);
      }
    });
  }

  setValue(newValue: string[]) {
    if (newValue.length === 0) return;
    this.value.set(newValue.at(0)!);
    this.combobox()?.close();
    this.valueChanged.emit(this.value());
  }

  reset() {
    this.searchTerm.set("");
    this.value.set(null);
    this.options()
      .filter((opt) => opt.active())
      .forEach((opt) => (opt.element.ariaSelected = "false"));
  }
}
