import { Component, computed, input } from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { TranslocoPipe } from "@jsverse/transloco";

interface TranslatedError {
  key: string;
  params?: Record<string, unknown>;
}
type InputValue = string | number | boolean | Date | null;

@Component({
  selector: "app-input-wrapper",
  imports: [TranslocoPipe, FormField],
  templateUrl: "./input-wrapper.html",
  styles: `
    @reference "#styles.css";
    .input-bordered {
      border-color: #dcdcdc;
    }
    .input-wrapper-field input {
      @apply input border-base-content w-full;
    }
    .input-wrapper-field.invalid input {
      @apply input-error border-error;
    }
    .input-wrapper-field.disabled input {
      @apply opacity-50 cursor-not-allowed;
    }
  `,
})
export class InputWrapper {
  private static nextId = 0;
  protected readonly inputId = `app-input-wrapper-${InputWrapper.nextId++}`;

  formField = input.required<FieldTree<unknown>>();
  translationKey = input.required<string>();
  inputType = input<string>("text");

  protected inputField = computed(() => this.formField() as unknown as FieldTree<InputValue>);
  protected fieldState = computed(() => this.formField()());

  protected errorList = computed<TranslatedError[]>(() => {
    const state = this.fieldState();
    if (!state.dirty()) {
      return [];
    }

    const errors = state.errors();
    if (!errors || errors.length === 0) {
      return [];
    }
    return errors
      .filter((err) => err.message !== undefined)
      .map((err) => ({
        key: err.message!,
        params: err as unknown as Record<string, unknown>,
      }));
  });
}
