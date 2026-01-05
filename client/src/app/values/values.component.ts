import { Component, VERSION, HostListener } from '@angular/core';
import { gsap } from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

@Component({
  selector: 'app-values',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.scss'],
})
export class ValuesComponent {
  ngOnInit() {
    this.setupGsap();
  }

  setupGsap(): void {
      gsap.from('.extra-box', {
    scrollTrigger: '.top-row',
    duration: 1,
    opacity: 0,
    y: -50,
    stagger: 0.3,
  });
    gsap.from('.arbeit', {
      scrollTrigger: '.values-container',
      duration: 0.75,
      opacity: 0.3,
      x: -100,
    });

    gsap.from('.technologie', {
      scrollTrigger: '.values-container',
      duration: 1,
      opacity: 0.3,
      x: -500,
    });

    gsap.from('.umwelt', {
      scrollTrigger: '.values-container',
      duration: 1.5,
      opacity: 0.3,
      x: -800,
    });
  }
}
