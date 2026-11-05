import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher";
import {
  faSignIn,
  faGear,
  faSignOut,
  faBars,
  faNewspaper,
  faPenToSquare,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { LangSwitcher } from "@components/lang-switcher/lang-switcher";
import { TranslocoPipe, TranslocoService } from "@jsverse/transloco";
import { isActive, Router, RouterLink } from "@angular/router";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { AuthService } from "@services/authService/auth.service";
import { UserType } from "@models/user-types";
import { Avatar } from "@components/avatar/avatar";
import { RouteInfo } from "@models/routeInfo.interface";
import { NgTemplateOutlet } from "@angular/common";

@Component({
  selector: "app-header",
  imports: [
    ThemeSwitcher,
    FaIconComponent,
    LangSwitcher,
    TranslocoPipe,
    RouterLink,
    Avatar,
    NgTemplateOutlet,
  ],
  templateUrl: "./header.html",
})
export class HeaderComponent implements OnInit {
  signIn = faSignIn;
  readonly gear = faGear;
  readonly signOut = faSignOut;
  readonly faBars = faBars;
  router = inject(Router);
  securityService = inject(OidcSecurityService);
  authService = inject(AuthService);
  translocoService = inject(TranslocoService);
  dropdownToggled = signal(false);

  routes = computed<RouteInfo[]>(() => {
    if (!this.authService.isAuthenticated()) {
      return [
        { route: "/", label: "Babillard", activeRoute: computed(() => false), icon: faNewspaper },
      ];
    } else {
      const routesPart = [
        {
          route: "/",
          label: "dashboard.news",
          activeRoute: isActive("/dashboard/news", this.router),
          icon: faNewspaper,
        },
        {
          route: "/posts",
          label: "navbar.publication",
          activeRoute: isActive("/posts", this.router),
          icon: faPenToSquare,
        },
      ];

      if (this.authService.userInfo()?.type?.match(UserType.MODERATOR)) {
        routesPart.push({
          route: "/approval",
          label: "navbar.approval",
          activeRoute: isActive("/approval", this.router),
          icon: faListCheck,
        });
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

    return user.type?.match(UserType.MODERATOR)
      ? this.translocoService.translate("moderator")
      : user.organization;
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
