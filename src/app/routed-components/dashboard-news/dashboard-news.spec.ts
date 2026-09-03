import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsService } from '@services/dashboard.service/events.service';
import { vi } from 'vitest';

import { DashboardNews } from './dashboard-news';

describe('DashboardNews', () => {
  let component: DashboardNews;
  let fixture: ComponentFixture<DashboardNews>;

  const eventsServiceMock = {
    getEvents: vi.fn().mockResolvedValue({
      data: [],
      pageSize: 0,
      totalRecords: 0,
      totalPages: 0,
      error: null,
    }),
  };

  beforeEach(async () => {
    TestBed.overrideComponent(DashboardNews, {
      set: {
        template: '<div></div>',
      },
    });

    await TestBed.configureTestingModule({
      imports: [DashboardNews],
      providers: [{ provide: EventsService, useValue: eventsServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardNews);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.selectedCardId()).toBeNull();
  });
});
