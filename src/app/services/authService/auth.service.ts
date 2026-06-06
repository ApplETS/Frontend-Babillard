import { inject, Injectable, signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Api } from '../apiService/api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly oidcSecurityService = inject(OidcSecurityService);
  private api: Api = inject(Api);
  private router = inject(Router);

  public isAuthenticated = signal<boolean>(false);
  public accessToken = signal<string | undefined>(undefined);
  public userData$ = this.oidcSecurityService.userData$;

  public initAuth() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken }) => {
      console.log('--- [AuthService] checkAuth ---');
      console.log('Est authentifié :', isAuthenticated);

      this.isAuthenticated.set(isAuthenticated);
      this.accessToken.set(accessToken);

      if (isAuthenticated && accessToken) {
        this.api.getUserInfo(accessToken).then();
      }
    });
  }

  public login() {
    this.oidcSecurityService.authorize();
  }

  public logout() {
    this.oidcSecurityService.logoff().subscribe(() => {
      this.isAuthenticated.set(false);
      this.accessToken.set(undefined);
    });
  }
}
