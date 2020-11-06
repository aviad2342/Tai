import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageCustomersPageRoutingModule } from './manage-customers-routing.module';

import { ManageCustomersPage } from './manage-customers.page';
import { NgxDatatableModule } from '../../../../projects/swimlane/ngx-datatable/src/public-api';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageCustomersPageRoutingModule,
    NgxDatatableModule,
    SharedModule
  ],
  declarations: [ManageCustomersPage]
})
export class ManageCustomersPageModule {}
