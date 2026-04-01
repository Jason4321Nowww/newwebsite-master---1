import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminInfobannerComponent } from './admin-infobanner/admin-infobanner.component';
import { AdminEventsComponent } from './admin-events/admin-events.component';
import { AdminArticlesComponent } from './admin-articles/admin-articles.component';
import { AdminPressComponent } from './admin-press/admin-press.component';
import { AdminShopComponent } from './admin-shop/admin-shop.component';
import { AdminVideosComponent } from './admin-videos/admin-videos.component';
import { AdminGuard } from '../guards/admin.guard';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminActionComponent } from './admin-action/admin-action.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminContactsComponent } from './admin-contacts/admin-contacts.component';
import { AdminEmailComponent } from './admin-email/admin-email.component';


const routes: Routes = [
 


  // ✅ Protected admin layout with children
  {
    path: '',
    component: AdminLayoutComponent,
    canActivateChild: [AdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin-articles'
      },
      { path: 'admin-articles',   component: AdminArticlesComponent,  data: { title: 'Articles',    icon: 'article' } },
      { path: 'admin-infobanner', component: AdminInfobannerComponent, data: { title: 'Info Banner',  icon: 'campaign' } },
      { path: 'admin-events',     component: AdminEventsComponent,     data: { title: 'Events',       icon: 'event' } },
      { path: 'admin-press',      component: AdminPressComponent,      data: { title: 'Press',        icon: 'description' } },
      { path: 'admin-shop',       component: AdminShopComponent,       data: { title: 'Shop',         icon: 'storefront' } },
      { path: 'admin-videos',     component: AdminVideosComponent,     data: { title: 'Videos',       icon: 'video_library' } },
      { path: 'admin-user',       component: AdminUserComponent,       data: { title: 'Users',        icon: 'manage_accounts' } },
      { path: 'admin-action',     component: AdminActionComponent,     data: { title: 'Actions',      icon: 'flag' } },
      { path: 'admin-orders',     component: AdminOrdersComponent,     data: { title: 'Orders',       icon: 'list_alt' } },
      { path: 'admin-contacts',   component: AdminContactsComponent,   data: { title: 'Contacts',     icon: 'manage_contacts' } },
      { path: 'admin-emails',     component: AdminEmailComponent,      data: { title: 'Emails',       icon: 'email' } }
    ]
  }
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPannelRoutingModule { }
