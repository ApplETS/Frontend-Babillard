import { Component, computed, inject, input, Input, signal } from "@angular/core";
import { User } from "@models/user";
import { UserType } from "@models/user-types";
import { UserResponseDTO } from "@models/userResponseDTO.interface";
import { ThemeService } from "@services/themeService/theme.service";

@Component({
  selector: "app-avatar",
  imports: [],
  templateUrl: "./avatar.html",
})
export class Avatar {
  size = input<string>("w-10 h-10");
  textSize = input<string>("text-lg");
  color = input<string>("bg-base-100");
  user = input<User | UserResponseDTO | null>(null);

  themeService = inject(ThemeService);

  loading = signal(true);
  usePlaceholder = signal(false);
  readonly now = new Date();

  setPlaceholder() {
    this.loading.set(false);
    this.usePlaceholder.set(true);
  }

  isModerator = computed(() => this.user()?.type === UserType.MODERATOR);
}
