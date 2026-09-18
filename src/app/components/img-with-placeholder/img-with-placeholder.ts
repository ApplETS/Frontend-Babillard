import { Component, computed, Input, signal } from '@angular/core';

@Component({
  selector: 'app-img-with-placeholder',
  imports: [],
  templateUrl: './img-with-placeholder.html',
})
export class ImgWithPlaceholder {
  @Input({ required: true }) src!: string;
  @Input({ required: true }) alt!: string;
  @Input() placeholder: string = "/assets/placeholder.png";

  errorLoading = signal(false);

  source = computed(() => this.errorLoading() ? this.placeholder : this.src);
}
