import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageTreatmentsPageRoutingModule } from './manage-treatments-routing.module';

import { ManageTreatmentsPage } from './manage-treatments.page';
import { NgxDatatableModule } from 'projects/swimlane/ngx-datatable/src/public-api';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageTreatmentsPageRoutingModule,
    NgxDatatableModule,
    SharedModule
  ],
  declarations: [ManageTreatmentsPage]
})
export class ManageTreatmentsPageModule {}
