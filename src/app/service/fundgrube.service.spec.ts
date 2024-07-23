import { TestBed } from '@angular/core/testing';

import { FundgrubeService } from './fundgrube.service';

describe('FundgrubeService', () => {
  let service: FundgrubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FundgrubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
