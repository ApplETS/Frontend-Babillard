import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Calendar } from './calendar';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;

  beforeEach(async () => {
    TestBed.overrideComponent(Calendar, {
      set: {
        template: '<div></div>',
      },
    });

    await TestBed.configureTestingModule({
      imports: [Calendar],
    }).compileComponents();

    fixture = TestBed.createComponent(Calendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
