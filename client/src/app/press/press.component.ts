import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PressService } from '../services/press.service';
import { PressRelease } from '../_models/press';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-press',
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.scss']
})
export class PressComponent implements OnInit {
  releases: PressRelease[] = [];

  constructor(private pressService: PressService, public langService: LanguageService, private router: Router) {}

  ngOnInit(): void {
    this.pressService.getAllReleases().subscribe(releases => {
      this.releases = (releases || []).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  openRelease(id: string): void {
    this.router.navigate(['/press', id]);
  }

  getExcerpt(release: PressRelease): string {
    const content = this.langService.getField(release, 'content');
    const stripped = content.replace(/<[^>]*>/g, '');
    return stripped.length > 150 ? stripped.slice(0, 150) + '…' : stripped;
  }
}
