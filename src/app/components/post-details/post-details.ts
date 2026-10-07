import { Component, computed, inject, model, OnInit, signal, viewChild } from '@angular/core';
import { debounce, form, FormField, required, validate } from '@angular/forms/signals';
import { Combobox } from '@components/combobox/combobox';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMobileScreen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ModalMode } from '@models/modal-mode';
import { Tag } from '@models/tag';
import { TagService } from '@services/tagService/tag-service';

@Component({
	selector: 'app-post-details',
	imports: [TranslocoDirective, FaIconComponent, FormField, TranslocoPipe, Combobox],
	styles: `
	@reference "#styles.css";

		.disabled {
			@apply border border-base-content rounded-lg;
		}
	`,
	templateUrl: './post-details.html',
})
export class PostDetails implements OnInit {
	modalMode = model.required<ModalMode>();

	showPreview = signal(false);
	tags = signal<Tag[]>([]);

	tagService = inject(TagService);

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

	combobox = viewChild.required(Combobox);

	protected readonly ModalMode = ModalMode;
	protected readonly mobileScreenIcon = faMobileScreen;
	protected readonly faXmark = faXmark;

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

	canAddTag = computed(() => !this.postForm.labels().disabled() && this.postForm.labels().value().length < 5 && this.modalMode() !== ModalMode.moderator);

	availableTags = computed(() => this.tags().filter(tag => !this.postForm.labels().value().includes(tag.id)).map(tag => ({ id: tag.id, name: tag.name })));
	
	async ngOnInit(): Promise<void> {
		this.tags.set(await this.tagService.getAllTags());
	}

	removeTag(tagId: string) {
		this.postForm.labels().value.update((labels) => labels.filter(label => label !== tagId));
	}

	addTag(tagId: string) {
		this.postForm.labels().value.update((labels) => [...labels, tagId]);
		this.combobox().resetInput();
	}
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