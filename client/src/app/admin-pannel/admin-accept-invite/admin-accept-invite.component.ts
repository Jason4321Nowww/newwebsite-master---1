import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AdminuserService} from '../admin-services/adminuser.service';
import {LanguageService} from 'src/app/services/language.service';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-accept-invite',
  templateUrl: './admin-accept-invite.component.html',
  styleUrl: './admin-accept-invite.component.scss'
})
export class AdminAcceptInviteComponent implements OnInit {
  token = '';
  inviteInfo: { email: string; roleName: string; roleLevel: number; lang: string } | null = null;
  inviteError = '';

  name = '';
  password = '';
  confirmPassword = '';

  submitting = false;
  submitted = false;
  submitError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminUserSvc: AdminuserService,
    private http: HttpClient,
    public langService: LanguageService,
    private auth: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.auth.clearAllSessions();

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.inviteError = this.langService.t('adminAcceptInvite.invalidTitle');
      return;
    }
    this.adminUserSvc.validateInviteToken(this.token).subscribe({
      next: (data) => {
        this.inviteInfo = data;
        if (data.lang) {
          this.langService.setLang(data.lang);
        }
      },
      error: (err) => {
        this.inviteError = err.error?.error || this.langService.t('adminAcceptInvite.invalidTitle');
      },
    });
  }

  get passwordMismatch(): boolean {
    return !!this.confirmPassword && this.password !== this.confirmPassword;
  }

  onSubmit(): void {
    if (!this.name.trim() || !this.password || this.passwordMismatch) return;
    this.submitting = true;
    this.submitError = '';

    this.adminUserSvc.acceptInvite(this.token, this.name.trim(), this.password).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
      },
      error: (err) => {
        this.submitting = false;
        this.submitError = err.error?.error || 'Failed to create account.';
      },
    });
  }
}
