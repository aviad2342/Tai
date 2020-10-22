import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageItemsPageRoutingModule } from './manage-items-routing.module';

import { ManageItemsPage } from './manage-items.page';
import { NgxDatatableModule } from 'projects/swimlane/ngx-datatable/src/public-api';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageItemsPageRoutingModule,
    NgxDatatableModule,
    SharedModule
  ],
  declarations: [ManageItemsPage]
})
export class ManageItemsPageModule {}
