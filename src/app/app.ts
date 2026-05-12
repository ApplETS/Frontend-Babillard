import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LangSwitcher } from './components/lang-switcher/lang-switcher';
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeSwitcher,TranslocoPipe, LangSwitcher],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('Babillard-Frontend');
}
