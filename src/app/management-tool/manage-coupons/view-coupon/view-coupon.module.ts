import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCouponPageRoutingModule } from './view-coupon-routing.module';

import { ViewCouponPage } from './view-coupon.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCouponPageRoutingModule,
    SharedModule
  ],
  providers: [
    PercentPipe,
    { provide: LOCALE_ID, useValue: 'he-HE' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'he-HE'}
  ],
  declarations: [ViewCouponPage]
})
export class ViewCouponPageModule {}
