import { Component, ElementRef, input, model, viewChild } from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faMagnifyingGlass, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
  selector: "app-search",
  imports: [FaIconComponent, TranslocoPipe],
  templateUrl: "./search.html",
})
export class Search implements FormValueControl<string> {
  value = model.required<string>();
  placeholder = input<string>("");
  inputElement = viewChild.required<ElementRef<HTMLInputElement>>("input");

  focus(options?: FocusOptions): void {
    this.inputElement().nativeElement.focus(options);
  }

  protected readonly faSearch = faMagnifyingGlass;
  protected readonly faCancel = faXmarkCircle;
}
