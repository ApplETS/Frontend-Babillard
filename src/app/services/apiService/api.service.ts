import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class ApiService {
  protected abstract apiController: string;
  private readonly httpService = inject(HttpClient);

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

    console.log("Route parameters:", routeParameters.join("/"));
    
    if (routeParameters.length > 0) {
      action += routeParameters.join("/");
    }
    console.log(action);

    return await lastValueFrom(this.httpService.get<T>(action, { params: queryParameters }));
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
