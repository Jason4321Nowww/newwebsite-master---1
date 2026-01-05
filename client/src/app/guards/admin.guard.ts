import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router) {}

  private checkAuth(): boolean | UrlTree {
    const adminToken = localStorage.getItem('adminToken');
    console.log('Token in AdminGuard:', adminToken);

    if (adminToken) {
      if (this.router.url === '/admin') {
        return this.router.createUrlTree(['/admin/admin-articles']);
      }
      return true;
    } else {
      return this.router.createUrlTree(['/admin/admin-signin']);
    }
  }

  canActivate(): boolean | UrlTree {
    return this.checkAuth();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkAuth();
  }
}





















// import { Injectable } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(): boolean | UrlTree {
//     const adminToken = localStorage.getItem('adminToken');
//      console.log('Token in AdminGuard:', adminToken);
//     if (adminToken) {
//       // If already on /admin (not a child route), redirect to admin-articles
//       if (this.router.url === '/admin') {
//         return this.router.createUrlTree(['/admin/admin-articles']);
//       }
//       return true;
//     } else {
//       return this.router.createUrlTree(['/admin/admin-signin']);
//     }
//   }
// }
