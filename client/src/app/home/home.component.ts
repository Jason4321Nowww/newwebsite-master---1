import { Component, OnInit } from '@angular/core';

import { InfoBanner } from 'src/app/_models/infoBanner';
import { InfoBannerService } from '../services/info-banner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeBanner: InfoBanner | null = null;

  constructor(private infoBanner: InfoBannerService) {}

  ngOnInit(): void {
    this.infoBanner.getBanners().subscribe(banners => {
      this.activeBanner = banners.find(b => b.isActive) || null;
    });
  }
}
