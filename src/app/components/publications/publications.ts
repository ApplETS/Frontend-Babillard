import { Component, effect, inject, Input, model, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter } from '@fortawesome/free-solid-svg-icons';
import { Event } from '@models/event';
import { EventDataAndImage } from "@components/event-data-and-image/event-data-and-image";
import { Avatar } from "@components/avatar/avatar";
import { MarkdownComponent } from 'ngx-markdown';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

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
  @Input({ required: true }) events: Event[] | null = [];
  translocoService = inject(TranslocoService);
  selectedCard = model<number | null>(null);

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

	selectCard(cardId?: number) {
		this.selectedCard.update((value) => cardId === this.selectedCard() ? null : cardId ?? null);

		if (cardId && !this.selectedCard()) {
			this.scrollToCard(card);
		}
	};

  handleCardMouseUp(e: MouseEvent, cardId?: number) {
  	if ((e.target as HTMLElement).closest('a')) {
			return;
		}
		if ((e.target as HTMLElement).closest('button')) {
			return;
		}
		if (this.dragStart().isDragging) {
			const y = e.pageY - containerRef.current.offsetTop;
			const walk = y - this.dragStart().startY;
			if (Math.abs(walk) < 5) this.selectCard(cardId);
		} else {
      this.selectCard(cardId);
    }
  }

  handleMouseDown(e: MouseEvent) {
		this.dragStart.set({
			startY: e.pageY - containerRef.current.offsetTop,
			startScrollTop: containerRef.current.scrollTop,
			isDragging: true,
		});
	}

	handleMouseMove(e: MouseEvent) {
		if (!this.dragStart().isDragging || this.selectedCard()) return;
		const y = e.pageY - containerRef.current.offsetTop;
		const walk = y - this.dragStart().startY;
		containerRef.current.scrollTop = this.dragStart().startScrollTop - walk;
	}

  	scrollToCard(cardIndex: number) {
		const cardElement = cardRefs.current[cardIndex - 1];
		if (!cardElement) return;

		const container = containerRef.current;
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

			container.scrollTo({
				// top: scrollPosition,
				behavior: 'smooth',
			});
		}, delay);
	}
}
