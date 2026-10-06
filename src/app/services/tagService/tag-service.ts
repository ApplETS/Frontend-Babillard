import { Injectable } from '@angular/core';
import { Tag } from '@models/tag';
import { ApiService } from '@services/apiService/api.service';

@Injectable({
  providedIn: 'root',
})
export class TagService extends ApiService {
  protected override apiController: string = "tags";

  async getAllTags(): Promise<Tag[]> {
    const response = await this.get<{
      error: string | null;
      data: Tag[];
    }>(this.getActionUrl(""));

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  }
}
