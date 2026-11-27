import { Injectable, signal } from "@angular/core";
import { UserResponseDTO } from "@models/userResponseDTO.interface";
import { ApiService } from "@services/apiService/api.service";

@Injectable({
  providedIn: "root",
})
export class UserService extends ApiService {
  protected override apiController: string = "me";
  public userInfo = signal<UserResponseDTO | undefined>(undefined);

  public async getUserInfo() {
    try {
      const res = await this.get<{ data: UserResponseDTO; error: string }>(this.getActionUrl(""));
      console.log("Profil récupéré du backend:", res.data);
      this.userInfo.set(res.data);
      return res.data;
    } catch (error) {
      console.error("auth.service.ts: Erreur lors de la récupération du profil:", error);
      throw error;
    }
  }
}
