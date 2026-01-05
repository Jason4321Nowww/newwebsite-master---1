import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AdminauthService {

    private baseUrl = 'http://localhost:5000/api/admin';

  constructor(private router:Router, private snackBar: MatSnackBar, private http: HttpClient) {}

  registerAdmin(adminData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/adminRegister`, adminData);
  }

  loginAdmin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/adminSignin`, credentials);
  }

   logoutAdmin() {
  localStorage.removeItem('adminToken');
  sessionStorage.clear();
  this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  this.router.navigate(['/admin/admin-signin']);
}
}
