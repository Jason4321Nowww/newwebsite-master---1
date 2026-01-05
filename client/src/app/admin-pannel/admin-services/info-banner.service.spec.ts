import { TestBed } from '@angular/core/testing';

import { InfoBannerService } from './info-banner.service';

describe('InfoBannerService', () => {
  let service: InfoBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
