import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LangSwitcher } from './components/lang-switcher/lang-switcher';
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeSwitcher, TranslocoPipe, LangSwitcher, JsonPipe, AsyncPipe],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('Babillard-Frontend');
  private readonly oidcSecurityService = inject(OidcSecurityService);
  userData = this.oidcSecurityService.userData$;

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, userData }) => {
      console.log('Est authentifié :', isAuthenticated);
      console.log('Données utilisateur :', userData);
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe();
  }
}
