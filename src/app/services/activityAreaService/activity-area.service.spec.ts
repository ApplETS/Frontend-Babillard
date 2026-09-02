import { TestBed } from '@angular/core/testing';

import { ActivityAreaService } from './activity-area.service';

describe('ActivityAreaService', () => {
  let service: ActivityAreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityAreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
