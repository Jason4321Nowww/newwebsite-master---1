import { TestBed } from '@angular/core/testing';

import { AdminorderService } from './adminorder.service';

describe('AdminorderService', () => {
  let service: AdminorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
