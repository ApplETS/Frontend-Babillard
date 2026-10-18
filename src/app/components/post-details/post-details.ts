import { Component, computed, inject, model, OnInit, signal, viewChild } from '@angular/core';
import { debounce, disabled, form, FormField, maxLength, required, validate } from '@angular/forms/signals';
import { Combobox } from '@components/combobox/combobox';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMobileScreen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Constants } from '@models/constants';
import { ModalMode } from '@models/modal-mode';
import { Tag } from '@models/tag';
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

	tagService = inject(TagService);
	protected readonly Constants = Constants;

	postForm = form<PostDetailsForm>(
		signal<PostDetailsForm>({
			content: "",
			eventStartDate: null,
			eventEndDate: null,
			imageSrc: "",
			imageAltText: "",
			publicationDate: null,
			labels: [],
			title: "",
			image: null,
		}), (schema) => {
			debounce(schema, 300);
			required(schema.title, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.content, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.imageSrc, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.eventStartDate, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.eventEndDate, { when: () => this.modalMode() !== ModalMode.moderator });
			required(schema.imageAltText, { when: () => this.modalMode() !== ModalMode.moderator }),
			required(schema.image, { when: () => this.modalMode() !== ModalMode.moderator });
			maxLength(schema.labels, 5, { message: "Labels cannot exceed 5 items" });
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
					return { kind: 'invalidType', message: 'File must be an image' };
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

	canAddTag = computed(() => !this.postForm.labels().disabled() && this.postForm.labels().value().length < this.postForm.labels().maxLength!()! && this.modalMode() !== ModalMode.moderator);

	availableTags = computed(() => this.tags().filter(tag => !this.postForm.labels().value().includes(tag.id)).map(tag => ({ id: tag.id, name: tag.name })));

	async ngOnInit(): Promise<void> {
		this.tags.set(await this.tagService.getAllTags());
	}

	removeTag(tagId: string) {
		this.postForm.labels().value.update((labels) => labels.filter(label => label !== tagId));
	}

	addTag(tagId: string) {
		this.postForm.labels().value.update((labels) => [...labels, tagId]);
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
			this.postForm.imageSrc().value.update(() => e.target?.result as string);
		};
		reader.readAsDataURL(file);
	}
}

interface PostDetailsForm {
	title: string;
	imageSrc: string;
	imageAltText: string;
	image: Blob | null;
	publicationDate: string | null;
	eventStartDate: string | null;
	eventEndDate: string | null;
	labels: string[];
	content: string;
}