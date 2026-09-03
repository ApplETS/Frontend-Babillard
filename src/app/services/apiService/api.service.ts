import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
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

  /**
   * Fetches data from the API via the GET method and adds the access token to the request headers if the user is authenticated.
   * @template T Type of the data to be returned
   * @param action The endpoint's action to call
   * @param routeParameters Parameters to add to the endpoint path
   * @param queryParameters Parameters to add to the endpoint as query parameters
   * @returns T type result from the API
   */
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

  /**
   * Fetches a paginated response from the API via the GET method.
   * @template T Type of the data in the paginated response
   * @param action Action to access
   * @param pageNumber Page number to paginated list
   * @param pageSize Page size of paginated list
   * @param routeParameters Parameters to append to the path
   * @returns A PaginatedResponse of type T
   * @see get<T>
   * @see PaginatedResponse<T>
   */
  protected async getPaginated<T>(action: string, pageNumber: number, pageSize: number, ...routeParameters: unknown[]) {
    return await this.get<PaginatedResponse<T>>(action, routeParameters, new HttpParams({
      fromObject: {
        page: pageNumber,
        pageSize: pageSize,
      }
    }));
  }
}

/**
 * Represents a paginated response from the API.
 * @template T Type of the data in the paginated response
 * @property {T[]} data The data returned from the API
 */
export interface PaginatedResponse<T> {
  data: T[];
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  error: string | null;
}
