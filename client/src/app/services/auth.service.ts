import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


export interface AuthResponse {
  message: string;
  username: string;
  isAdmin: boolean;
  token: string;
  id: string; // ✅ Add this
  roleLevel: number,
  userLocation: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private router:Router, private snackBar: MatSnackBar ,private http:HttpClient) { }

  signup(data: { username: string; password: string; registrationKey: string  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, data);
  }

  signin(data: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signin`, data);
  }
 
getCurrentUser(): Observable<User> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');
  return this.http.get<User>(`${this.baseUrl}/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


isLoggedIn(): boolean {
  const token = localStorage.getItem('token');
  console.log('🧪 Checking token in localStorage:', token);
  return !!token;
}



 logout() {
  localStorage.removeItem('token');
  sessionStorage.clear();
  this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  this.router.navigate(['/signin']);
}

}
