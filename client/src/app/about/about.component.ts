import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
 

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit { 

    supporters = [
    { image: '/assets/images/FrancescoL.png', name: 'Francesco L.' },
    { image: '/assets/images/ChristianB.png', name: 'Christian B.' },
    { image: '/assets/images/LeonK.png', name: 'Leon K.' },
    { image: '/assets/images/DusanD.png', name: 'Dusan D.' },
    { image: '/assets/images/JariG.png', name: 'Jane D.' },
    { image: '/assets/images/ThomasB.png', name: 'Tom L.' },
    { image: '/assets/images/StephanieBeere_Kreis.png', name: 'Mark T.' }
  ];

 constructor(private router:Router){}

   ngOnInit(): void {
    // Force smooth scroll to top whenever this component loads
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }
  


}


