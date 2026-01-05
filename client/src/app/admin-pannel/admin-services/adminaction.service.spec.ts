import { TestBed } from '@angular/core/testing';

import { AdminactionService } from './adminaction.service';

describe('AdminactionService', () => {
  let service: AdminactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
