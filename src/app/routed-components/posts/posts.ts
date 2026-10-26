import { Component, inject, OnInit, signal, viewChild } from "@angular/core";
import { TranslocoDirective } from "@jsverse/transloco";
import { DropDownSelectComponent } from "@components/drop-down-select.component/drop-down-select.component";
import { Modal } from "@components/modal/modal";
import { PostDetails } from "@components/post-details/post-details";
import { ModalMode } from "@models/modal-mode";
import { EventTable } from "@components/event-table/event-table";
import { Pagination } from "@components/pagination/pagination";
import { form, FormField } from "@angular/forms/signals";
import { PaginatedResponse, PaginationParameters } from "@services/apiService/api.service";
import { Event } from "@models/event";
import { OrganizerEventService } from "@services/organizerEventService/organizer-event.service";
import { EventState } from "@models/event-state";

@Component({
  selector: "app-posts",
  imports: [TranslocoDirective, DropDownSelectComponent, Modal, PostDetails, EventTable, Pagination, FormField],
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
  }));

  async ngOnInit(): Promise<void> {
    this.paginatedEvents.set(await this.organizerEventService.getOrganizerEvents({
      ...this.searchEventForm.pagination().value(),
      activityAreas: this.searchEventForm.activityAreas().value(),
      tags: this.searchEventForm.tags().value(),
      title: this.searchEventForm.title().value(),
      startDate: this.searchEventForm.startDate().value(),
      endDate: this.searchEventForm.endDate().value(),
      state: this.searchEventForm.state().value(),
    }));
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
