import { inject, Injectable, signal } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ApiService } from '@services/apiService/api.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserResponseDTO } from '@models/userResponseDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  protected override apiController: string = "me";
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
        this.getUserInfo().then();
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

  public async getUserInfo() {
    try {
      const res = await 
        this.get<{data: UserResponseDTO, error: any}>(this.getActionUrl(""));
      console.log('Profil récupéré du backend:', res.data);
      return res.data;
    } catch (error) {
      console.error('auth.service.ts: Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

}
