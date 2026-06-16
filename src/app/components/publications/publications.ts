import { Component, effect, inject, Input, model, signal, ViewChild, viewChildren } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { Event } from '@models/event';
import { EventDataAndImage } from "@components/event-data-and-image/event-data-and-image";
import { Avatar } from "@components/avatar/avatar";
import { MarkdownComponent } from 'ngx-markdown';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PaginatedResponse } from '@services/api.service/api.service';
import { getActivityAreaName } from '@models/activity-area';

@Component({
  selector: 'app-publications',
  imports: [FontAwesomeModule, EventDataAndImage, Avatar, MarkdownComponent, TranslocoPipe],
  templateUrl: './publications.html',
  styles: `
    .selected {
      @apply scale-[1.07] transition-all z-10 duration-350;
    }

    .notSelected {
      @apply scale-100 opacity-[80%] transition-all duration-350;
    }
  `,
})
export class Publications {
  @Input({ required: true }) events: PaginatedResponse<Event> | null = null;
  translocoService = inject(TranslocoService);
  selectedCardId = model<string | null>(null);

  @ViewChild('cardContainer') containerRef!: { nativeElement: HTMLDivElement };
  cardRefs = viewChildren<HTMLDivElement>(".card");
  readonly faDownLeftAndUpRightToCenter = faDownLeftAndUpRightToCenter;
  readonly faUpRightAndDownLeftFromCenter = faUpRightAndDownLeftFromCenter;

  dragStart = signal<{
    startY: number;
    startScrollTop: number;
    isDragging: boolean;
  }>({
    startY: 0,
    startScrollTop: 0,
    isDragging: false,
  });

	selectCard(cardId?: string) {
		this.selectedCardId.update((value) => cardId === this.selectedCardId() ? null : cardId ?? null);

		if (cardId && !this.selectedCardId()) {
			this.scrollToCard(this.events?.data?.findIndex((e) => e.id === cardId) ?? 0 + 1);
		}
	};

  handleCardMouseUp(e: MouseEvent, cardId?: string) {
  	if ((e.target as HTMLElement).closest('a')) {
			return;
		}
		if ((e.target as HTMLElement).closest('button')) {
			return;
		}
		if (this.dragStart().isDragging) {
			const y = e.pageY - this.containerRef.nativeElement.offsetTop;
			const walk = y - this.dragStart().startY;
			if (Math.abs(walk) < 5) this.selectCard(cardId);
		} else {
      this.selectCard(cardId);
    }
  }

  handleMouseDown(e: MouseEvent) {
		this.dragStart.set({
			startY: e.pageY - this.containerRef.nativeElement.offsetTop,
			startScrollTop: this.containerRef.nativeElement.scrollTop,
			isDragging: true,
		});
	}

	handleMouseMove(e: MouseEvent) {
		if (!this.dragStart().isDragging || this.selectedCardId()) return;
		const y = e.pageY - this.containerRef.nativeElement.offsetTop;
		const walk = y - this.dragStart().startY;
		this.containerRef.nativeElement.scrollTop = this.dragStart().startScrollTop - walk;
	}

  scrollToCard(cardIndex: number) {
    const event = this.events?.data?.at(cardIndex - 1);
		const cardElement = this.cardRefs()[cardIndex - 1];
		if (!cardElement) return;

		const container = this.containerRef.nativeElement;
		if (!container) return;

		if (cardIndex === 1) {
			container.scrollTo({
				top: 0,
				behavior: 'smooth',
			});
			return;
		}
		const delay = 100;
		setTimeout(() => {
      const containerRect = container.getBoundingClientRect();
			const cardRect = cardElement.getBoundingClientRect();

			const scale = this.selectedCardId() === event?.id ? 1.07 : 1;
			const scaledCardHeight = cardRect.height * scale;

			const scaledCardTop = cardRect.top + (cardRect.height - scaledCardHeight) / 2;

			const scrollPosition =
				scaledCardTop - containerRect.top + container.scrollTop - (containerRect.height - scaledCardHeight) / 2;

			container.scrollTo({
				top: scrollPosition,
				behavior: 'smooth',
			});
		}, delay);
	}

  getActivityAreaName = getActivityAreaName;
}
