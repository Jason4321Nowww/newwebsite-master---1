import { Component } from '@angular/core';
import { AdminauthService } from '../admin-services/adminauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-signin',
  templateUrl: './admin-signin.component.html',
  styleUrl: './admin-signin.component.scss'
})
export class AdminSigninComponent {

 email = '';
  password = '';

  constructor(private adminauth: AdminauthService, private router: Router) {}

  onLogin(): void {
    this.adminauth.loginAdmin({ email: this.email, password: this.password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('adminToken', res.adminToken);
          alert('Login successful!');
          this.router.navigateByUrl('/admin/admin-articles');
        },
        error: (err) => {
          alert(err.error?.error || 'Login failed');
        }
      });
  }

}
