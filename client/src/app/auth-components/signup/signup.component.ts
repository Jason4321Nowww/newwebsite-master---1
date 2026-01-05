import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(private fb:FormBuilder, private auth:AuthService, private router:Router){ }

 signupForm:FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    registrationKey: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{4}$/)]]
  });

   signup() {
    if (this.signupForm.invalid) return;

    const payload = this.signupForm.value;
    this.auth.signup(payload).subscribe({
      next: (res) => {
        alert('Signup successful!');
        this.router.navigate(['/signin']);
      },
      error: (err) => alert(err.error.message)
    });
  }


}
