// sidebar.component.ts
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar'; // optional for toast
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AdminauthService } from '../admin-services/adminauth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<string>();

  menuItems = [
    { label: 'Articles', icon: 'article', key: 'admin-articles' },
    { label: 'Inforbanner', icon: 'campaign', key: 'admin-infobanner' },
    { label: 'Events', icon: 'event', key: 'admin-events' },
     { label: 'Actions', icon: 'flag', key: 'admin-action' },
    { label: 'Videos', icon: 'video_library', key: 'admin-videos' },
    { label: 'Emails', icon: 'email', key: 'admin-emails' },
    { label: 'Press', icon: 'description', key: 'admin-press' },
    { label: 'Shop', icon: 'storefront', key: 'admin-shop' },
    { label: 'User', icon: 'manage_accounts', key: 'admin-user' },
    { label: 'Orders', icon: 'manage_accounts', key: 'admin-orders' },
    { label: 'Contacts', icon: 'manage_contacts', key: 'admin-contacts' },
    { label: 'Logout', icon: 'logout', key: 'logout', danger: true }
  ];

  activeItem = 'dashboard';
  sidebarCollapsed = false;

 constructor(
  private breakpointObserver: BreakpointObserver,
  private router: Router,
  private auth:AuthService,
  private authAdmin:AdminauthService,
  private snackBar: MatSnackBar // optional
) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.sidebarCollapsed = result.matches;
      });
  }

  selectItem(key: string) {
 if (key === 'logout') {
    this.authAdmin.logoutAdmin();
    return;
  }

    this.activeItem = key;
    this.itemSelected.emit(key);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
