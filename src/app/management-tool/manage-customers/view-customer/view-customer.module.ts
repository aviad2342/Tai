import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewCustomerPageRoutingModule } from './view-customer-routing.module';

import { ViewCustomerPage } from './view-customer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewCustomerPageRoutingModule
  ],
  declarations: [ViewCustomerPage]
})
export class ViewCustomerPageModule {}
