import { TestBed } from '@angular/core/testing';

import { AdmincontactService } from './admincontact.service';

describe('AdmincontactService', () => {
  let service: AdmincontactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdmincontactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
