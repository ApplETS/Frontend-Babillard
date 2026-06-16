import { Component } from '@angular/core';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { faSignIn} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LangSwitcher } from "@components/lang-switcher/lang-switcher";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
  selector: 'app-header',
  imports: [ThemeSwitcher, FontAwesomeModule, LangSwitcher, TranslocoPipe],
  templateUrl: './header.html',
})
export class HeaderComponent {
  signIn = faSignIn;
}
