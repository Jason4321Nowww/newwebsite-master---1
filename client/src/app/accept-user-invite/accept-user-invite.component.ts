import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { takeUntil, debounceTime, switchMap, tap, filter, catchError } from 'rxjs/operators';
import { LanguageService } from 'src/app/services/language.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-accept-user-invite',
  templateUrl: './accept-user-invite.component.html',
  styleUrl: './accept-user-invite.component.scss'
})
export class AcceptUserInviteComponent implements OnInit, OnDestroy {
  private readonly apiBase = '/api/auth';

  token          = '';
  inviteInfo: { email: string; roleName: string; roleLevel: number; lang: string } | null = null;
  inviteError    = '';
  inviteExpired  = false;

  username         = '';
  password         = '';
  confirmPassword  = '';
  otp              = '';
  registrationKey  = '';

  keyChecking = false;
  keyValid: boolean | null = null;

  submitting  = false;
  submitted   = false;
  submitError = '';

  private regKeyInput$ = new Subject<string>();
  private destroy$     = new Subject<void>();

  constructor(
    private route:      ActivatedRoute,
    private http:       HttpClient,
    public  langService: LanguageService,
    private auth:       AuthService,
  ) {}

  ngOnInit(): void {
    this.auth.clearAllSessions();

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.inviteError = this.langService.t('acceptInvite.invalidTitle');
      return;
    }
    this.http.get<any>(`${this.apiBase}/user-invite/${this.token}`).subscribe({
      next: (data) => {
        this.inviteInfo = data;
        if (data.lang) {
          this.langService.setLang(data.lang);
        }
      },
      error: (err) => {
        if (err.status === 410) {
          this.inviteExpired = true;
        } else {
          this.inviteError = err.error?.error || this.langService.t('acceptInvite.invalidTitle');
        }
      },
    });

    this.regKeyInput$.pipe(
      takeUntil(this.destroy$),
      tap((val: string) => {
        if (val.trim().length !== 20) {
          this.keyValid    = null;
          this.keyChecking = false;
        }
      }),
      filter((val: string) => val.trim().length === 20),
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

  onRegKeyChange(val: string): void {
    this.regKeyInput$.next(val);
  }

  onRegKeyBlur(): void {
    const val = this.registrationKey.trim();
    if (val.length === 20 && this.keyValid === null && !this.keyChecking) {
      this.keyChecking = true;
      this.auth.validateRegistrationKey(val).pipe(
        catchError(() => of({ valid: false }))
      ).subscribe(res => {
        this.keyChecking = false;
        this.keyValid    = res.valid;
      });
    }
  }

  get passwordMismatch(): boolean {
    return !!this.confirmPassword && this.password !== this.confirmPassword;
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.password || !this.otp.trim() || this.keyValid !== true || this.passwordMismatch) return;
    this.submitting  = true;
    this.submitError = '';

    this.http.post<any>(`${this.apiBase}/user-invite/${this.token}/accept`, {
      username:        this.username.trim(),
      password:        this.password,
      otp:             this.otp.trim(),
      registrationKey: this.registrationKey.trim(),
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted  = true;
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 410) {
          this.inviteExpired = true;
        } else {
          this.submitError = err.error?.error || 'Failed to create account.';
        }
      },
    });
  }
}
