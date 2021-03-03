import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageCouponsPage } from './manage-coupons.page';

const routes: Routes = [
  {
    path: '',
    component: ManageCouponsPage
  },
  {
    path: 'new',
    loadChildren: () => import('./add-coupon/add-coupon.module').then( m => m.AddCouponPageModule)
  },
  {
    path: 'edit/:code',
    loadChildren: () => import('./edit-coupon/edit-coupon.module').then( m => m.EditCouponPageModule)
  },
  {
    path: 'view/:code',
    loadChildren: () => import('./view-coupon/view-coupon.module').then( m => m.ViewCouponPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageCouponsPageRoutingModule {}
