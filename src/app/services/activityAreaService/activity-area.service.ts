import { HttpParams } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ActivityAreaResponseDTO } from '@models/activityAreaResponseDTO.interface';
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
    return data.map((d) => new ActivityAreaDisplay(d, this.translationService));
  }
}

export class ActivityAreaDisplay {
  id: string;
  selected: boolean;
  nameFr: string;
  nameEn: string

  constructor(acitivityAreaResponseDTO: ActivityAreaResponseDTO, private translationService: TranslocoService) {
    this.id = acitivityAreaResponseDTO.id!;
    this.selected = true;
    this.nameFr = acitivityAreaResponseDTO.nameFr!;
    this.nameEn = acitivityAreaResponseDTO.nameEn!;
  }

  name = computed(() => {
    const language = this.translationService.getActiveLang();
    return language === 'fr' ? this.nameFr : this.nameEn;
  })
}