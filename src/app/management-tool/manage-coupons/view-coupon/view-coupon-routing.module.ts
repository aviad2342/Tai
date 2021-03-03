import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewCouponPage } from './view-coupon.page';

const routes: Routes = [
  {
    path: '',
    component: ViewCouponPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewCouponPageRoutingModule {}
