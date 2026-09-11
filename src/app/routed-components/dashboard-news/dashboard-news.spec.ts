import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsService } from '@services/dashboard.service/events.service';
import { vi } from 'vitest';

import { DashboardNews } from './dashboard-news';
import { ActivityAreaDisplay, ActivityAreaService } from '@services/activityAreaService/activity-area.service';
import { computed } from '@angular/core';

describe('DashboardNews', () => {
  let component: DashboardNews;
  let fixture: ComponentFixture<DashboardNews>;

  const eventsServiceMock = {
    getEvents: vi.fn(),
  };

  const activityAreaServiceMock = {
    getActivityAreas: vi.fn(),
  };

  beforeEach(async () => {
    TestBed.overrideComponent(DashboardNews, {
      set: {
        template: '<div></div>',
      },
    });

    await TestBed.configureTestingModule({
      imports: [DashboardNews],
      providers: [
        { provide: EventsService, useValue: eventsServiceMock },
        { provide: ActivityAreaService, useValue: activityAreaServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardNews);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.selectedCardId()).toBeNull();
    expect(component.loading()).toBe(true);
  });

  it('should call getActivityAreas on ngOnInit', async () => {
    activityAreaServiceMock.getActivityAreas.mockResolvedValue([]);
    await component.ngOnInit();
    expect(activityAreaServiceMock.getActivityAreas).toHaveBeenCalled();
  });

  it('should call getEvents when changes detected and activity areas are not empty', async () => {
    const area = new ActivityAreaDisplay({
      id: '1',
      nameEn: 'Area 1',
      nameFr: 'Zone 1',
    }, {} as any);
    area.name = computed(() => 'Area 1');

    activityAreaServiceMock.getActivityAreas.mockResolvedValue([area]);
    eventsServiceMock.getEvents.mockResolvedValue([]);
    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(eventsServiceMock.getEvents).toHaveBeenCalled();
    expect(eventsServiceMock.getEvents).toHaveBeenCalledAfter(activityAreaServiceMock.getActivityAreas);

    expect(component.loading()).toBe(false);
  });

  it('should not call getEvents when activity areas are empty', async () => {
    activityAreaServiceMock.getActivityAreas.mockResolvedValue([]);
    await component.ngOnInit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(activityAreaServiceMock.getActivityAreas).toHaveBeenCalled();
    expect(eventsServiceMock.getEvents).not.toHaveBeenCalled();

    expect(component.loading()).toBe(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  })
});
