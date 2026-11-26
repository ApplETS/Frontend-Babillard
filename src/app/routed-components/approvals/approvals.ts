import { Component, inject, signal, viewChild } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { form, FormField, FormRoot, submit } from "@angular/forms/signals";
import { ApprovalTable } from "@components/approval-table/approval-table";
import { BooleanSelect } from "@components/boolean-select/boolean-select";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";
import { Modal } from "@components/modal/modal";
import { Pagination } from "@components/pagination/pagination";
import { PostDetails } from "@components/post-details/post-details";
import { Search } from "@components/search/search";
import { TranslocoDirective, TranslocoPipe } from "@jsverse/transloco";
import { Constants } from "@models/constants";
import { Event as ModelEvent } from "@models/event";
import { EventState } from "@models/event-state";
import { ModalMode } from "@models/modal-mode";
import { emptyPaginatedResponse, PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";
import { ApprovalService, PaginatedApprovalEventsParameters } from "@services/approvalService/approval.service";
import { debounce, interval } from "rxjs";

@Component({
  selector: "app-approvals",
  imports: [Modal, LoadingSpinner, TranslocoPipe, FormField, FormRoot, Search, BooleanSelect, TranslocoDirective, Pagination, ApprovalTable, PostDetails],
  templateUrl: "./approvals.html",
})
export class Approvals {
  modal = viewChild.required(Modal);
  approvalService = inject(ApprovalService);

  protected readonly statuses = [
    Constants.newsStatuses.All,
    Constants.newsStatuses.Draft,
    Constants.newsStatuses.Deleted,
    Constants.newsStatuses.Denied,
    Constants.newsStatuses.Draft,
    Constants.newsStatuses.OnHold,
    Constants.newsStatuses.Published,
  ];

  readonly eventKeys = [
    { label: "post.table.title", key: "Publication.Title" },
    { label: "post.table.release-date", key: "Publication.PublicationDate" },
    { label: "post.table.event-date", key: "EventStartDate" },
    { label: "post.table.status", key: "Publication.State" },
  ] as const;
  readonly ModalMode = ModalMode;

  constructor() {
    toObservable(this.searchEventForm().value)
      .pipe(debounce(() => interval(300)))
      .subscribe(() => {
        this.searchEvents();
      });
  }

  searchEventForm = form<SearchEventForm>(signal({
    title: "",
    startDate: "",
    endDate: "",
    activityAreas: [],
    tags: [],
    state: EventState.All,
    pagination: {
      page: 1,
      pageSize: 10,
      descending: false,
      orderBy: "Publication.PublicationDate",
      pageNumber: 1,
    },
  }), {
    submission: {
      action: async (field) => {
        const parameters: PaginatedApprovalEventsParameters = {
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

        this.paginatedEvents.set(await this.approvalService.getApprovalEvents(parameters));
      }
    }
  });

  modalMode = signal<ModalMode>(ModalMode.default);

  paginatedEvents = signal<PaginatedResponse<ModelEvent>>(emptyPaginatedResponse());
  selectedEvent = signal<ModelEvent | null>(null);

  resetModal(refreshList = false) {
    this.modalMode.set(ModalMode.default);
    this.modal().dismissModal();
    this.selectedEvent.set(null);
    if (refreshList) {
      this.searchEvents();
    }
  }

  searchEvents() {
    submit(this.searchEventForm);
  }

  openModal(e: ModelEvent) {
    this.selectedEvent.set(e);
    this.modalMode.set(ModalMode.moderator);
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
