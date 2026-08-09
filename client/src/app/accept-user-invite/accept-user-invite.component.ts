import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {LanguageService} from 'src/app/services/language.service';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-accept-user-invite',
  templateUrl: './accept-user-invite.component.html',
  styleUrl: './accept-user-invite.component.scss'
})
export class AcceptUserInviteComponent implements OnInit {
  private readonly apiBase = '/api/auth';

  token = '';
  inviteInfo: { email: string; roleName: string; roleLevel: number; lang: string } | null = null;
  inviteError = '';
  inviteExpired = false;

  username = '';
  password = '';
  confirmPassword = '';
  otp = '';

  submitting = false;
  submitted = false;
  submitError = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public langService: LanguageService,
    private auth: AuthService,
  ) {
  }

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
  }

  get passwordMismatch(): boolean {
    return !!this.confirmPassword && this.password !== this.confirmPassword;
  }

  onSubmit(): void {
    if (!this.username.trim() || !this.password || !this.otp.trim() || this.passwordMismatch) return;
    this.submitting = true;
    this.submitError = '';

    this.http.post<any>(`${this.apiBase}/user-invite/${this.token}/accept`, {
      username: this.username.trim(),
      password: this.password,
      otp: this.otp.trim(),
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
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
