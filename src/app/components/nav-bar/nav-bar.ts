import { Component, inject, signal } from '@angular/core';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { TranslocoPipe } from '@jsverse/transloco';
import { LangSwitcher } from '../lang-switcher/lang-switcher';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [ThemeSwitcher, TranslocoPipe, LangSwitcher, AsyncPipe, NgOptimizedImage],
  templateUrl: './nav-bar.html',
})
export class NavBar {
  protected readonly authService = inject(AuthService);

  ngOnInit() {
    this.authService.initAuth();
  }
}
