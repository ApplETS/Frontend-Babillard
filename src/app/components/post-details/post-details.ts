import { Component, computed, model, signal } from '@angular/core';
import { debounce, form, FormField, required, validate } from '@angular/forms/signals';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { TranslocoDirective } from '@jsverse/transloco';
import { ModalMode } from '@models/modal-mode';

@Component({
	selector: 'app-post-details',
	imports: [TranslocoDirective, FaIconComponent, FormField],
	templateUrl: './post-details.html',
})
export class PostDetails {
	modalMode = model.required<ModalMode>();

	showPreview = signal(false);
	postForm = form<PostDetailsForm>(
		signal<PostDetailsForm>({
			content: "",
			eventStartDate: null,
			imageSrc: "",
			publicationDate: null,
			labels: [],
			title: ""
		}), (schema) => {
			debounce(schema, 300);
			required(schema.title);
			required(schema.content);
			required(schema.imageSrc);
			validate(schema.labels, (labels) => labels.value.length > 5 ? { kind: 'maxLength', message: 'Labels cannot exceed 5 items' } : null)
		});

	protected readonly ModalMode = ModalMode;
	protected readonly mobileScreenIcon = faMobileScreen;

	modalTitle = computed(() => {
		switch (this.modalMode()) {
			case ModalMode.create:
				return "modal.create-page-title";
			case ModalMode.modify:
				return "modal.modify-page-title";
			case ModalMode.duplicate:
				return "modal.duplicate-page-title";
			case ModalMode.moderator:
				return "modal.moderator-page-title";
			default:
				return '';
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
	publicationDate: Date | null;
	eventStartDate: Date | null;
	labels: string[];
	content: string;
}