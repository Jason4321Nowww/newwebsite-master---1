import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
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
  userLocation: { kantonCode: string; kantonName: string; bezirk: string; gemeinde: string } | string;
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = '/api/auth';

  private _userName = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  userName$ = this._userName.asObservable();

  constructor(private router:Router, private snackBar: MatSnackBar ,private http:HttpClient) { }

  setSession(res: { token: string; username: string; id: string; roleLevel: number; userLocation?: any }): void {
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    localStorage.setItem('token', res.token);
    localStorage.setItem('tokenExpiry', String(expiry));
    localStorage.setItem('username', res.username);
    localStorage.setItem('id', res.id);
    localStorage.setItem('roleLevel', String(res.roleLevel));
    if (res.userLocation) {
      localStorage.setItem('userLocation', JSON.stringify(res.userLocation));
    }
    this._userName.next(res.username);
  }

  signup(data: { username: string; email: string; password: string; userLocation?: any; registrationKey?: string; lang?: string }): Observable<{ message: string; userId: string }> {
    return this.http.post<{ message: string; userId: string }>(`${this.baseUrl}/signup`, data);
  }

  verifyEmailOtp(userId: string, otp: string, registrationKey = ''): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/verify-email-otp`, { userId, otp, registrationKey });
  }

  resendEmailOtp(userId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/resend-email-otp`, { userId });
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
  const expiry = localStorage.getItem('tokenExpiry');
  if (!token || !expiry) return false;
  if (Date.now() > Number(expiry)) {
    this.clearSession();
    return false;
  }
  return true;
}

private clearSession(): void {
  ['token', 'tokenExpiry', 'username', 'id', 'roleLevel', 'userLocation'].forEach(k => localStorage.removeItem(k));
  this._userName.next(null);
}



 logout() {
  this.clearSession();
  sessionStorage.clear();
  this.snackBar.open('Logged out successfully', 'Close', { duration: 3000 });
  this.router.navigate(['/signin']);
}

}
