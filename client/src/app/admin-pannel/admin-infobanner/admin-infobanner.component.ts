import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoBanner } from 'src/app/_models/infoBanner';
import { InfoBannerService } from '../admin-services/info-banner.service';

@Component({
  selector: 'app-admin-infobanner',
  templateUrl: './admin-infobanner.component.html',
  styleUrl: './admin-infobanner.component.scss'
})
export class AdminInfobannerComponent implements OnInit {
  bannerForm!: FormGroup;
  banners: InfoBanner[] = [];
  selectedBanner: InfoBanner | null = null;
  activeLang: string = 'de';
  readonly langMeta: Record<string, { label: string; flag: string }> = {
    de: { label: 'Deutsch (DE)', flag: 'assets/images/flags/de.svg' },
    it: { label: 'Italiano (IT)', flag: 'assets/images/flags/it.svg' },
    fr: { label: 'Français (FR)', flag: 'assets/images/flags/fr.svg' },
    en: { label: 'English (EN)', flag: 'assets/images/flags/gb.svg' },
  };
  selectedLangs: string[] = ['de'];

  showLangDropdown = false;

  get availableLangs(): string[] {
    return ['de', 'it', 'fr', 'en'].filter(l => !this.selectedLangs.includes(l));
  }

  @HostListener('document:click')
  closeLangDropdown(): void {
    this.showLangDropdown = false;
  }


  constructor(private fb: FormBuilder, private infoBanner: InfoBannerService) {}

  ngOnInit(): void {
    this.bannerForm = this.fb.group({
      statement: ['', Validators.required],
      statement_it: [''],
      statement_fr: [''],
      statement_en: [''],
      link: [''],
      isActive: [false]
    });
    this.loadBanners();
  }

  onLangChange(lang: string): void {
    this.activeLang = lang;
    if (!this.selectedLangs.includes(lang)) {
      this.selectedLangs.push(lang);
    }
  }

  removeLang(lang: string): void {
    if (lang === 'de') return;
    this.selectedLangs = this.selectedLangs.filter(l => l !== lang);
    const patch: any = {};
    patch[`statement_${lang}`] = '';
    this.bannerForm.patchValue(patch);
    if (this.activeLang === lang) this.activeLang = 'de';
  }

  loadBanners(): void {
    this.infoBanner.getBanners().subscribe(data => this.banners = data);
  }

  submitForm(): void {
    const bannerData = this.bannerForm.value;

    if (this.selectedBanner) {
      this.infoBanner.updateBanner(this.selectedBanner.id!, bannerData).subscribe(() => {
        this.resetForm();
        this.loadBanners();
      });
    } else {
      this.infoBanner.createBanner(bannerData).subscribe(() => {
        this.resetForm();
        this.loadBanners();
      });
    }
  }

  editBanner(banner: InfoBanner): void {
    this.bannerForm.patchValue({
      statement: banner.statement,
      statement_it: banner.statement_it || '',
      statement_fr: banner.statement_fr || '',
      statement_en: banner.statement_en || '',
      link: banner.link || '',
      isActive: banner.isActive
    });
    this.selectedBanner = banner;

    // Show chips for languages that already have content
    this.selectedLangs = ['de'];
    if (banner.statement_it) this.selectedLangs.push('it');
    if (banner.statement_fr) this.selectedLangs.push('fr');
    if (banner.statement_en) this.selectedLangs.push('en');

    setTimeout(() => {
      const textarea = document.querySelector('textarea[formControlName="statement"]') as HTMLTextAreaElement;
      if (textarea) { textarea.style.height = 'auto'; textarea.style.height = textarea.scrollHeight + 'px'; }
    });
  }

  toggleActive(id: string): void {
    const banner = this.banners.find(b => b.id === id);
    if (!banner) return;
    this.infoBanner.updateBanner(id, { ...banner, isActive: !banner.isActive }).subscribe(() => this.loadBanners());
  }

  deleteBanner(id: string): void {
    this.infoBanner.deleteBanner(id).subscribe(() => this.loadBanners());
  }

  cancelEdit(): void {
    this.resetForm();
  }

  autoGrow(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  private resetForm(): void {
    this.bannerForm.reset({ isActive: false });
    this.selectedBanner = null;
    this.activeLang = 'de';
    this.selectedLangs = ['de'];
    setTimeout(() => {
      const textarea = document.querySelector('textarea[formControlName="statement"]') as HTMLTextAreaElement;
      if (textarea) textarea.style.height = '80px';
    });
  }
}
