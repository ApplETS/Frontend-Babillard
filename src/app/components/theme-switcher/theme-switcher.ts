import { Component, model, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-switcher',
  imports: [FormsModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css',
})
export class ThemeSwitcher {
  persistent_theme = localStorage.getItem('theme');
  isDark = model(this.persistent_theme === 'dark');
  constructor() {
    effect(() => {
        const currentTheme = this.isDark() ? 'dark' : 'light';
        if (currentTheme) document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === "dark") {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', currentTheme);
    })
  }
}
