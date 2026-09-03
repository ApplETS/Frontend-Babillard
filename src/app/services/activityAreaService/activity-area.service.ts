import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ActivityAreaResponseDTOResponse } from '@models/activityAreaResponseDTOResponse.interface';
import { ApiService } from '@services/apiService/api.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityAreaService extends ApiService {
  override apiController: string = "activity-areas";
  private translationService = inject(TranslocoService);

  public async getActivityAreas(search?: string): Promise<ActivityAreaDisplay[]> {
    const result = search === undefined ?
      await this.get<ActivityAreaResponseDTOResponse>(this.getActionUrl("")) :
      await this.get<ActivityAreaResponseDTOResponse>(
        this.getActionUrl(""),
        [],
        new HttpParams({
          fromObject: {
            search: search
          }
        })
      );

    if (result.error) {
      throw new Error(result.error as unknown as string);
    }

    const data = result.data!;
    const language = this.translationService.getActiveLang();
    return data.map((d) => ({
      id: d.id!,
      name: language === 'fr' ? d.nameFr! : d.nameEn!,
      selected: true
    }));
  }
}

export interface ActivityAreaDisplay {
  id: string;
  name: string;
  selected: boolean;
}
