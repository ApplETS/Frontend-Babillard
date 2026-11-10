import { Component, inject, signal, viewChild } from "@angular/core";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { Modal } from "@components/modal/modal";
import { PostDetails } from "@components/post-details/post-details";
import { ModalMode } from "@models/modal-mode";
import { EventSelectedEvent, EventTable } from "@components/event-table/event-table";
import { Pagination } from "@components/pagination/pagination";
import { form, FormField, submit, FormRoot } from "@angular/forms/signals";
import { PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";
import { Event as ModelEvent } from "@models/event";
import { OrganizerEventService } from "@services/organizerEventService/organizer-event.service";
import { EventState } from "@models/event-state";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { toObservable } from "@angular/core/rxjs-interop";
import { debounce, interval } from "rxjs";
import { BooleanSelect } from "@components/boolean-select/boolean-select";
import { Search } from "@components/search/search";
import { Constants } from "@models/constants";
import { DropdownMenuItemAction } from "@components/dropdown-menu/dropdown-menu";

@Component({
  selector: "app-posts",
  imports: [
    TranslocoDirective,
    Modal,
    PostDetails,
    EventTable,
    Pagination,
    FormField,
    LoadingSpinner,
    FormRoot,
    TranslocoPipe,
    BooleanSelect,
    Search,
  ],
  templateUrl: "./posts.html",
})
export class Posts {
  protected readonly statuses = [
    Constants.newsStatuses.All,
    Constants.newsStatuses.Draft,
    Constants.newsStatuses.Deleted,
    Constants.newsStatuses.Denied,
    Constants.newsStatuses.Draft,
    Constants.newsStatuses.OnHold,
    Constants.newsStatuses.Published,
  ];

  modalMode = signal<ModalMode>(ModalMode.default);
  selectedEvent = signal<ModelEvent | null>(null);

  protected readonly ModalMode = ModalMode;

  modal = viewChild.required(Modal);

  readonly eventKeys = [
    { label: "post.table.title", key: "Publication.Title" },
    { label: "post.table.release-date", key: "Publication.PublicationDate" },
    { label: "post.table.event-date", key: "EventStartDate" },
    { label: "post.table.status", key: "Publication.State" },
  ] as const;

  constructor() {
    toObservable(this.searchEventForm().value)
      .pipe(debounce(() => interval(300)))
      .subscribe(() => {
        this.searchEvents();
      });
  }

  organizerEventService = inject(OrganizerEventService);

  createNewPost() {
    this.modalMode.set(ModalMode.create);
    this.modal().showModal();
    this.selectedEvent.set(null);
  }

  resetModal() {
    this.modalMode.set(ModalMode.default);
    this.modal().dismissModal();
    this.selectedEvent.set(null);
  }

  paginatedEvents = signal<PaginatedResponse<ModelEvent>>({
    data: [],
    totalPages: 0,
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    error: null,
  });

  searchEventForm = form(
    signal<SearchEventForm>({
      title: "",
      startDate: "",
      endDate: "",
      activityAreas: [],
      tags: [],
      state: EventState.All,
      pagination: {
        pageNumber: 1,
        pageSize: 10,
        orderBy: "EventStartDate",
        descending: false,
      },
    }),
    {
      submission: {
        action: async (field) => {
          const formValue = {
            title: field.title().value(),
            startDate: field.startDate().value(),
            endDate: field.endDate().value(),
            activityAreas: field.activityAreas().value(),
            tags: field.tags().value(),
            state: field.state().value(),
            pageNumber: field.pagination().value().pageNumber,
            pageSize: field.pagination().value().pageSize,
            orderBy: field.pagination().value().orderBy,
            descending: field.pagination().value().descending,
          };

          this.paginatedEvents.set(await this.organizerEventService.getOrganizerEvents(formValue));
        },
      },
    },
  );

  searchEvents() {
    submit(this.searchEventForm);
  }

  selectEvent(e: EventSelectedEvent) {
    switch (e.action) {
      case DropdownMenuItemAction.delete:
        this.modalMode.set(ModalMode.delete);
        break;
      case DropdownMenuItemAction.modify:
        this.modalMode.set(ModalMode.modify);
        break;
      case DropdownMenuItemAction.duplicate:
        this.modalMode.set(ModalMode.duplicate);
        break;
      default:
        this.modalMode.set(null!);
    }

    this.selectedEvent.set(e.event);
    this.modal().showModal();
  }
}

interface SearchEventForm {
  title: string;
  startDate: string;
  endDate: string;
  activityAreas: string[];
  tags: string[];
  state: EventState;
  pagination: PaginationParameters;
}
