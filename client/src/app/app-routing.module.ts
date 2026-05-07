import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImpressumComponent } from './impressum/impressum.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { ActionsComponent } from './actions/actions.component';
import { EventsComponent } from './events/events.component';
import { AboutComponent } from './about/about.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleComponent } from './article/article.component';
import { SignupComponent } from './auth-components/signup/signup.component';
import { SigninComponent } from './auth-components/signin/signin.component';
import { AdminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { PressComponent } from './press/press.component';
import { PressDetailComponent } from './press-detail/press-detail.component';
import { ShopComponent } from './shop-components/shop/shop.component';
import { ProductDetailComponent } from './shop-components/product-detail/product-detail.component';
import { OrderPageComponent } from './shop-components/order-page/order-page.component';
import { CartDetailsComponent } from './shop-components/cart-details/cart-details.component';
import { ValuesComponent } from './values/values.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ShortsVideoPlayer } from './shorts-videoplayer/shorts-videoplayer.component';
import { AdminSigninComponent } from './admin-pannel/admin-signin/admin-signin.component';
import { AdminAcceptInviteComponent } from './admin-pannel/admin-accept-invite/admin-accept-invite.component';
import { SpecialMemberPageComponent } from './special-member-page/special-member-page.component';
import { AcceptUserInviteComponent } from './accept-user-invite/accept-user-invite.component';
import { VerifyEmailComponent } from './auth-components/verify-email/verify-email.component';
import { BankPaymentComponent } from './shop-components/bank-payment/bank-payment.component';



const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'values', component: ValuesComponent },
  { path: 'videos', component: ShortsVideoPlayer },
  { path: 'contact-form', component: ContactFormComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'actions', component: ActionsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'press', component: PressComponent },
  { path: 'press/:id', component: PressDetailComponent },
  { path: 'about', component: AboutComponent },
  { path: 'article-list', component: ArticleListComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'order', component: OrderPageComponent },
  { path: 'bank-payment', component: BankPaymentComponent },
  { path: 'cart-details', component: CartDetailsComponent },

 { path: 'special-member-page', component: SpecialMemberPageComponent,
  canActivate: [authGuard] 
  },

  // Public routes — no auth guard
  { path: 'accept-user-invite',   component: AcceptUserInviteComponent },
  { path: 'verify-email',         component: VerifyEmailComponent },

  // Public admin routes — no layout, no guard
  { path: 'admin/admin-signin',   component: AdminSigninComponent },
  { path: 'admin/accept-invite',  component: AdminAcceptInviteComponent },
  // Signup removed — admins are invited only
  { path: 'admin/admin-signup',   redirectTo: 'admin/admin-signin', pathMatch: 'full' },
  // Lazy-loaded Admin Panel — canMatch prevents the bundle from loading for unauthenticated users
  {
    path: 'admin',
    canMatch: [AdminGuard],
    loadChildren: () =>
      import('./admin-pannel/admin-pannel.module').then(m => m.AdminPannelModule),
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 64] 
   })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
