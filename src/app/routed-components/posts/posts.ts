import { Component, signal, viewChild } from '@angular/core';
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

  modal = viewChild.required(Modal);

  createNewPost() {
    this.modalMode.set(ModalMode.create);
    this.createPost.set(true);
    this.modal().showModal();
  }

  resetModal() {
    this.createPost.set(false);
    this.modalMode.set(null!);
    console.log('Modal has been reset');
  }
}
