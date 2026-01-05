import { TestBed } from '@angular/core/testing';

import { AdminpressService } from './adminpress.service';

describe('AdminpressService', () => {
  let service: AdminpressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminpressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
