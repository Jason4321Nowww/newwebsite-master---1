import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  serverError = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    public langService: LanguageService
  ) {}

  signinForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  signin() {
    if (this.signinForm.invalid) return;
    this.serverError = '';

    this.auth.signin(this.signinForm.value).subscribe({
      next: (res) => {
        this.auth.setSession(res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        const status = err.status;
        const code   = err.error?.code || '';
        const msg    = err.error?.message || '';
        if (code === 'EMAIL_NOT_VERIFIED') {
          this.router.navigate(['/verify-email'], { queryParams: { uid: err.error.userId } });
        } else if (status === 401 || msg.toLowerCase().includes('invalid')) {
          this.serverError = this.langService.t('signin.errInvalid');
        } else if (msg.toLowerCase().includes('not active') || msg.toLowerCase().includes('inactive') || msg.toLowerCase().includes('not yet activated')) {
          this.serverError = this.langService.t('signin.errInactive');
        } else if (code === 'ROLE_TOO_LOW' || msg.toLowerCase().includes('sufficient membership')) {
          this.serverError = this.langService.t('signin.errPublicRole');
        } else {
          this.serverError = this.langService.t('signin.errGeneral');
        }
      }
    });
  }
}
