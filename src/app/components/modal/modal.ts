import { Component, ElementRef, model, viewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
})
export class Modal {
  modal = viewChild.required<ElementRef<HTMLDialogElement>>("modal");

  showModal() {
    this.modal().nativeElement.showModal();
  }
}
