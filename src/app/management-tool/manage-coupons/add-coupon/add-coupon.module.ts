import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PercentPipe } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AddCouponPageRoutingModule } from './add-coupon-routing.module';

import { AddCouponPage } from './add-coupon.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCouponPageRoutingModule
  ],
  providers: [
    PercentPipe,
    { provide: LOCALE_ID, useValue: 'he-HE' }
  ],
  declarations: [AddCouponPage]
})
export class AddCouponPageModule {}
