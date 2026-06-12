import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil, filter, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';
import { LocationService, Canton } from 'src/app/services/location.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit, OnDestroy {

  // Cascading location data
  cantons:  Canton[] = [];
  bezirke:  string[] = [];
  gemeinden: string[] = [];

  selectedKantonCode = '';
  selectedKantonName = '';
  selectedBezirk     = '';
  selectedGemeinde   = '';

  private emailLang = 'de';

  constructor(
    private fb:          FormBuilder,
    private auth:        AuthService,
    private router:      Router,
    private route:       ActivatedRoute,
    public  langService: LanguageService,
    private locationSvc: LocationService,
  ) {}

  signupForm: FormGroup = this.fb.group({
    username:        ['', [Validators.required, Validators.minLength(3)]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(6)]],
    registrationKey: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
  });

  keyChecking = false;
  keyValid: boolean | null = null;

  submitting  = false;
  serverError = '';

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // If arriving from a registration-key email, adopt that language site-wide
    const urlLang = this.route.snapshot.queryParamMap.get('lang') as any;
    if (['de', 'fr', 'it', 'en'].includes(urlLang)) {
      this.langService.setLang(urlLang);
    }
    this.emailLang = this.langService.current;

    this.locationSvc.getCantons().subscribe({
      next: (data) => { this.cantons = data; },
      error: () => {}
    });

    this.signupForm.get('registrationKey')!.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap((val: string) => {
        if ((val || '').trim().length !== 20) {
          this.keyValid    = null;
          this.keyChecking = false;
        }
      }),
      filter((val: string) => (val || '').trim().length === 20),
      debounceTime(300),
      switchMap((val: string) => {
        this.keyChecking = true;
        this.keyValid    = null;
        return this.auth.validateRegistrationKey(val.trim()).pipe(
          catchError(() => of({ valid: false }))
        );
      })
    ).subscribe(res => {
      this.keyChecking = false;
      this.keyValid    = res.valid;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    const { username, email, password, registrationKey } = this.signupForm.value;
    const userLocation = {
      kantonCode: this.selectedKantonCode,
      kantonName: this.selectedKantonName,
      bezirk:     this.selectedBezirk,
      gemeinde:   this.selectedGemeinde,
    };
    this.auth.signup({ username, email, password, userLocation, lang: this.emailLang, registrationKey }).subscribe({
      next: (res) => {
        this.submitting = false;
        this.router.navigate(['/verify-email'], {
          queryParams: { uid: res.userId, lang: this.emailLang },
        });
      },
      error: (err) => {
        this.submitting  = false;
        this.serverError = err.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
}
