import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageCouponsPageRoutingModule } from './manage-coupons-routing.module';

import { ManageCouponsPage } from './manage-coupons.page';
import { NgxDatatableModule } from 'projects/swimlane/ngx-datatable/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageCouponsPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ManageCouponsPage]
})
export class ManageCouponsPageModule {}
