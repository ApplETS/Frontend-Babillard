import { Component, computed, inject, model, OnInit, signal } from '@angular/core';
import { debounce, form, FormField, required, validate } from '@angular/forms/signals';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ModalMode } from '@models/modal-mode';

@Component({
	selector: 'app-post-details',
	imports: [TranslocoDirective, FaIconComponent, FormField, TranslocoPipe],
	styles: `
	@reference "#styles.css";

		.disabled {
			@apply border border-base-content rounded-lg;
		}
	`,
	templateUrl: './post-details.html',
})
export class PostDetails {
	modalMode = model.required<ModalMode>();

	showPreview = signal(false);

	postForm = form<PostDetailsForm>(
		signal<PostDetailsForm>({
			content: "",
			eventStartDate: null,
			eventEndDate: null,
			imageSrc: "",
			publicationDate: null,
			labels: [],
			title: ""
		}), (schema) => {
			debounce(schema, 300);
			required(schema.title);
			required(schema.content);
			required(schema.imageSrc);
			required(schema.eventStartDate);
			required(schema.eventEndDate);
			validate(schema.labels, (labels) => labels.value.length > 5 ? { kind: 'maxLength', message: 'Labels cannot exceed 5 items' } : null),
			validate(schema.eventStartDate, ({ value, valueOf }) => {
				const startDate = value();
				const endDate = valueOf(schema.eventEndDate);
				
				if (startDate && endDate && startDate > endDate) {
					return { kind: 'invalidRange', message: 'Event start date cannot be after event end date' };
				}

				return null;
			})
		});

	protected readonly ModalMode = ModalMode;
	protected readonly mobileScreenIcon = faMobileScreen;

	modalTitle = computed(() => {
		switch (this.modalMode()) {
			case ModalMode.create:
				return "post.modal.create-page-title";
			case ModalMode.modify:
				return "post.modal.modify-page-title";
			case ModalMode.duplicate:
				return "post.modal.duplicate-page-title";
			case ModalMode.moderator:
				return "post.modal.moderator-page-title";
			default:
				return "";
		}
	});

	isDisabled = computed(() => {
		switch (this.modalMode()) {
			case ModalMode.view:
			case ModalMode.delete:
			case ModalMode.moderator:
				return true;
			default:
				return false;
		}
	});
}

interface PostDetailsForm {
	title: string;
	imageSrc: string;
	publicationDate: string | null;
	eventStartDate: string | null;
	eventEndDate: string | null;
	labels: string[];
	content: string;
}