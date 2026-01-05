import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInfobannerComponent } from './admin-infobanner.component';

describe('AdminInfobannerComponent', () => {
  let component: AdminInfobannerComponent;
  let fixture: ComponentFixture<AdminInfobannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminInfobannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminInfobannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
