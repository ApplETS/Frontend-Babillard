import { Component, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DropDownSelectComponent } from '@components/drop-down-select.component/drop-down-select.component';
import { Modal } from '@components/modal/modal';

@Component({
  selector: 'app-posts',
  imports: [TranslocoDirective, DropDownSelectComponent, Modal],
  templateUrl: './posts.html',
})
export class Posts {
  createPost = signal(false);
}
