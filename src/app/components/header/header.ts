import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import { faSignIn, faGear, faSignOut } from "@fortawesome/free-solid-svg-icons"
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LangSwitcher } from "@components/lang-switcher/lang-switcher";
import { TranslocoPipe, TranslocoService } from "@jsverse/transloco";
import { ActivatedRoute, isActive, Router, RouterLink } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from '@services/authService/auth.service';
import { UserType } from '@models/user-types';
import { ImgWithPlaceholder } from '@components/img-with-placeholder/img-with-placeholder';
import { Avatar } from '@components/avatar/avatar';
import { User } from '@models/user';

type RouteInfo = {
  route: string;
  label: string;
  activeRoute: Signal<boolean>;
}

@Component({
  selector: 'app-header',
  imports: [ThemeSwitcher, FaIconComponent, LangSwitcher, TranslocoPipe, RouterLink, ImgWithPlaceholder, Avatar],
  templateUrl: './header.html',
})
export class HeaderComponent implements OnInit {
  signIn = faSignIn;
  readonly gear = faGear;
  readonly signOut = faSignOut;

  router = inject(Router);
  securityService = inject(OidcSecurityService);
  authService = inject(AuthService);
  translocoService = inject(TranslocoService);
  dropdownToggled = signal(false);

  routes = computed<RouteInfo[]>(() => {
    if (!this.authService.isAuthenticated()) {
      return [
        { route: "/", label: "Babillard", activeRoute: computed(() => false) }
      ];
    } else {
      const routesPart = [
        { route: "/", label: "dashboard.news", activeRoute: isActive("/dashboard/news", this.router) },
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

  organization = computed(() => {
    const user = this.authService.userInfo();
    if (!user) {
      return "";
    }

    return user.type?.match(UserType.MODERATOR) ? this.translocoService.translate("moderator") : user.organization;
  });

  area = computed(() => {
    const user = this.authService.userInfo();
    if (!user) {
      return "";
    }

    if (this.translocoService.activeLang() === "fr") {
      return user.activityArea?.nameFr ?? "";
    }
    return user?.activityArea?.nameEn ?? "";
  });
}
