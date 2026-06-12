import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  webseitenTitel: string = 'Büezer und KMU Partei (BKP)';
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router, public langService: LanguageService) {}

  scrollTo(fragment: string) {
    this.router.navigate(['/'], { fragment }).then(() => {
      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    });
  }
}
