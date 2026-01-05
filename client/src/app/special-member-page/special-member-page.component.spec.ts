import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialMemberPageComponent } from './special-member-page.component';

describe('SpecialMemberPageComponent', () => {
  let component: SpecialMemberPageComponent;
  let fixture: ComponentFixture<SpecialMemberPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialMemberPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpecialMemberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
