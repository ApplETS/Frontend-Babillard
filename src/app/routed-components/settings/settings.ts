import { Component, computed, effect, inject, OnInit, signal } from "@angular/core";
import { TranslocoDirective, TranslocoPipe, TranslocoService } from "@jsverse/transloco";
import { disabled, form, FormField, required } from "@angular/forms/signals";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { InputWrapper } from "@components/input-wrapper/input-wrapper";
import { LangSwitcher } from "@components/lang-switcher/lang-switcher";
import { ThemeSwitcher } from "@components/theme-switcher/theme-switcher";

export interface UserSettings {
  displayName: string;
  email: string;
  language: "fr" | "en";
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
}

@Component({
  selector: "app-settings",
  imports: [
    LoadingSpinner,
    TranslocoDirective,
    InputWrapper,
    FormField,
    LangSwitcher,
    ThemeSwitcher,
  ],
  templateUrl: "./settings.html",
})
export class Settings {
  protected readonly form = form;

  // État sauvegardé (à remplacer par les données de ton service Auth/User)
  private readonly savedSettings = signal<UserSettings>({
    displayName: "Yves-Shaheem",
    email: "student@etsmtl.net",
    language: "fr",
    emailNotifications: true,
    pushNotifications: false,
    darkMode: true,
  });

  // Modèle réactif lié au Signal Form
  readonly settingsModel = signal<UserSettings>({ ...this.savedSettings() });

  // Arbre de champs (FieldTree) compatible avec ton InputWrapper
  readonly settingsForm = form(this.settingsModel, (path) => {
    required(path.displayName, { message: "validation.required" });
    disabled(path.email);
  });

  // États UI
  readonly isSaving = signal(false);
  readonly saveSuccess = signal(false);

  // Détecte si une valeur diffère de l'état sauvegardé
  readonly hasChanges = computed(() => {
    const current = this.settingsModel();
    const saved = this.savedSettings();
    return (
      current.displayName !== saved.displayName ||
      current.language !== saved.language ||
      current.emailNotifications !== saved.emailNotifications ||
      current.pushNotifications !== saved.pushNotifications ||
      current.darkMode !== saved.darkMode
    );
  });

  resetForm(): void {
    const saved = this.savedSettings();
    this.settingsModel.set({ ...saved });
    this.saveSuccess.set(false);
  }

  async saveSettings(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.hasChanges() || this.isSaving() || this.settingsForm().invalid()) {
      return;
    }

    this.isSaving.set(true);
    this.saveSuccess.set(false);

    try {
      // TODO: Remplacer par l'appel à ton service API
      await new Promise((resolve) => setTimeout(resolve, 600));

      this.savedSettings.set({ ...this.settingsModel() });
      this.saveSuccess.set(true);
    } finally {
      this.isSaving.set(false);
    }
  }
}
