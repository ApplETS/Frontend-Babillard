import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { DropDownSelectComponent } from '@components/drop-down-select.component/drop-down-select.component';

@Component({
  selector: 'app-posts',
  imports: [TranslocoDirective, DropDownSelectComponent],
  templateUrl: './posts.html',
})
export class Posts {

}
