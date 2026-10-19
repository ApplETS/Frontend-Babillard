import { TestBed } from '@angular/core/testing';

import { OrganizerEvent } from './organizer-event';

describe('OrganizerEvent', () => {
  let service: OrganizerEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizerEvent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
