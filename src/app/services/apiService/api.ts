import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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
      // Utilisation de lastValueFrom pour transformer l'Observable en Promise
      const user = await lastValueFrom(
        this.httpCLient.get(`${this.apiUrl}/api/me`, { headers }),
      );
      console.log('Profil récupéré du backend:', user);
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }
}
