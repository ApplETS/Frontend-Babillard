import { HttpClient, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "@environments/environment";
import { lastValueFrom } from "rxjs";

export abstract class ApiService {
    protected abstract apiController: string;
    private readonly httpService = inject(HttpClient);

    protected getActionUrl(action: string): string {
        return `${environment.API_URL}/api/${this.apiController}/${action}`;
    }

    protected async get<T>(action: string, routeParameters: unknown[], queryParameters: HttpParams): Promise<T> {
        if (!action.endsWith("/") && routeParameters.length > 0){
            action += "/";
        }

        action += routeParameters.join("/");

        return await lastValueFrom(this.httpService.get<T>(action, { params: queryParameters}));
    }
}

export interface PaginatedResponse<T> {
    data: T[];
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    error: string | null;
}
