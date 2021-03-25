import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageUpdatesPageRoutingModule } from './manage-updates-routing.module';

import { ManageUpdatesPage } from './manage-updates.page';
import { NgxDatatableModule } from 'projects/swimlane/ngx-datatable/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageUpdatesPageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ManageUpdatesPage]
})
export class ManageUpdatesPageModule {}
