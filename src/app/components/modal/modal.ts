import { Component, ElementRef, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
})
export class Modal {
  modal = viewChild.required<ElementRef<HTMLDialogElement>>("modal");
  closed = output();

  showModal() {
    this.modal().nativeElement.showModal();
  }
}
