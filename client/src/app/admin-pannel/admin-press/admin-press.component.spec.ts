import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPressComponent } from './admin-press.component';

describe('AdminPressComponent', () => {
  let component: AdminPressComponent;
  let fixture: ComponentFixture<AdminPressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminPressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
