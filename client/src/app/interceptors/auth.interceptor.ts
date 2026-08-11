import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackBar: MatSnackBar) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const alreadyHasAuth = req.headers.has('Authorization');
    const isAdmin = req.url.includes('/api/admin') || alreadyHasAuth;

    let authReq = req;
    if (!alreadyHasAuth) {
      const token = req.url.includes('/api/admin')
        ? localStorage.getItem('adminToken')
        : localStorage.getItem('token');
      authReq = token
        ? req.clone({setHeaders: {Authorization: `Bearer ${token}`}})
        : req;
    }

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          const code = err.error?.code;
          if (isAdmin) {
            localStorage.removeItem('adminToken');
            this.snackBar.open(
              code === 'TOKEN_EXPIRED'
                ? 'Admin session expired. Please sign in again.'
                : 'Admin authentication required.',
              'Close', {duration: 4000}
            );
            this.router.navigate(['/admin/admin-signin']);
          } else {
            ['token', 'tokenExpiry', 'username', 'id', 'roleLevel', 'userLocation']
              .forEach(k => localStorage.removeItem(k));
            this.snackBar.open(
              code === 'TOKEN_EXPIRED'
                ? 'Your session has expired. Please sign in again.'
                : 'Please sign in to continue.',
              'Close', {duration: 4000}
            );
            this.router.navigate(['/signin']);
          }
        } else if (err.status === 429) {
          this.snackBar.open(
            'Too many requests. Please slow down.',
            'Close', {duration: 5000}
          );
        }
        return throwError(() => err);
      })
    );
  }
}
