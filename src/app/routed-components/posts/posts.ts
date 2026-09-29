import { Component, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DropDownSelectComponent } from '@components/drop-down-select.component/drop-down-select.component';
import { Modal } from '@components/modal/modal';
import { PostDetails } from '@components/post-details/post-details';
import { ModalMode } from '@models/modal-mode';

@Component({
  selector: 'app-posts',
  imports: [TranslocoDirective, DropDownSelectComponent, Modal, PostDetails],
  templateUrl: './posts.html',
})
export class Posts {
  createPost = signal(false);
  modalMode = signal<ModalMode>(null!);
}
