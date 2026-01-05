import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinAndDonatePopupComponent } from './join-and-donate-popup.component';

describe('JoinAndDonatePopupComponent', () => {
  let component: JoinAndDonatePopupComponent;
  let fixture: ComponentFixture<JoinAndDonatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinAndDonatePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinAndDonatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
