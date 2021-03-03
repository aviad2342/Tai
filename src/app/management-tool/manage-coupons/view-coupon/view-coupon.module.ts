import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCouponPageRoutingModule } from './view-coupon-routing.module';

import { ViewCouponPage } from './view-coupon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCouponPageRoutingModule
  ],
  declarations: [ViewCouponPage]
})
export class ViewCouponPageModule {}
