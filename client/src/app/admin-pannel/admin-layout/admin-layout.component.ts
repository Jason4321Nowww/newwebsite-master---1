import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent  {
  selectedPage = 'admin-layout';
  isSidebarCollapsed = false;
  

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onItemSelected(key: string) {
    this.selectedPage = key;
  }


}
