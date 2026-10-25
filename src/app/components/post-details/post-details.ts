import { Component, computed, inject, model, OnInit, output, signal, viewChild } from '@angular/core';
import { debounce, disabled, FieldTree, form, FormField, maxLength, required, submit, TreeValidationResult, validate } from '@angular/forms/signals';
import { Combobox } from '@components/combobox/combobox';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMobileScreen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Constants } from '@models/constants';
import { Event as ModelEvent } from '@models/event';
import { EventState } from '@models/event-state';
import { ModalMode } from '@models/modal-mode';
import { Tag } from '@models/tag';
import { OrganizerEventService } from '@services/organizerEventService/organizer-event.service';
import { TagService } from '@services/tagService/tag-service';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
	selector: 'app-post-details',
	imports: [TranslocoDirective, FaIconComponent, FormField, TranslocoPipe, Combobox, MarkdownComponent],
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

	closed = output();

	tagService = inject(TagService);
	organizerEventService = inject(OrganizerEventService);
	protected readonly Constants = Constants;

	postForm = form<PostDetailsForm>(
		signal<PostDetailsForm>({
			content: "",
			eventStartDate: null,
			eventEndDate: null,
			imageUrl: "",
			imageAltText: "",
			publicationDate: null,
			tags: [],
			title: "",
			image: null,
		}), (schema) => {
			debounce(schema, 300);
			required(schema.title, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.content, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.imageUrl, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.eventStartDate, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.eventEndDate, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.imageAltText, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.image, { when: () => this.modalMode() !== ModalMode.moderator, message: "post.modal.image-required-error" });
			maxLength(schema.tags, 5, { message: "post.modal.tooManyTagsError" });
			validate(schema.eventStartDate, ({ value, valueOf }) => {
				const startDate = value();
				const endDate = valueOf(schema.eventEndDate);

				if (startDate && endDate && startDate > endDate) {
					return { kind: 'invalidRange', message: 'Event start date cannot be after event end date' };
				}

				return null;
			});
			validate(schema.image, ({ valueOf }) => {
				const image = valueOf(schema.image);
				if (!image) {
					return null;
				}

				if (!image.type.startsWith("image/")) {
					return { kind: "invalidType", message: "post.modal.image-type-error" };
				}

				return null;
			})
			disabled(schema, () => {
				switch (this.modalMode()) {
					case ModalMode.view:
					case ModalMode.delete:
					case ModalMode.moderator:
						return true;
					default:
						return false;
				}
			});
		});

	combobox = viewChild.required(Combobox);

	protected readonly ModalMode = ModalMode;
	protected readonly EventState = EventState;
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

	canAddTag = computed(() => !this.postForm.tags().disabled() && this.postForm.tags().value().length < this.postForm.tags().maxLength!()! && this.modalMode() !== ModalMode.moderator);

	availableTags = computed(() => this.tags().filter(tag => !this.postForm.tags().value().includes(tag.id)).map(tag => ({ id: tag.id, name: tag.name })));
	publication = signal<ModelEvent | null>(null);

	async ngOnInit(): Promise<void> {
		this.tags.set(await this.tagService.getAllTags());
	}

	removeTag(tagId: string) {
		this.postForm.tags().value.update((tags) => tags.filter(label => label !== tagId));
	}

	addTag(tagId: string) {
		this.postForm.tags().value.update((tags) => [...tags, tagId]);
		this.combobox().reset();
	}

	fileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files || !input.files[0]) {
			return;
		}

		const file = input.files[0];
		const reader = new FileReader();
		this.postForm.image().value.update(() => file);
		reader.onload = (e) => {
			this.postForm.imageUrl().value.update(() => e.target?.result as string);
		};
		reader.readAsDataURL(file);
	}

	async handleDraft() {
		if (this.postForm().invalid()) {
			return;
		}

		const success = await submit(this.postForm, (field) => this.submitForm(field));
		if (success) this.closed.emit();
	}

	private async submitForm(form: FieldTree<PostDetailsForm>): Promise<TreeValidationResult> {
		try {
			const value = form().value();
			value.eventEndDate = value.eventEndDate ? new Date(value.eventEndDate).toISOString() : null;
			value.eventStartDate = value.eventStartDate ? new Date(value.eventStartDate).toISOString() : null;
			value.publicationDate = value.publicationDate ? new Date(value.publicationDate).toISOString() : null;
			if (value.tags.length === 0) {
				value.tags = null!;
			}

			if (this.publication() !== null) {
				await this.organizerEventService.updateDraft(value, this.publication()!.id);
			} else {
				await this.organizerEventService.postDraft(value);
			}
		} catch (e: unknown) {
			if (e instanceof Error && Constants.badParameterPattern.test(e.message)) {
				const field = e.message.substring(e.message.lastIndexOf("_") + 1).toLowerCase();
				switch (field) {
					case "tags":
						return { kind: "maxLength", message: "post.modal.tooManyTagsError", fieldTree: form.tags };
					case "image":
						return [ 
							{ kind: "required", message: "post.modal.image-required-error", fieldTree: form.image },
							{ kind: "required", message: "post.modal.image-required-error", fieldTree: form.imageUrl }
						];
					default:
						return { kind: "serverError", message: "post.modal.post-error-toast-message" };
				}
			} else {
				return { kind: "serverError", message: "post.modal.post-error-toast-message" };
			}
		}
	}
}

export interface PostDetailsForm {
	image: Blob | null;
	imageUrl: string;
	title: string;
	content: string;
	publicationDate: string | null;
	eventStartDate: string | null;
	eventEndDate: string | null;
	tags: string[];
	imageAltText: string;
}