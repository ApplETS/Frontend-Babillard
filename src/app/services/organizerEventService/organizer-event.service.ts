import { Injectable } from '@angular/core';
import { PostDetailsForm } from '@components/post-details/post-details';
import { Event } from '@models/event';
import { EventResponseDTO } from '@models/eventResponseDTO.interface';
import { Response } from '@models/response';
import { ApiService } from '@services/apiService/api.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizerEventService extends ApiService {
  protected override apiController = 'organizer-event';

  async postDraft(form: PostDetailsForm): Promise<Event> {
      const response = await this.postMultipartForm<Response<Event, string>>(this.getActionUrl(""), form);
      if (response.error) {
        throw new Error(response.error);
      } else {
        return response.data!;
      }
    
  }

  async updateDraft(form: PostDetailsForm, id: string) {
    return false;
  }
}
