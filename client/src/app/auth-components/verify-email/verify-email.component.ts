import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  userId = '';
  otp    = '';

  submitting  = false;
  verified    = false;
  error       = '';
  expiredOtp  = false;

  resending      = false;
  resendMessage  = '';
  resendCooldown = 0;
  private cooldownTimer: any;

  constructor(
    private route:       ActivatedRoute,
    private router:      Router,
    private authService: AuthService,
    public  langService: LanguageService,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('uid') || '';

    const urlLang = this.route.snapshot.queryParamMap.get('lang') as any;
    if (['de', 'fr', 'it', 'en'].includes(urlLang)) {
      this.langService.setLang(urlLang);
    }
  }

  ngOnDestroy(): void {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer);
  }

  get canSubmit(): boolean {
    return this.otp.trim().length === 6 && !this.submitting;
  }

  verify(): void {
    if (!this.canSubmit) return;
    this.submitting = true;
    this.error      = '';
    this.expiredOtp = false;

    this.authService.verifyEmailOtp(this.userId, this.otp.trim()).subscribe({
      next: () => {
        this.submitting = false;
        this.verified   = true;
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 410) {
          this.expiredOtp = true;
        } else if (err.status === 400 && err.error?.message?.toLowerCase().includes('already verified')) {
          this.error = this.langService.t('verify.errAlreadyVerified');
        } else if (err.status === 400) {
          this.error = this.langService.t('verify.errIncorrect');
        } else {
          this.error = this.langService.t('verify.errGeneral');
        }
      },
    });
  }

  resend(): void {
    if (this.resending || this.resendCooldown > 0) return;
    this.resending     = true;
    this.resendMessage = '';
    this.error         = '';
    this.expiredOtp    = false;

    this.authService.resendEmailOtp(this.userId).subscribe({
      next: () => {
        this.resending     = false;
        this.resendMessage = this.langService.t('verify.resendSuccess');
        this.startCooldown(60);
      },
      error: () => {
        this.resending = false;
        this.error     = this.langService.t('verify.errResend');
      },
    });
  }

  private startCooldown(seconds: number): void {
    this.resendCooldown = seconds;
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.cooldownTimer);
        this.resendCooldown = 0;
      }
    }, 1000);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
