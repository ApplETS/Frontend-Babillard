import { Component, inject, input } from "@angular/core";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { faSignIn, faGear, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LangSwitcher } from "@components/lang-switcher/lang-switcher";
import { TranslocoPipe } from "@jsverse/transloco";
import { RouterLink } from "@angular/router";
import { AuthService } from "@services/authService/auth.service";
import { RouteInfo } from "@models/routeInfo.interface";

@Component({
  selector: "app-header-mobile",
  imports: [ThemeSwitcher, FaIconComponent, LangSwitcher, TranslocoPipe, RouterLink],
  templateUrl: "./header-mobile.html",
})
export class HeaderMobile {
  authService = inject(AuthService);

  routes = input.required<RouteInfo[]>();
  organization = input.required<string | undefined>();
  area = input.required<string>();
  profilePicture = input.required<string>();

  signIn = faSignIn;
  readonly gear = faGear;
  readonly signOut = faSignOut;
}
