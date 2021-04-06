import { TestBed } from '@angular/core/testing';

import { AuctionsService } from './auctions.service';

describe('AuctionsService', () => {
  let service: AuctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
