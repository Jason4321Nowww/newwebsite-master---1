import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  userId          = '';
  otp             = '';
  private regKey  = '';

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
    private http:        HttpClient,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('uid') || '';
    if (!this.userId) {
      this.error = 'No user ID found. Please sign up again.';
      return;
    }
    // Silently fetch the registration key — never shown to the user
    this.http.get<{ key: string }>(`http://localhost:5000/api/auth/signup-key?userId=${this.userId}`)
      .subscribe({ next: (res) => { this.regKey = res.key; }, error: () => {} });
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

    this.authService.verifyEmailOtp(this.userId, this.otp.trim(), this.regKey).subscribe({
      next: () => {
        this.submitting = false;
        this.verified   = true;
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 410) {
          this.expiredOtp = true;
        } else {
          this.error = err.error?.message || 'Verification failed. Please try again.';
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
      next: (res) => {
        this.resending     = false;
        this.resendMessage = res.message;
        this.startCooldown(60);
      },
      error: (err) => {
        this.resending = false;
        this.error     = err.error?.message || 'Failed to resend code. Please try again.';
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
