import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PostDetails, PostDetailsForm } from "./post-details";
import { TagService } from "@services/tagService/tag-service";
import { Tag } from "@models/tag";
import { TranslocoTestingModule } from "@jsverse/transloco";
import { FieldTree, FormField } from "@angular/forms/signals";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ModalMode } from "@models/modal-mode";
import { signal, twoWayBinding } from "@angular/core";
import { Combobox } from "@components/combobox/combobox";
import { OrganizerEventService } from "@services/organizerEventService/organizer-event.service";
import { EventState } from "@models/event-state";

describe("PreviewDetails", () => {
  let component: PostDetails;
  let fixture: ComponentFixture<PostDetails>;

  const tagService = {
    getAllTags: vi.fn(),
  };

  const organizerEventService = {
    postDraft: vi.fn(),
    updateDraft: vi.fn(),
  };

  const closedCount = signal(0);
  let postForm: FieldTree<PostDetailsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PostDetails,
        FormField,
        FaIconComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {},
            fr: {},
          },
          translocoConfig: {
            availableLangs: ["en", "fr"],
            defaultLang: "en",
          },
        }),
        Combobox,
      ],
      providers: [
        { provide: TagService, useValue: tagService },
        { provide: OrganizerEventService, useValue: organizerEventService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetails, {
      bindings: [twoWayBinding("modalMode", signal(ModalMode.create))],
    });
    component = fixture.componentInstance;
    tagService.getAllTags.mockReturnValue(new Promise<Tag[]>((resolve) => resolve([])));
    closedCount.set(0);
    postForm = component.postForm;
    component.closed.subscribe(() => closedCount.update((count) => count + 1));
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  function setValidForm() {
    postForm.title().value.update(() => "Test Title");
    postForm.content().value.update(() => "Test Content");
    postForm.imageUrl().value.update(() => "https://example.com/image.jpg");
    postForm.image().value.update(() => new File([""], "image.jpg", { type: "image/jpeg" }));
    postForm.eventStartDate().value.update(() => new Date().toISOString());
    postForm.eventEndDate().value.update(() => new Date().toISOString());
    postForm.imageAltText().value.update(() => "Test Image Alt Text");
    postForm.tags().value.update(() => ["tag1", "tag2"]);
  }

  it("should create and call TagService.getAllTags()", () => {
    expect(component).toBeTruthy();
    expect(tagService.getAllTags).toHaveBeenCalled();
  });

  it("should not call OrganizerEventService when form is invalid", async () => {
    await component.handleDraft();
    expect(organizerEventService.postDraft).not.toHaveBeenCalled();
    expect(organizerEventService.updateDraft).not.toHaveBeenCalled();
    expect(closedCount(), "closed event should not have been called").toBe(0);
  });

  it("should call OrganizerEventService.postDraft() when form is valid and publication is null", async () => {
    organizerEventService.postDraft.mockReturnValue(Promise.resolve({ id: "1" }));

    setValidForm();

    await component.handleDraft();
    expect(organizerEventService.postDraft).toHaveBeenCalled();
    expect(organizerEventService.updateDraft).not.toHaveBeenCalled();
    expect(closedCount(), "closed event should have been called").toBe(1);
  });

  it("should call OrganizerEventService.updateDraft() when form is valid and publication is not null", async () => {
    organizerEventService.updateDraft.mockReturnValue(Promise.resolve({ id: "1" }));
    component.publication.set({
      id: "1",
      eventEndDate: "",
      eventStartDate: "",
      content: "",
      imageAltText: "",
      imageUrl: "",
      state: EventState.OnHold,
      tags: [],
      title: "",
      organizer: null,
    });

    setValidForm();

    await component.handleDraft();
    expect(organizerEventService.postDraft).not.toHaveBeenCalled();
    expect(organizerEventService.updateDraft).toHaveBeenCalled();
    expect(closedCount(), "closed event should have been called").toBe(1);
  });

  it("should call OrganizerEventService.postDraft() and handle generic error when form is valid and publication is null", async () => {
    organizerEventService.postDraft.mockReturnValue(
      Promise.reject(new Error("Some error occurred")),
    );
    setValidForm();

    await component.handleDraft();
    expect(organizerEventService.postDraft).toHaveBeenCalled();
    expect(organizerEventService.updateDraft).not.toHaveBeenCalled();
    expect(closedCount(), "closed event should not have been called").toBe(0);
    expect(postForm().errors(), "form should have errors").length(1);
    const error = postForm().errors()![0];
    expect(error.kind, "error kind should be 'serverError'").toBe("serverError");
    expect(error.message, "error message should be 'post.modal.post-error-toast-message'").toBe(
      "post.modal.post-error-toast-message",
    );
  });

  it("should call OrganizerEventService.updateDraft() and handle generic error when form is valid and publication is not null", async () => {
    organizerEventService.updateDraft.mockReturnValue(
      Promise.reject(new Error("Some error occurred")),
    );
    component.publication.set({
      id: "1",
      eventEndDate: "",
      eventStartDate: "",
      content: "",
      imageAltText: "",
      imageUrl: "",
      state: EventState.OnHold,
      tags: [],
      title: "",
      organizer: null,
    });
    setValidForm();

    await component.handleDraft();
    expect(organizerEventService.postDraft).not.toHaveBeenCalled();
    expect(organizerEventService.updateDraft).toHaveBeenCalled();
    expect(closedCount(), "closed event should not have been called").toBe(0);
    expect(postForm().errors(), "form should have errors").length(1);
    const error = postForm().errors()![0];
    expect(error.kind, "error kind should be 'serverError'").toBe("serverError");
    expect(error.message, "error message should be 'post.modal.post-error-toast-message'").toBe(
      "post.modal.post-error-toast-message",
    );
  });

  it("should call OrganizerEventService.postDraft() and throw 'BAD_PARAM_EVENT_Tags' error when form is valid and publication is null", async () => {
    organizerEventService.postDraft.mockReturnValue(
      Promise.reject(new Error("BAD_PARAM_EVENT_Tags")),
    );
    setValidForm();

    await component.handleDraft();
    expect(organizerEventService.postDraft).toHaveBeenCalled();
    expect(organizerEventService.updateDraft).not.toHaveBeenCalled();
    expect(closedCount(), "closed event should not have been called").toBe(0);
    expect(postForm().errors(), "form should not have error").length(0);
    expect(postForm.tags().errors(), "tags field should have errors").length(1);
    const error = postForm.tags().errors()![0];
    expect(error.kind, "error kind should be 'maxLength'").toBe("maxLength");
    expect(error.message, "error message should be 'post.modal.tooManyTagsError'").toBe(
      "post.modal.tooManyTagsError",
    );
  });

  it("should call OrganizerEventService.postDraft() and throw 'BAD_PARAM_EVENT_image' error when form is valid and publication is null", async () => {
    organizerEventService.postDraft.mockReturnValue(
      Promise.reject(new Error("BAD_PARAM_EVENT_image")),
    );
    setValidForm();

    await component.handleDraft();
    expect(organizerEventService.postDraft).toHaveBeenCalled();
    expect(organizerEventService.updateDraft).not.toHaveBeenCalled();
    expect(closedCount(), "closed event should not have been called").toBe(0);
    expect(postForm().errors(), "form should not have error").length(0);
    expect(postForm.image().errors(), "image field should have errors").length(1);
    expect(postForm.imageUrl().errors(), "imageUrl field should have errors").length(1);
    const error = postForm.image().errors()![0];
    expect(error.kind, "error kind should be 'required'").toBe("required");
    expect(error.message, "error message should be 'post.modal.image-required-error'").toBe(
      "post.modal.image-required-error",
    );
  });

  // it("should call OrganizerEventService.updateDraft() and handle specific error when form is valid and publication is not null", async () => {
  //   organizerEventService.updateDraft.mockReturnValue(new Promise((resolve, reject) => reject({ kind: "specificError", message: "Specific error occurred" })));
  //   setValidForm();

  //   await component.handleDraft();
  //   expect(organizerEventService.postDraft).not.toHaveBeenCalled();
  //   expect(organizerEventService.updateDraft).toHaveBeenCalled();
  //   expect(closedCount(), "closed event should not have been called").toBe(0);
  //   expect(postForm().errors(), "form should have errors").length(0);
  //   const error = postForm().errors()![0];
  //   expect(error.kind, "error kind should be 'specificError'").toBe("specificError");
  //   expect(error.message, "error message should be 'Specific error occurred'").toBe("Specific error occurred");
  // });
});
