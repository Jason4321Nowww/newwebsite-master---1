import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  webseitenTitel: string = 'Büezer und KMU Partei (BKP)';

  constructor(private router: Router) {
  }
  scrollTo(fragment: string) {
    // Navigate to home first if not on home page
    this.router.navigate(['/'], { fragment }).then(() => {
      // Wait a tick to ensure Angular renders the DOM
      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    });
  }




}



