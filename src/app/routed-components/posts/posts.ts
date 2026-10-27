import { Component, inject, OnInit, signal, viewChild } from "@angular/core";
import { TranslocoDirective } from "@jsverse/transloco";
import { DropDownSelectComponent } from "@components/drop-down-select.component/drop-down-select.component";
import { Modal } from "@components/modal/modal";
import { PostDetails } from "@components/post-details/post-details";
import { ModalMode } from "@models/modal-mode";
import { EventTable } from "@components/event-table/event-table";
import { Pagination } from "@components/pagination/pagination";
import { form, FormField, submit, FormRoot } from "@angular/forms/signals";
import { PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";
import { Event } from "@models/event";
import { OrganizerEventService } from "@services/organizerEventService/organizer-event.service";
import { EventState } from "@models/event-state";
import { LoadingSpinner } from "@components/loading-spinner/loading-spinner";

@Component({
  selector: "app-posts",
  imports: [TranslocoDirective, DropDownSelectComponent, Modal, PostDetails, EventTable, Pagination, FormField, LoadingSpinner, FormRoot],
  templateUrl: "./posts.html",
})
export class Posts implements OnInit {
  createPost = signal(false);
  modalMode = signal<ModalMode>(null!);

  modal = viewChild.required(Modal);

  organizerEventService = inject(OrganizerEventService);

  createNewPost() {
    this.modalMode.set(ModalMode.create);
    this.createPost.set(true);
    this.modal().showModal();
  }

  resetModal() {
    this.createPost.set(false);
    this.modalMode.set(null!);
    this.modal().dismissModal();
  }

  paginatedEvents = signal<PaginatedResponse<Event>>({
    data: [],
    totalPages: 0,
    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    error: null,
  });

  searchEventForm = form(signal<SearchEventForm>({
    title: "",
    startDate: "",
    endDate: "",
    activityAreas: [],
    tags: [],
    state: EventState.All,
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      orderBy: "",
      descending: false,
    },
  }), {submission: {
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
    }
  }});

  async ngOnInit(): Promise<void> {
    this.searchEvents();
  }

  searchEvents() {
    submit(this.searchEventForm);
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
