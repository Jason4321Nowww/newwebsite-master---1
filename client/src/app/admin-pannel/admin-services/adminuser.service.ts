import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminuserService {
private apiUrl    = 'http://localhost:5000/api/auth/users';
  private adminApi  = 'http://localhost:5000/api/admin';
  constructor(private http: HttpClient) { }
getAllUsers(): Observable<any[]> {
  const adminToken = localStorage.getItem('adminToken');
    return this.http.get<any[]>(this.apiUrl, {
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  });
  }

  updateUser(userId: string, update: any): Observable<any> {
     const adminToken = localStorage.getItem('adminToken');
    return this.http.patch(`${this.apiUrl}/${userId}`, update, {
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  });
  }

    /* ✅ delete user */
  deleteUser(userId: string): Observable<any> {
    const adminToken = localStorage.getItem('adminToken');
    return this.http.delete(`${this.apiUrl}/${userId}`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
  }

   /**
   * Create or update the registration key (4-digit code)
   */
  createOrUpdateRegistrationKey(key: string): Observable<any> {
    const adminToken = localStorage.getItem('adminToken');
    return this.http.post(`${this.apiUrl}/registration-key`, { key }, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });
  }
  /* get key */
  getKeyInfo(): Observable<any> {
    const adminToken = localStorage.getItem('adminToken');
    return this.http.get(`${this.apiUrl}/registration-key`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
  }

  private adminHeaders() {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };
  }

  sendInvite(email: string, roleLevel: number, userLocation?: any): Observable<any> {
    return this.http.post(`${this.adminApi}/invite`, { email, roleLevel, userLocation }, this.adminHeaders());
  }

  getInvites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminApi}/invites`, this.adminHeaders());
  }

  getPendingAdmins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminApi}/pending-admins`, this.adminHeaders());
  }

  activateAdmin(adminId: string): Observable<any> {
    return this.http.patch(`${this.adminApi}/activate/${adminId}`, {}, this.adminHeaders());
  }

  // Public — no auth needed
  validateInviteToken(token: string): Observable<any> {
    return this.http.get(`${this.adminApi}/invite/${token}`);
  }

  acceptInvite(token: string, name: string, password: string, registrationKey: string): Observable<any> {
    return this.http.post(`${this.adminApi}/invite/${token}/accept`, { name, password, registrationKey });
  }

  // ── User invite (sends invite to regular users) ──
  private authApi = 'http://localhost:5000/api/auth';

  sendUserInvite(email: string, roleLevel: number, userLocation: any): Observable<any> {
    return this.http.post(`${this.authApi}/invite-user`, { email, roleLevel, userLocation }, this.adminHeaders());
  }

  getUserInvites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.authApi}/user-invites`, this.adminHeaders());
  }
}
