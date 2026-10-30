import { Component, input, model } from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";

@Component({
  selector: "app-boolean-select",
  imports: [],
  templateUrl: "./boolean-select.html",
})
export class BooleanSelect implements FormValueControl<boolean> {
  value = model.required<boolean>();
  falseLabel = input<string>("No");
  trueLabel = input<string>("Yes");

  setValue(event: Event) {
    this.value.set((event.target as HTMLSelectElement).value === "true");
  }
}
