import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-and-donate-popup',
  templateUrl: './join-and-donate-popup.component.html',
  styleUrls: ['./join-and-donate-popup.component.scss'],
})
export class JoinAndDonatePopupComponent {
  popup: Boolean = true;
  
  @ViewChild('popupRef') popupRef!: ElementRef;

  constructor(private router: Router) {}

  closePopup(): void {
    this.popup = false;
  }

  openDonationWindow(): void {
    this.closePopup();
    this.router.navigate(['/spenden']);
  }


   @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.popupRef?.nativeElement.contains(event.target);
    if (!clickedInside && this.popup) {
      this.closePopup();
    }
  }
}