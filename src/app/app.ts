import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LangSwitcher } from './components/lang-switcher/lang-switcher';
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher';
import { OidcSecurityService, UserDataResult } from 'angular-auth-oidc-client';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Api } from './services/apiService/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeSwitcher, TranslocoPipe, LangSwitcher, AsyncPipe],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('Babillard-Frontend');
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private api = inject(Api);
  private accessToken: string | undefined;
  userData = this.oidcSecurityService.userData$;

  ngOnInit() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken, userData, idToken }) => {
      console.log('Est authentifié :', isAuthenticated);
      console.log('Access Token :', accessToken);
      console.log('Data :', idToken);
      this.accessToken = accessToken;
      // this.api.getUserInfo(idToken).then(r => console.log(r));
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe();
  }
  getData(){
    this.api.getUserInfo(this.accessToken).then(r => console.log(r));
  }
}
