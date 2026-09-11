import { Component, computed, inject } from '@angular/core';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { faSignIn} from "@fortawesome/free-solid-svg-icons"
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LangSwitcher } from "@components/lang-switcher/lang-switcher";
import { TranslocoPipe } from "@jsverse/transloco";
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ThemeSwitcher, FaIconComponent, LangSwitcher, TranslocoPipe],
  templateUrl: './header.html',
})
export class HeaderComponent {
  signIn = faSignIn;

  router = inject(Router);

  routes = computed(() => {
    return [];
  })
}
