import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminuserService {
private apiUrl = 'http://localhost:5000/api/auth/users';
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
    headers: {
      Authorization: `Bearer ${adminToken}`
    }
  });
}


}
