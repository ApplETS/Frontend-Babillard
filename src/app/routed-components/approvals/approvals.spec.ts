import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Approvals } from "./approvals";
import { TranslocoTestingModule } from "@jsverse/transloco";
import { ApprovalService } from "@services/approvalService/approval.service";
import { emptyPaginatedResponse } from "@services/apiService/api.service";

describe("Approvals", () => {
  let component: Approvals;
  let fixture: ComponentFixture<Approvals>;
  let approvalService = {
    getApprovalEvents: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Approvals,         
        TranslocoTestingModule.forRoot({
                langs: {
                  en: {},
                  fr: {},
                },
                preloadLangs: true,
                translocoConfig: {},
              }),
      ],
      providers: [{ provide: ApprovalService, useValue: approvalService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Approvals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", async () => {
    expect(component).toBeTruthy();
  });
});
