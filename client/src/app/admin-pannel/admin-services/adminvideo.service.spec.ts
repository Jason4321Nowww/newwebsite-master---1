import { TestBed } from '@angular/core/testing';

import { AdminvideoService } from './adminvideo.service';

describe('AdminvideoService', () => {
  let service: AdminvideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminvideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
