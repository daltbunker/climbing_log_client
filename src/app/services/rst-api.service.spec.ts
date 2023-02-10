import { TestBed } from '@angular/core/testing';

import { RstApiService } from './rst-api.service';

describe('RstApiService', () => {
  let service: RstApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RstApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
