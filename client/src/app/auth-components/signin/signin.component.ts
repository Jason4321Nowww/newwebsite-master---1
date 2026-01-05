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
      localStorage.setItem('username', res.username); // ✅ Save username
       localStorage.setItem('token', res.token); // 👈 Store token
       localStorage.setItem('id', res.id); // ✅ Save user ID

       localStorage.setItem('roleLevel', String(res.roleLevel)); // ✅ Store roleLevel

      console.log('🟢 User roleLevel:', res.roleLevel); // ✅ use it as needed


     
      
        this.router.navigate(['/']);
   
    },
    error: (err) => alert(err.error.message)
  });
  }


}
