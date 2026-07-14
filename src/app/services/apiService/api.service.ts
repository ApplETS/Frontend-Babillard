import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserResponseDTO } from '../../../models/userResponseDTO.interface';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = environment.API_URL;
  private httpCLient = inject(HttpClient);

  public async getUserInfo(accessToken: string | undefined) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    try {
      const res = await lastValueFrom(
        this.httpCLient.get<{data: UserResponseDTO, error: any}>(`${this.apiUrl}/me`, { headers }),
      );
      console.log('Profil récupéré du backend:', res.data);
      return res.data;
    } catch (error) {
      console.error('API.TS: Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }
}
