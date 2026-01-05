import { Component, OnInit } from '@angular/core';
import { PressService } from '../services/press.service';
import { PressRelease } from '../_models/press';

@Component({
  selector: 'app-press',
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.scss']
})
export class PressComponent implements OnInit {
  latestRelease: PressRelease | null = null;

  constructor(private pressService: PressService) {}

  ngOnInit(): void {
    this.pressService.getAllReleases().subscribe(releases => {
      if (releases && releases.length > 0) {
        this.latestRelease = releases.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
      }
    });
  }
}



















































// import { Component, OnInit } from '@angular/core';
// import { PressService } from '../services/press.service';
// import { PressRelease } from '../_models/press';

// @Component({
//   selector: 'app-press',
//   templateUrl: './press.component.html',
//   styleUrls: ['./press.component.scss']
// })
// export class PressComponent implements OnInit {
//   latestRelease: PressRelease | null = null;

//   constructor(private pressService: PressService) {}

//   ngOnInit(): void {
//     this.pressService.getAllReleases().subscribe(releases => {
//       if (releases && releases.length > 0) {
//         this.latestRelease = releases.sort((a, b) =>
//           new Date(b.date).getTime() - new Date(a.date).getTime()
//         )[0];
//       }
//     });
//   }
// }
