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
    this.setupGsap();
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
        start: 'top 80%',
        once: true,
      },
      duration: 0.7,
      opacity: 0,
      x: -80,
      ease: 'power2.out',
    });

    // Technologie — slide from bottom
    gsap.from('.technologie', {
      scrollTrigger: {
        trigger: '.values',
        start: 'top 80%',
        once: true,
      },
      duration: 0.7,
      opacity: 0,
      y: 80,
      delay: 0.15,
      ease: 'power2.out',
    });

    // Umwelt — slide from right
    gsap.from('.umwelt', {
      scrollTrigger: {
        trigger: '.values',
        start: 'top 80%',
        once: true,
      },
      duration: 0.7,
      opacity: 0,
      x: 80,
      delay: 0.3,
      ease: 'power2.out',
    });
  }
}
