import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoBanner } from 'src/app/_models/infoBanner';
import { InfoBannerService } from '../admin-services/info-banner.service';

@Component({
  selector: 'app-admin-infobanner',
  templateUrl: './admin-infobanner.component.html',
  styleUrl: './admin-infobanner.component.scss'
})
export class AdminInfobannerComponent  implements OnInit {
  bannerForm!: FormGroup;
  banners: InfoBanner[] = [];
  selectedBanner: InfoBanner | null = null;

  constructor(
    private fb: FormBuilder,
    private infoBanner: InfoBannerService
  ) {}

  ngOnInit(): void {
    this.bannerForm = this.fb.group({
      statement: ['', Validators.required],
      link: [''],  
      isActive: [false]
    });

    this.loadBanners();
  }

  loadBanners(): void {
    this.infoBanner.getBanners().subscribe(data => this.banners = data);
  }

  submitForm(): void {
    const bannerData = this.bannerForm.value;

    if (this.selectedBanner) {
      this.infoBanner.updateBanner(this.selectedBanner.id!, bannerData).subscribe(() => {
        this.bannerForm.reset();
        this.selectedBanner = null;
        this.loadBanners();
         this.resetTextareaHeight();
      });
    } else {
      this.infoBanner.createBanner(bannerData).subscribe(() => {
        this.bannerForm.reset();
        this.loadBanners();
         this.resetTextareaHeight();
      });
    }
  }

 editBanner(banner: InfoBanner): void {
  this.bannerForm.patchValue({
    statement: banner.statement,
    link: banner.link || '', 
    isActive: banner.isActive
  });
  this.selectedBanner = banner;

  // Wait for view to update, then grow textarea
  setTimeout(() => {
    const textarea = document.querySelector('textarea[formControlName="statement"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  });
}


  toggleActive(id: string): void {
    const banner = this.banners.find(b => b.id === id);
    if (!banner) return;

    this.infoBanner.updateBanner(id, { ...banner, isActive: !banner.isActive }).subscribe(() => {
      this.loadBanners();
    });
  }

  deleteBanner(id: string): void {
    this.infoBanner.deleteBanner(id).subscribe(() => {
      this.loadBanners();
    });
  }
resetTextareaHeight(): void {
  setTimeout(() => {
    const textarea = document.querySelector('textarea[formControlName="statement"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = '80px';
    }
  });
}


cancelEdit(): void {
  this.bannerForm.reset();
  this.selectedBanner = null;
  this.resetTextareaHeight();
}

autoGrow(event: Event): void {
  const textarea = event.target as HTMLTextAreaElement;
  const defaultHeight  = 'auto'
  textarea.style.height = defaultHeight;
  textarea.style.height = textarea.scrollHeight + 'px';
}


}