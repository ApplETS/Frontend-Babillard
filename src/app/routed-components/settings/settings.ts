import {
  Component,
  computed,
  effect,
  inject,
  Input,
  linkedSignal,
  OnInit,
  signal,
} from "@angular/core";
import { TranslocoDirective, TranslocoPipe, TranslocoService } from "@jsverse/transloco";
import { disabled, form, FormField, required } from "@angular/forms/signals";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { InputWrapper } from "@components/input-wrapper/input-wrapper";
import { LangSwitcher } from "@components/lang-switcher/lang-switcher";
import { ThemeSwitcher } from "@components/theme-switcher/theme-switcher";
import { AuthService } from "@services/authService/auth.service";
import { UserUpdateDTO } from "@models/userUpdateDTO.interface";
import { UserService } from "@services/userService/user.service";


type SettingsFormModel = Required<UserUpdateDTO>;

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
  private readonly userService = inject(UserService);

  readonly currentAvatarUrl = computed(() => this.userService.userInfo()?.avatarUrl ?? null);

  private readonly savedSettings = linkedSignal<SettingsFormModel>(() => {
    const user = this.userService.userInfo();
    return {
      id: user?.id ?? "",
      name: user?.name ?? "",
      email: user?.email ?? "",
      organization: user?.organization ?? "",
      activityAreaId: user?.activityArea?.id ?? "",
      fieldsOfInterests: user?.fieldsOfInterests ?? [],
      hasLoggedIn: user?.hasLoggedIn ?? true,
      profileDescription: user?.profileDescription ?? "",
      facebookLink: user?.facebookLink ?? "",
      instagramLink: user?.instagramLink ?? "",
      tikTokLink: user?.tikTokLink ?? "",
      xLink: user?.xLink ?? "",
      discordLink: user?.discordLink ?? "",
      linkedInLink: user?.linkedInLink ?? "",
      redditLink: user?.redditLink ?? "",
      webSiteLink: user?.webSiteLink ?? "",
    };
  });

  readonly profileModel = linkedSignal<SettingsFormModel>(() => ({
    ...this.savedSettings(),
  }));

  readonly settingsForm = form(this.profileModel, (path) => {
    disabled(path.email);
  });

  readonly avatarPreview = signal<string | null>(null);
  readonly isUploadingAvatar = signal(false);

  readonly isSaving = signal(false);
  readonly saveSuccess = signal(false);
  readonly saveError = signal(false);

  readonly hasChanges = computed(() => {
    const curr = this.profileModel();
    const saved = this.savedSettings();
    return (
      curr.organization !== saved.organization ||
      curr.profileDescription !== saved.profileDescription ||
      curr.facebookLink !== saved.facebookLink ||
      curr.instagramLink !== saved.instagramLink ||
      curr.tikTokLink !== saved.tikTokLink ||
      curr.xLink !== saved.xLink ||
      curr.discordLink !== saved.discordLink ||
      curr.linkedInLink !== saved.linkedInLink ||
      curr.redditLink !== saved.redditLink ||
      curr.webSiteLink !== saved.webSiteLink
    );
  });

  async onAvatarSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.avatarPreview.set(URL.createObjectURL(file));
    this.isUploadingAvatar.set(true);

    try {
      // await this.userService.updateAvatar(file);
    } finally {
      this.isUploadingAvatar.set(false);
    }
  }

  resetForm(): void {
    this.profileModel.set({ ...this.savedSettings() });
    this.saveSuccess.set(false);
    this.saveError.set(false);
  }

  async saveSettings(event: Event): Promise<void> {
    event.preventDefault();

    if (!this.hasChanges() || this.isSaving() || this.settingsForm().invalid()) {
      return;
    }

    this.isSaving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(false);

    try {
      // await this.userService.updateUserInfo(this.profileModel());
      this.saveSuccess.set(true);
    } catch {
      this.saveError.set(true);
    } finally {
      this.isSaving.set(false);
    }
  }
}
