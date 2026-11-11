import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Posts } from "./posts";
import { TranslocoTestingModule } from "@jsverse/transloco";
import { Modal } from "@components/modal/modal";
import { OrganizerEventService } from "@services/organizerEventService/organizer-event.service";
import { emptyPaginatedResponse } from "@services/apiService/api.service";
import { ModalMode } from "@models/modal-mode";
import { EventSelectedEvent } from "@components/event-table/event-table";
import { DropdownMenuItemAction } from "@components/dropdown-menu/dropdown-menu";
import { Signal } from "@angular/core";

describe("Posts", () => {
  let component: Posts;
  let fixture: ComponentFixture<Posts>;

  const organizerEventService = {
    getOrganizerEvents: vi.fn(),
  };

  const modalMock = {
    showModal: vi.fn(),
    dismissModal: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          langs: {
            en: {},
            fr: {},
          },
          preloadLangs: true,
          translocoConfig: {},
        }),
      ],
      providers: [{ provide: OrganizerEventService, useValue: organizerEventService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Posts);
    organizerEventService.getOrganizerEvents.mockReturnValue(
      Promise.resolve(emptyPaginatedResponse()),
    );
    component = fixture.componentInstance;
    component.modal = (() => modalMock) as unknown as Signal<Modal>; // C'est peut-être un peu cursed, mais ça a le mérite d'être relativement simple
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show modal when createNewPost is called", () => {
    component.createNewPost();
    expect(modalMock.showModal).toHaveBeenCalled();
    expect(modalMock.dismissModal).not.toHaveBeenCalled();
    expect(component.modalMode()).toBe(ModalMode.create);
    expect(component.selectedEvent()).toBeNull();
  });

  it("should reset modal when resetModal is called", () => {
    component.resetModal();
    expect(modalMock.dismissModal).toHaveBeenCalled();
    expect(modalMock.showModal).not.toHaveBeenCalled();
    expect(component.modalMode()).toBe(ModalMode.default);
    expect(component.selectedEvent()).toBeNull();
  });

  it("should set event when selectEvent is called", () => {
    const e: EventSelectedEvent = {
      action: DropdownMenuItemAction.modify,
      event: {
        id: "1",
        title: "Test Event",
      } as any,
    };
    component.selectEvent(e);
    expect(modalMock.showModal).toHaveBeenCalled();
    expect(modalMock.dismissModal).not.toHaveBeenCalled();
    expect(component.selectedEvent()).toBe(e.event);
    expect(component.modalMode()).toBe(ModalMode.modify);
  });
});
