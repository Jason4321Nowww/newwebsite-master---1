import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { LocationService, Canton } from 'src/app/services/location.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  // Registration key from the invite URL — forwarded to the verify page
  private regKey = '';

  // Cascading location data
  cantons:  Canton[] = [];
  bezirke:  string[] = [];
  gemeinden: string[] = [];

  selectedKantonCode = '';
  selectedKantonName = '';
  selectedBezirk     = '';
  selectedGemeinde   = '';

  constructor(
    private fb:          FormBuilder,
    private auth:        AuthService,
    private router:      Router,
    private route:       ActivatedRoute,
    public  langService: LanguageService,
    private locationSvc: LocationService,
  ) {}

  signupForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submitting  = false;
  serverError = '';

  ngOnInit(): void {
    this.regKey = this.route.snapshot.queryParamMap.get('key') || '';
    this.locationSvc.getCantons().subscribe({
      next: (data) => { this.cantons = data; },
      error: () => {}
    });
  }

  onKantonChange(kantonCode: string): void {
    const canton = this.cantons.find(c => c.kantonCode === kantonCode);
    this.selectedKantonCode = kantonCode;
    this.selectedKantonName = canton?.kantonName || '';
    this.selectedBezirk     = '';
    this.selectedGemeinde   = '';
    this.bezirke            = [];
    this.gemeinden          = [];

    if (kantonCode) {
      this.locationSvc.getBezirke(kantonCode).subscribe({
        next: (data) => { this.bezirke = data; },
        error: () => {}
      });
    }
  }

  onBezirkChange(bezirk: string): void {
    this.selectedBezirk   = bezirk;
    this.selectedGemeinde = '';
    this.gemeinden        = [];

    if (bezirk && this.selectedKantonCode) {
      this.locationSvc.getGemeinden(this.selectedKantonCode, bezirk).subscribe({
        next: (data) => { this.gemeinden = data; },
        error: () => {}
      });
    }
  }

  signup() {
    if (this.signupForm.invalid) return;
    this.submitting  = true;
    this.serverError = '';

    const { username, email, password } = this.signupForm.value;
    const userLocation = {
      kantonCode: this.selectedKantonCode,
      kantonName: this.selectedKantonName,
      bezirk:     this.selectedBezirk,
      gemeinde:   this.selectedGemeinde,
    };

    this.auth.signup({ username, email, password, userLocation }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.router.navigate(['/verify-email'], {
          queryParams: { uid: res.userId },
        });
      },
      error: (err) => {
        this.submitting  = false;
        this.serverError = err.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
}
