import { Injectable } from '@angular/core';
import { PostDetailsForm } from '@components/post-details/post-details';
import { ApiService } from '@services/apiService/api.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizerEvent extends ApiService {
  protected override apiController = 'organizer-event';

  async postDraft(form: PostDetailsForm) {
    return false;
  }

  async updateDraft(form: PostDetailsForm, id: string) {
    return false;
  }
}
