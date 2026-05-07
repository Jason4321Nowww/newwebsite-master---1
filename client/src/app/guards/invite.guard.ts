import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

/**
 * Restricts access to routes that require invite privileges.
 * Only Superadmin (0), Vorsitzende/Chairperson (1) and Vorstand/Board (2) may proceed.
 */
@Injectable({ providedIn: 'root' })
export class InviteGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return this.router.createUrlTree(['/admin/admin-signin']);

      const payload = JSON.parse(atob(token.split('.')[1]));
      const roleLevel: number = payload?.roleLevel ?? 99;

      if (roleLevel <= 2) return true;

      // Redirect back to the main admin panel if role is insufficient
      return this.router.createUrlTree(['/admin/admin-articles']);
    } catch {
      return this.router.createUrlTree(['/admin/admin-signin']);
    }
  }
}
