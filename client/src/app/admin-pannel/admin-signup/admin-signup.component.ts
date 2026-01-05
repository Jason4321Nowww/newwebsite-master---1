import { Component } from '@angular/core';
import { AdminauthService } from '../admin-services/adminauth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrl: './admin-signup.component.scss'
})
export class AdminSignupComponent {

   name = '';
  email = '';
  password = '';

  constructor(private adminauth: AdminauthService, private router: Router) {}

  onSubmit(): void {
    this.adminauth.registerAdmin({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: () => {
          alert('Admin registered successfully!');
          this.router.navigate(['/admin/admin-signin']);
        },
        error: (err) => {
          alert(err.error?.error || 'Registration failed');
        }
      });
  }


}
