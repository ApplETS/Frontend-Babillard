import { Component, computed, input } from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { TranslocoPipe } from "@jsverse/transloco";

interface ErreurTraduite {
  cle: string;
  params?: Record<string, unknown>;
}
type ValeurInput = string | number | boolean | Date | null;

interface ValidationErrorShape {
  kind?: string;
  type?: string;
  message?: string;
  minLength?: number;
  maxLength?: number;
  requiredLength?: number;
  min?: number;
  max?: number;
}
@Component({
  selector: "app-input-wrapper",
  imports: [TranslocoPipe, FormField],
  templateUrl: "./input-wrapper.html",
})
export class InputWrapper {
  champFormulaire = input.required<FieldTree<unknown>>();
  cleTraduction = input.required<string>();
  typeChamp = input<string>("text");
  private static nextId = 0;
  protected readonly inputId = `app-input-wrapper-${InputWrapper.nextId++}`;

  protected champPourInput = computed(
    () => this.champFormulaire() as unknown as FieldTree<ValeurInput>,
  );

  protected fieldState = computed(() => this.champFormulaire()());

  protected estRequis = computed(() => {
    const state = this.fieldState() as { required?: () => boolean };
    return Boolean(state.required?.());
  });

  protected listeErreurs = computed<ErreurTraduite[]>(() => {
    const state = this.fieldState();

    if (!state.dirty()) {
      return [];
    }

    const errors = state.errors();
    if (!errors || errors.length === 0) {
      return [];
    }

    return errors.map((err) => this.mapErreurVersTraduction(err));
  });

  private mapErreurVersTraduction(error: ValidationErrorShape): ErreurTraduite {
    const typeErreur = error.kind ?? error.type ?? "unknown";

    switch (typeErreur) {
      case "required":
        return { cle: "input-wrapper.erreurs.requis" };
      case "email":
        return { cle: "input-wrapper.erreurs.email" };
      case "minLength":
      case "minlength":
        return {
          cle: "input-wrapper.erreurs.minLength",
          params: { minLength: error.minLength ?? error.requiredLength },
        };
      case "maxLength":
      case "maxlength":
        return {
          cle: "input-wrapper.erreurs.maxLength",
          params: { maxLength: error.maxLength ?? error.requiredLength },
        };
      case "min":
        return {
          cle: "input-wrapper.erreurs.min",
          params: { min: error.min },
        };
      case "max":
        return {
          cle: "input-wrapper.erreurs.max",
          params: { max: error.max },
        };
      case "pattern":
        return { cle: "input-wrapper.erreurs.pattern" };
      default:
        return {
          cle: error.message || "input-wrapper.erreurs.inconnue",
        };
    }
  }
}
