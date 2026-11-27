import { inject, Injectable, signal } from "@angular/core";
import { ApiService } from "@services/apiService/api.service";
import { UserResponseDTO } from "@models/userResponseDTO.interface";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { UserService } from "@services/userService/user.service";

@Injectable({
  providedIn: "root",
})
export class AuthService extends ApiService {
  protected override apiController = "me";
  oidcSecurityService = inject(OidcSecurityService);
  private readonly userService = inject(UserService);
  public isAuthenticated = signal<boolean>(false);
  public accessToken = signal<string | undefined>(undefined);
  public userInfo = signal<UserResponseDTO | undefined>(undefined);

  public initAuth() {
    this.oidcSecurityService.checkAuth().subscribe(async ({ isAuthenticated, accessToken }) => {
      console.log("--- [AuthService] checkAuth ---");
      console.log("Est authentifié :", isAuthenticated);

      this.isAuthenticated.set(isAuthenticated);
      this.accessToken.set(accessToken);

      if (isAuthenticated && accessToken) {
        await this.userService.getUserInfo();
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
