import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoService } from '@jsverse/transloco';
import { vi } from 'vitest';

import { Publications } from './publications';

describe('Publications', () => {
  let component: Publications;
  let fixture: ComponentFixture<Publications>;

  const translocoServiceMock = {
    translate: vi.fn((key: string) => key),
  };

  beforeEach(async () => {
    TestBed.overrideComponent(Publications, {
      set: {
        template: '<div #cardContainer></div>',
      },
    });

    await TestBed.configureTestingModule({
      imports: [Publications],
      providers: [{ provide: TranslocoService, useValue: translocoServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Publications);
    component = fixture.componentInstance;
    component.events = {
      data: [],
      pageSize: 0,
      totalRecords: 0,
      totalPages: 0,
      error: null,
    };
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
