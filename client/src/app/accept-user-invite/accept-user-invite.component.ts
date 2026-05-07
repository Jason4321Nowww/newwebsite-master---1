import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-accept-user-invite',
  templateUrl: './accept-user-invite.component.html',
  styleUrl: './accept-user-invite.component.scss'
})
export class AcceptUserInviteComponent implements OnInit {
  private readonly apiBase = 'http://localhost:5000/api/auth';

  token          = '';
  inviteInfo: { email: string; roleName: string; roleLevel: number } | null = null;
  inviteError    = '';
  inviteExpired  = false;   // true when server returns 410

  username        = '';
  password        = '';
  confirmPassword = '';
  otp             = '';
  private regKey  = '';

  submitting  = false;
  submitted   = false;
  submitError = '';

  constructor(
    private route: ActivatedRoute,
    private http:  HttpClient,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.inviteError = 'No invitation token found.';
      return;
    }
    this.http.get<any>(`${this.apiBase}/user-invite/${this.token}`).subscribe({
      next:  (data) => {
        this.inviteInfo = data;
        // Silently fetch the registration key using the invite token
        this.http.get<{ key: string }>(`${this.apiBase}/invite-key?token=${this.token}`)
          .subscribe({ next: (r) => { this.regKey = r.key; }, error: () => {} });
      },
      error: (err)  => {
        if (err.status === 410) {
          this.inviteExpired = true;
        } else {
          this.inviteError = err.error?.error || 'Invalid or expired invitation.';
        }
      },
    });
  }

  get passwordMismatch(): boolean {
    return !!this.confirmPassword && this.password !== this.confirmPassword;
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.password || !this.otp.trim() || this.passwordMismatch) return;
    this.submitting  = true;
    this.submitError = '';

    this.http.post<any>(`${this.apiBase}/user-invite/${this.token}/accept`, {
      username:        this.username.trim(),
      password:        this.password,
      otp:             this.otp.trim(),
      registrationKey: this.regKey,
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
