import { TestBed } from '@angular/core/testing';

import { AdminshopService } from './adminshop.service';

describe('AdminshopService', () => {
  let service: AdminshopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminshopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
