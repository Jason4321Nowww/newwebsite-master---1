import { Injectable } from '@angular/core';
import {
  CanActivate, CanActivateChild, CanMatch,
  Route, UrlSegment, Router, UrlTree,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate, CanActivateChild, CanMatch {

  constructor(private router: Router) {}

  private decodeToken(token: string): any | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  private checkAuth(): boolean | UrlTree {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      return this.router.createUrlTree(['/admin/admin-signin']);
    }

    const payload = this.decodeToken(token);

    // Token missing, malformed, or expired
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      localStorage.removeItem('adminToken');
      return this.router.createUrlTree(['/admin/admin-signin']);
    }

    return true;
  }

  canActivate(): boolean | UrlTree      { return this.checkAuth(); }
  canActivateChild(): boolean | UrlTree { return this.checkAuth(); }
  canMatch(_route: Route, _segments: UrlSegment[]): boolean | UrlTree { return this.checkAuth(); }
}
