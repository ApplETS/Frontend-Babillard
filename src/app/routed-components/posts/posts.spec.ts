import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Posts } from "./posts";
import { TranslocoTestingModule } from "@jsverse/transloco";
import { Modal } from "@components/modal/modal";
import { OrganizerEventService } from "@services/organizerEventService/organizer-event.service";
import { emptyPaginatedResponse } from "@services/apiService/api.service";

describe("Posts", () => {
  let component: Posts;
  let fixture: ComponentFixture<Posts>;

  const organizerEventService = {
    getOrganizerEvents: vi.fn(),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Posts,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {},
            fr: {},
          },
          preloadLangs: true,
          translocoConfig: {},
        }),
        Modal,
      ],
      providers: [
        { provide: OrganizerEventService, useValue: organizerEventService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Posts);
    organizerEventService.getOrganizerEvents.mockReturnValue(Promise.resolve(emptyPaginatedResponse()));
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
