import { KeyValue } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject } from "@angular/core";
import { environment } from "@environment/environment";
import { lastValueFrom } from "rxjs";

export abstract class ApiService {
    protected abstract apiController: string;
    private readonly httpService = inject(HttpClient);

    protected getActionUrl(action: string): string {
        return `${environment.apiUrl}/api/${this.apiController}/${action}`;
    }

    protected async get<T>(action: string, routeParameters: unknown[], queryParameters: HttpParams): Promise<T> {
        if (!action.endsWith("/") && routeParameters.length > 0){
            action += "/";
        }

        action += routeParameters.join("/");

        return await lastValueFrom(this.httpService.get<T>(action, { params: queryParameters}));
    }
}
