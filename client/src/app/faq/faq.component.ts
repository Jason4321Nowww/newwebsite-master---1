import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor(private router: Router, public langService: LanguageService) {}

  ngOnInit(): void {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  faqs = [
    { key: 'faq.q1', expanded: false },
    { key: 'faq.q2', expanded: false },
    { key: 'faq.q3', expanded: false },
    { key: 'faq.q4', expanded: false },
    { key: 'faq.q5', expanded: false },
  ];

  isAnyPanelOpen(): boolean {
    return this.faqs.some(faq => faq.expanded);
  }
}
