import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminuserService } from '../admin-services/adminuser.service';

@Component({
  selector: 'app-admin-accept-invite',
  templateUrl: './admin-accept-invite.component.html',
  styleUrl: './admin-accept-invite.component.scss'
})
export class AdminAcceptInviteComponent implements OnInit {
  token       = '';
  inviteInfo: { email: string; roleName: string; roleLevel: number } | null = null;
  inviteError = '';

  name            = '';
  password        = '';
  confirmPassword = '';
  private regKey  = '';

  submitting  = false;
  submitted   = false;
  submitError = '';

  constructor(
    private route:        ActivatedRoute,
    private router:       Router,
    private adminUserSvc: AdminuserService,
    private http:         HttpClient,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.inviteError = 'No invitation token found.';
      return;
    }
    this.adminUserSvc.validateInviteToken(this.token).subscribe({
      next: (data) => {
        this.inviteInfo = data;
        // Silently fetch the registration key using the invite token
        this.http.get<{ key: string }>(`http://localhost:5000/api/auth/invite-key?token=${this.token}`)
          .subscribe({ next: (r) => { this.regKey = r.key; }, error: () => {} });
      },
      error: (err)  => { this.inviteError = err.error?.error || 'Invalid or expired invitation.'; },
    });
  }

  get passwordMismatch(): boolean {
    return !!this.confirmPassword && this.password !== this.confirmPassword;
  }

  onSubmit(): void {
    if (!this.name.trim() || !this.password || this.passwordMismatch) return;
    this.submitting  = true;
    this.submitError = '';

    this.adminUserSvc.acceptInvite(this.token, this.name.trim(), this.password, this.regKey).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted  = true;
      },
      error: (err) => {
        this.submitting  = false;
        this.submitError = err.error?.error || 'Failed to create account.';
      },
    });
  }
}
