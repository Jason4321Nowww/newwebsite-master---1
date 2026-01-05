import { TestBed } from '@angular/core/testing';

import { AdmineventService } from './adminevent.service';

describe('AdmineventService', () => {
  let service: AdmineventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmineventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
