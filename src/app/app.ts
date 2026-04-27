import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LangSwitcher } from './components/lang-switcher/lang-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslocoPipe, LangSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Babillard-Frontend');
}
