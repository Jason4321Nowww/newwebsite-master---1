import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  // standalone: true,
  // imports: [],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  signinForm:FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  signin() {
    if (this.signinForm.invalid) return;

    this.auth.signin(this.signinForm.value).subscribe({
      next: (res) => {
        alert('Login successful!');
      localStorage.setItem('username', res.username);
      localStorage.setItem('token', res.token);
      localStorage.setItem('id', res.id);
      localStorage.setItem('roleLevel', String(res.roleLevel));
      localStorage.setItem('tokenExpiry', String(Date.now() + 15 * 24 * 60 * 60 * 1000)); // 15 days

      console.log('🟢 User roleLevel:', res.roleLevel);


     
      
        this.router.navigate(['/']);
   
    },
    error: (err) => alert(err.error.message)
  });
  }


}
