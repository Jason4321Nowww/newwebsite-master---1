import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PressService } from '../services/press.service';
import { PressRelease } from '../_models/press';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-press-detail',
  templateUrl: './press-detail.component.html',
  styleUrls: ['./press-detail.component.scss']
})
export class PressDetailComponent implements OnInit, OnDestroy {

  release?: PressRelease;
  private langSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private pressService: PressService,
    public langService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {}

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
}
