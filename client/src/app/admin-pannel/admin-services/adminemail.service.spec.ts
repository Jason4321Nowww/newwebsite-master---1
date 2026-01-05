import { TestBed } from '@angular/core/testing';

import { AdminemailService } from './adminemail.service';

describe('AdminemailService', () => {
  let service: AdminemailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminemailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
