import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { faSignIn} from "@fortawesome/free-solid-svg-icons"
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LangSwitcher } from "@components/lang-switcher/lang-switcher";
import { TranslocoPipe } from "@jsverse/transloco";
import { ActivatedRoute, isActive, Router, RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from '@services/authService/auth.service';
import { UserType } from '@models/user-types';

type RouteInfo = {
  route: string;
  label: string;
  activeRoute: Signal<boolean>;
}

@Component({
  selector: 'app-header',
  imports: [ThemeSwitcher, FaIconComponent, LangSwitcher, TranslocoPipe, RouterLink],
  templateUrl: './header.html',
})
export class HeaderComponent implements OnInit {
  signIn = faSignIn;

  router = inject(Router);
  securityService = inject(OidcSecurityService);
  authService = inject(AuthService);

  routes = computed<RouteInfo[]>(() => {
    if (!this.authService.isAuthenticated()) {
      return [
        { route: "/", label: "Babillard", activeRoute: computed(() => false) }
      ];
    } else {
      const routesPart = [
        { route: "/", label: "dashboard.news", activeRoute: isActive("/login", this.router) },
        { route: "/posts", label: "navbar.publication", activeRoute: isActive("/posts", this.router) },
      ];

      if (this.authService.userInfo()?.type === UserType.MODERATOR) {
        routesPart.push({ route: "/approval", label: "navbar.approval", activeRoute: isActive("/approval", this.router) })
      }
      return routesPart;
    }
  });

  profilePicture = computed(() => {
    const user = this.authService.userInfo();
    return user?.avatarUrl ?? "/assets/profile_placeholder.png";
  });

  ngOnInit(): void {
    this.authService.initAuth();
  }
}
