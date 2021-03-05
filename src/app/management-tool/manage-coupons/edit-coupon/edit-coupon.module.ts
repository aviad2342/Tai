import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCouponPageRoutingModule } from './edit-coupon-routing.module';

import { EditCouponPage } from './edit-coupon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCouponPageRoutingModule
  ],
  providers: [
    PercentPipe,
    { provide: LOCALE_ID, useValue: 'he-HE' }
  ],
  declarations: [EditCouponPage]
})
export class EditCouponPageModule {}
