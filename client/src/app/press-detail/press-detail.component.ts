import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PressService} from '../services/press.service';
import {PressRelease} from '../_models/press';
import {LanguageService} from '../services/language.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-press-detail',
  templateUrl: './press-detail.component.html',
  styleUrls: ['./press-detail.component.scss']
})
export class PressDetailComponent implements OnInit, OnDestroy {

  release?: PressRelease;
  lightboxSrc: string | null = null;
  private langSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pressService: PressService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.langSub = this.langService.lang$.subscribe(() => this.cdr.markForCheck());

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pressService.getReleaseById(id).subscribe({
        next: (data) => this.release = data,
        error: () => alert('Press release not found')
      });
    }
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  openLightbox(src: string): void {
    this.lightboxSrc = src;
  }

  closeLightbox(): void {
    this.lightboxSrc = null;
  }

  private readonly footerLabels: Record<string, string> = {
    de: 'Offizielle Pressemitteilung der\nBüezer und KMU Partei',
    it: 'Comunicato stampa ufficiale della\nBüezer und KMU Partei',
    fr: 'Communiqué de presse officiel du\nBüezer und KMU Partei',
    en: 'Official press release by the\nBüezer und KMU Party',
  };

  get pressFooterHtml(): string {
    const lang = this.langService.current || 'de';
    const text = this.footerLabels[lang] || this.footerLabels['de'];
    return text.split('\n').join('<br>');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.lightboxSrc = null;
  }
}
