import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {ThemeService} from '../../services/themeService/theme-service';

@Component({
  selector: 'app-theme-switcher',
  imports: [FormsModule],
  templateUrl: './theme-switcher.html',
})
export class ThemeSwitcher {
  public themeService = inject(ThemeService);
}
