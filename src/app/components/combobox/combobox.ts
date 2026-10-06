import { Component, input, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-combobox',
  imports: [FormField],
  templateUrl: './combobox.html',
})
export class Combobox {
  values = input.required<{ id: string; name: string }[]>();
  searchText = input<string>("");
  searchTerm = form(signal(""));
}
