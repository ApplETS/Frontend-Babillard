import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivityAreaResponseDTOResponse } from '@models/activityAreaResponseDTOResponse.interface';
import { ApiService } from '@services/apiService/api.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityAreaService extends ApiService {
  override apiController: string = "activity-areas";

  public async getActivityAreas(search?: string): Promise<ActivityAreaResponseDTOResponse> {
    return search === undefined ?
      this.get<ActivityAreaResponseDTOResponse>(this.getActionUrl("")) :
      this.get<ActivityAreaResponseDTOResponse>(
        this.getActionUrl(""),
        [],
        new HttpParams({
          fromObject: {
            search: search
          }
        })
      );
  }
}
