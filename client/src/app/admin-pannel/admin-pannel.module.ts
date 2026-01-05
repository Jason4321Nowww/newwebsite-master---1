import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminPannelRoutingModule } from './admin-pannel-routing.module';
import { AdminInfobannerComponent } from './admin-infobanner/admin-infobanner.component';
import { AdminEventsComponent } from './admin-events/admin-events.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminArticlesComponent } from './admin-articles/admin-articles.component';
import { AdminShopComponent } from './admin-shop/admin-shop.component';
import { SafePipe } from '../pipes/safe.pipe';
import { AdminVideosComponent } from './admin-videos/admin-videos.component';
import { AdminPressComponent } from './admin-press/admin-press.component';
import { AdminUserComponent } from './admin-user/admin-user.component';
import { AdminActionComponent } from './admin-action/admin-action.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminContactsComponent } from './admin-contacts/admin-contacts.component';
import { AdminSignupComponent } from './admin-signup/admin-signup.component';
import { AdminSigninComponent } from './admin-signin/admin-signin.component';
import { AdminEmailComponent } from './admin-email/admin-email.component';


@NgModule({
  declarations: [
    AdminLayoutComponent, 
   AdminInfobannerComponent, 
   AdminEventsComponent,
    SidebarComponent,
    AdminArticlesComponent,
    AdminShopComponent,
    AdminVideosComponent,
    AdminPressComponent,
    AdminUserComponent,
    AdminActionComponent,
    AdminOrdersComponent,
    AdminContactsComponent,
    AdminSignupComponent,
    AdminSigninComponent,
    AdminEmailComponent,
     SafePipe
  ],
  imports: [
    CommonModule,
    AdminPannelRoutingModule,
    MatIconModule,
    MatTooltipModule, 
    ReactiveFormsModule,
    FormsModule,
   
  ]
})
export class AdminPannelModule { }
