import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageOrdersPageRoutingModule } from './manage-orders-routing.module';

import { ManageOrdersPage } from './manage-orders.page';
import { NgxDatatableModule } from '../../../../projects/swimlane/ngx-datatable/src/public-api';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageOrdersPageRoutingModule,
    NgxDatatableModule,
    SharedModule
  ],
  declarations: [ManageOrdersPage]
})
export class ManageOrdersPageModule {}
