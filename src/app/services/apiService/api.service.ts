import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserResponseDTO } from '@models/userResponseDTO.interface';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService {
  protected abstract apiController: string;
  private readonly httpService = inject(HttpClient);
  protected readonly oidcSecurityService = inject(OidcSecurityService);

  protected getActionUrl(action: string): string {
    return `${environment.API_URL}/api/${this.apiController}/${action}`;
  }

  protected async get<T>(action: string, routeParameters: unknown[] = [], queryParameters: HttpParams = new HttpParams()): Promise<T> {
    if (!action.endsWith("/") && routeParameters.length > 0) {
      action += "/";
    }

    action += routeParameters.join("/");
    const headers = new HttpHeaders({});

    if (this.oidcSecurityService.authenticated().isAuthenticated) {
      const accessToken = this.oidcSecurityService.getAccessToken();
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return await lastValueFrom(this.httpService.get<T>(action, { params: queryParameters, headers: headers }));
  }
}

export interface PaginatedResponse<T> {
  data: T[];
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  error: string | null;
}
