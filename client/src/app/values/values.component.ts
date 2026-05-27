import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageService } from '../services/language.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.scss'],
})
export class ValuesComponent implements AfterViewInit {
  constructor(public langService: LanguageService) {}

  ngAfterViewInit(): void {
    // Skip GSAP on mobile — elements stay fully visible.
    // On mobile, ScrollTrigger miscalculates positions due to the shifting
    // URL bar, and gsap.from() immediately sets opacity:0, leaving boxes
    // permanently invisible if the trigger never fires.
    if (window.innerWidth <= 900) return;

    setTimeout(() => {
      this.setupGsap();
      ScrollTrigger.refresh();
    }, 150);
  }

  setupGsap(): void {
    // Top boxes — fade down with stagger
    gsap.from('.extra-box', {
      scrollTrigger: {
        trigger: '.top-row',
        start: 'top 85%',
        once: true,
      },
      duration: 0.65,
      opacity: 0,
      y: -40,
      stagger: 0.2,
      ease: 'power2.out',
    });

    // Arbeit — slide from left
    gsap.from('.arbeit', {
      scrollTrigger: {
        trigger: '.values',
        start: 'top 85%',
        once: true,
      },
      duration: 0.7,
      opacity: 0,
      x: -60,
      ease: 'power2.out',
    });

    // Technologie — slide from bottom
    gsap.from('.technologie', {
      scrollTrigger: {
        trigger: '.values',
        start: 'top 85%',
        once: true,
      },
      duration: 0.7,
      opacity: 0,
      y: 60,
      delay: 0.15,
      ease: 'power2.out',
    });

    // Umwelt — slide from right
    gsap.from('.umwelt', {
      scrollTrigger: {
        trigger: '.values',
        start: 'top 85%',
        once: true,
      },
      duration: 0.7,
      opacity: 0,
      x: 60,
      delay: 0.3,
      ease: 'power2.out',
    });
  }
}
