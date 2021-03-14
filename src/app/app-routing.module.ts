import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then( m => m.UserPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'store',
    loadChildren: () => import('./store/store.module').then( m => m.StorePageModule), canLoad: [AuthGuard]
  },
  {
    path: 'event',
    loadChildren: () => import('./event/event.module').then( m => m.EventPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'article',
    loadChildren: () => import('./article/article.module').then( m => m.ArticlePageModule), canLoad: [AuthGuard]
  },
  {
    path: 'course',
    loadChildren: () => import('./course/course.module').then( m => m.CoursePageModule), canLoad: [AuthGuard]
  },
  {
    path: 'manage',
    loadChildren: () => import('./management-tool/management-tool.module').then( m => m.ManagementToolPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'therapist',
    loadChildren: () => import('./therapist/therapist.module').then( m => m.TherapistPageModule)
  },
  {
    path: 'treatment',
    loadChildren: () => import('./treatment/treatment.module').then( m => m.TreatmentPageModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then( m => m.CustomerPageModule)
  },
  {
    path: 'order/:id',
    loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'cart/:id',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu-tab/menu-tab.module').then( m => m.MenuTabPageModule), canLoad: [AuthGuard]
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canLoad: [AuthGuard]
  },
  {
    path: 'verification',
    loadChildren: () => import('./verification/verification.module').then( m => m.VerificationPageModule)
  },
  {
    path: 'testimony',
    loadChildren: () => import('./testimony/testimony.module').then( m => m.TestimonyPageModule)
  },
  {
    path: 'passwordreset',
    loadChildren: () => import('./password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: 'forgotpassword',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
