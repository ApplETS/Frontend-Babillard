import { Component, Input, signal } from '@angular/core';
import { User } from '@models/user';
import { UserType } from '@models/user-types';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
})
export class Avatar {
  @Input() size: string = "w-10 h-10";
  @Input() textSize: string = "text-lg";
  @Input() color: string = "bg-base-100";
  @Input() user: User | null = null;

  isLightTheme = true;
  loading = signal(true);
  usePlaceholder = signal(false);
  readonly now = new Date();

  setPlaceholder() {
    this.loading.set(false);
    this.usePlaceholder.set(true);
  }

  get isModerator(): boolean {
    return this.user?.type === UserType.MODERATOR;
  }
}
