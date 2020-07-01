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
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
