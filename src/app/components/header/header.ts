import { Component } from '@angular/core';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { faSignIn} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-header',
  imports: [ThemeSwitcher, FontAwesomeModule],
  templateUrl: './header.html',
})
export class HeaderComponent {
  signIn = faSignIn;
}
