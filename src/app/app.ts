import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LangSwitcher } from './components/lang-switcher/lang-switcher';
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher';
import { HeaderComponent } from "@components/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('Babillard-Frontend');
}
