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
      { path: 'admin-articles', component: AdminArticlesComponent },
      { path: 'admin-infobanner', component: AdminInfobannerComponent },
      { path: 'admin-events', component: AdminEventsComponent },
      { path: 'admin-press', component: AdminPressComponent },
      { path: 'admin-shop', component: AdminShopComponent },
      { path: 'admin-videos', component: AdminVideosComponent },
      { path: 'admin-user', component: AdminUserComponent },
      { path: 'admin-action', component: AdminActionComponent },
      { path: 'admin-orders', component: AdminOrdersComponent },
      { path: 'admin-contacts', component: AdminContactsComponent },
      {path:'admin-emails', component:AdminEmailComponent}
    ]
  }
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPannelRoutingModule { }
