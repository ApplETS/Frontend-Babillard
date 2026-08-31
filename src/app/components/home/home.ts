import { Component, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LangSwitcher } from '../lang-switcher/lang-switcher';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/authService/auth.service';

@Component({
  selector: 'app-home',
  imports: [ThemeSwitcher, TranslocoPipe, LangSwitcher, AsyncPipe],
  templateUrl: './home.html',
})

export class Home {
  protected readonly title = signal('Babillard-Frontend');
  protected readonly authService = inject(AuthService);

  ngOnInit() {
    this.authService.initAuth();
  }
}
