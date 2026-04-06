import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { environment } from '@environment/environment';
import { Injectable } from '@angular/core';
import { inject } from 'vitest';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestApiService extends ApiService{
  protected override apiController: string = "test";

  constructor(){
    super();
  }

  public override getActionUrl(action: string): string {
    return super.getActionUrl(action);
  }
}

describe('ApiService', () => {
  let service: TestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should return "${environment.apiUrl}/api/test/testAction"`, () => {
    const expectedUrl = `${environment.apiUrl}/api/test/testAction`;
    
    const actionUrl = service.getActionUrl("testAction");

    expect(actionUrl).toBe(expectedUrl);
  })
});
