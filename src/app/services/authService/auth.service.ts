import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from '@services/apiService/api.service';
import { UserResponseDTO } from '@models/userResponseDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  protected override apiController: string = "me";

  public isAuthenticated = signal<boolean>(false);
  public accessToken = signal<string | undefined>(undefined);
  public userInfo = signal<UserResponseDTO | undefined>(undefined);

  public initAuth() {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken }) => {
      console.log('--- [AuthService] checkAuth ---');
      console.log('Est authentifié :', isAuthenticated);

      this.isAuthenticated.set(isAuthenticated);
      this.accessToken.set(accessToken);

      if (isAuthenticated && accessToken) {
        this.getUserInfo();
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
      this.userInfo.set(res.data);
      return res.data;
    } catch (error) {
      console.error('auth.service.ts: Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

}
