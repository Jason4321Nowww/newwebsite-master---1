import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortsVideoPlayerComponent } from './shorts-videoplayer.component';

describe('CustomContentSliderComponent', () => {
  let component: ShortsVideoPlayerComponent;
  let fixture: ComponentFixture<ShortsVideoPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortsVideoPlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortsVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
