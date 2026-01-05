import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

constructor(private router:Router){}

   ngOnInit(): void {
    // Force smooth scroll to top whenever this component loads
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

isAnyPanelOpen(): boolean {
  return this.faqs.some(faq => faq.expanded);
}

faqs = [
  {
    question: 'What is the purpose of the United Nations (UN)?',
    answer: `The United Nations was established to promote international peace, security, and cooperation. 
It provides a platform for diplomacy and conflict resolution. 
Member states work together on issues such as human rights, development, and climate change.`,
    expanded: false
  },
  {
    question: 'How does diplomacy shape international relations?',
    answer: `Diplomacy enables peaceful dialogue between nations and prevents conflicts. 
It involves negotiation, representation, and the building of mutual trust. 
Diplomats work to secure agreements that align with national interests while maintaining global stability.`,
    expanded: false
  },
  {
    question: 'What is soft power in international relations?',
    answer: `Soft power is a country’s ability to influence others through culture, values, and diplomacy. 
Unlike military force, it attracts rather than coerces. 
Nations use media, education, and global cooperation to build a favorable international image.`,
    expanded: false
  },
  {
    question: 'Why is international trade important?',
    answer: `International trade fosters economic growth and strengthens diplomatic ties. 
It allows nations to specialize in production and access diverse resources. 
Trade agreements also promote interdependence, reducing the likelihood of conflicts.`,
    expanded: false
  },
  {
    question: 'What role do international organizations play?',
    answer: `International organizations coordinate global efforts on health, security, and development. 
They create forums for negotiation and enforce international norms. 
Examples include the UN, WTO, IMF, and WHO, which shape global governance.`,
    expanded: false
  }
];


}
